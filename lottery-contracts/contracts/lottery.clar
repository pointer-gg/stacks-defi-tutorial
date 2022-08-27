;; --------------------------- errors define -----------------------------------------
(define-constant err-owner-only (err u100))

(define-constant err-lotery-is-not-open (err u200))
(define-constant err-lottery-is-not-winner-announced (err u201))
(define-constant err-lottery-is-not-closed (err u202))

(define-constant err-fee-can-not-be-zero (err u300))
(define-constant err-fee-rate-can-not-be-zero (err u301))
(define-constant err-withdraw-amount-exceed (err u302))

(define-constant err-players-is-full (err u400))
;; --------------------------- errors define -----------------------------------------

;; --------------------------- constants define -----------------------------------------
(define-constant contract-owner tx-sender)
(define-constant contract-address (as-contract tx-sender))
(define-constant max-players-size u256) ;;exclusive
;; --------------------------- constants define -----------------------------------------

;; --------------------------- variables define -----------------------------------------
;; the fee for one lottery
(define-data-var fee uint u100000)
;; entry fee rate, entry fee = fee * entry-fee-rate / 10000
(define-data-var entry-fee-rate uint u1000) ;; 10%
;; total balance of this round
;; (define-data-var total-balance uint u0)

(define-constant lottery-state-open "lottery-state-open")
(define-constant lottery-state-closed "lottery-state-closed")
(define-constant lottery-state-winner-announced "lottery-state-winner-announced")
;; the current state of this round lottery
(define-data-var lottery-state (string-ascii 30) lottery-state-open)

;; to store the players who perticipate this round lottery
(define-data-var players (list 256 principal) (list))

(define-data-var lasted-winner (optional principal) none)
(define-data-var lasted-jackpots uint u0)
;; --------------------------- variables define -----------------------------------------

(define-read-only (get-fee)
  (var-get fee)
)

;; To update the fee
;; only available to the contract owner and under the state "lottery-state-winner-announced"
(define-public (update-fee (to-fee uint))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (asserts! (is-eq (var-get lottery-state) lottery-state-winner-announced) err-lottery-is-not-winner-announced)
        (asserts! (> to-fee u0) err-fee-can-not-be-zero)

        (ok (var-set fee to-fee))
    )
)

(define-read-only (get-entry-fee-rate)
  (var-get entry-fee-rate)
)

(define-read-only (get-entry-fee)
  (let (
    (f (var-get fee))
    (f-rate (var-get entry-fee-rate))
    (enter-fee (/ (* f f-rate) u10000))
    )
    enter-fee
  )
)

;; To update the entry fee rate of fee
;; only available to the contract owner and under the state "lottery-state-winner-announced"
(define-public (update-entry-fee-rate (to-rate uint))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (asserts! (is-eq (var-get lottery-state) lottery-state-winner-announced) err-lottery-is-not-winner-announced)
        (asserts! (> to-rate u0) err-fee-rate-can-not-be-zero)

        (ok (var-set entry-fee-rate to-rate))
    )
)

(define-read-only (get-lasted-winner-info)
    {
      winner: (var-get lasted-winner),
      jackpots: (var-get lasted-jackpots)
    }
)

;; Get the amount of jackpots
(define-read-only (get-jackpots)
    ;; Due to the entry fee
    ;; so jackpots = (1 - entry-fee-rate / 10000) * fee * (len players)
    (* (len (var-get players)) (- (var-get fee) (get-entry-fee)))
)

(define-read-only (get-players)
  (var-get players)
)

(define-read-only (get-lottery-state)
  (var-get lottery-state)
)

;; To open the lottery
;; only available to the contract owner 
;; and only if the lottery is on the "lottery-state-winner-announced" state
;; then it could turn to the "lottery-state-open" state
(define-public (open-lottery)
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (asserts! (is-eq (var-get lottery-state) lottery-state-winner-announced) err-lottery-is-not-winner-announced)

        (ok (var-set lottery-state lottery-state-open))
    )
)

;; To end the lottery
;; only available to the contract owner 
;; and only if the lottery is on the "lottery-state-open" state
;; then it could turn to the "lottery-state-closed" state
(define-public (end-lottery)
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (asserts! (is-eq (var-get lottery-state) lottery-state-open) err-lotery-is-not-open)

        (ok (var-set lottery-state lottery-state-closed))
    )
)

;; To calculate the winner of this round lottery
;; only available to the contract owner 
;; and only if the lottery is on the "lottery-state-closed" state
;; then it could calculate the winner
(define-public (calculate-lottery-winner)
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (asserts! (is-eq (var-get lottery-state) lottery-state-closed) err-lottery-is-not-closed)

        (let (
            ;; calculate the winner
            (players-count (len (var-get players)))
            (winer-index (unwrap-panic (contract-call? .pseudorandom-generator get-random-number players-count)))
            (winner (get-player-by-index winer-index))
            (jackpots (get-jackpots))
        )
        
        (try! (transfer-jackpots-to-winner winner jackpots))

        (var-set lasted-winner winner)
        (var-set lasted-jackpots jackpots)
        (var-set lottery-state lottery-state-winner-announced)
        ;; empty the players list, wait to next round
        (var-set players (list))

        (ok {
            winner: winner,
            players: (var-get players),
            jackspots: jackpots
        })
        )
    )
)

(define-private (get-player-by-index (index int))
    (if (> index -1)
        (element-at (var-get players) (to-uint index))
        none
    )
)

;; To transfer jackpots to the winner
;; or when it fail to calculate the winner since it fail to get a random number
;; the jackspots will refund to every players
(define-private (transfer-jackpots-to-winner (winner (optional principal)) (jackpots uint))
    (if (is-none winner)
      ;; if there's no winer, refund to evenry players
      (begin 
        (map refund-to-player (var-get players))
        (ok true) ;; just to make the the returned match the 'if'
      )
      ;; if there is a winer, transfer to the winner
      (as-contract (stx-transfer? jackpots contract-address (unwrap-panic winner)))
    )
)

(define-private (refund-to-player (player principal))
    (   
      let (
        (enter-fee (get-entry-fee))
        (refund-amount (- (var-get fee) enter-fee))
      )

      (as-contract (stx-transfer? refund-amount contract-address player))
    )
)

(define-read-only (get-total-avaliable-entry-fee)
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (let (
            (players-count (len (var-get players)))
            (lottery-fee (var-get fee))
            (total-balance (stx-get-balance contract-address))
            ;; total-avaliable-entry-fee = total-balance of this contract - current lottery total fee
            ;; and current lottery total fee = count of players * fee for each lotery
            (total-avaliable-entry-fee (- total-balance (* players-count lottery-fee)))
        )

        (ok total-avaliable-entry-fee)
        )
    )
)

(define-public (withdraw-avaliable-entry-fee (withdraw-amount uint) (to-who principal))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (asserts! (< withdraw-amount (unwrap-panic (get-total-avaliable-entry-fee))) err-withdraw-amount-exceed)
        ;; withdraw the total avaliable entry fee to a specific address
        ;; to-who is unchecked, we allow the contract owner to transfer whoever they like
        ;; #[allow(unchecked_data)]
        (as-contract (stx-transfer? withdraw-amount contract-owner to-who))
    )
)

;; Custom function to participate in the lottery
(define-public (participate-in-lottery)
    (begin
        (asserts! (< (len (var-get players)) max-players-size) err-players-is-full)
        ;; transfer lottery fee
        (try! (stx-transfer? (var-get fee) tx-sender contract-address))
        (var-set players (unwrap-panic (as-max-len? (append (var-get players) tx-sender) u256)))
        (ok (var-get players))
    )
)
