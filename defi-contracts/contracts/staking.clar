(define-constant ERR-NOT-AUTHORIZED (err u1))
(define-constant ERR-INVALID-AMOUNT (err u2))
(define-constant ERR-INSUFFICIENT-BALANCE (err u3))
(define-constant ERR-INSUFFICIENT-STSTX (err u4))

;; Define the staking contract
;; sender sends STX to this contract
;; This contract mints the liquid token 1:1 back to the sender

(define-private (get-user-stSTX-balance (sender principal)) 
(unwrap! (contract-call? .stacked-stx get-balance sender) u0))

(define-private (get-contract-stx-balance) 
    (stx-get-balance (as-contract tx-sender)))

(define-public (stake-stx (stx-amount uint))
  (begin
    (asserts! (> stx-amount u0) ERR-INVALID-AMOUNT)
    ;; send STX from tx-sender to the contract
    (try! (stx-transfer? stx-amount tx-sender (as-contract tx-sender)))
    ;; send tokens from tx-sender to the contract
    (contract-call? .stacked-stx mint stx-amount tx-sender)
  )
)

(define-public (unstake-stx (token-amount uint))
    (let (
      (user-stSTX-balance (get-user-stSTX-balance tx-sender))
      (user-address tx-sender)
      (contract-address (as-contract tx-sender))
    )
        (asserts! (> token-amount u0) ERR-INVALID-AMOUNT)
        ;; check user has more stacked stx than stx 
        (asserts! (>= user-stSTX-balance token-amount) ERR-INSUFFICIENT-STSTX)
        ;; transfer users stSTX to contrct
        (try! (contract-call? .stacked-stx transfer token-amount tx-sender (as-contract tx-sender)  (some 0x0000000000000000000000000000000000)))
        ;; ;; transfer equivalent STX to users account from contract
        (try! (as-contract (stx-transfer? token-amount contract-address user-address)))
        ;; ;; burn the equivalent amount of stSTX tokens transferred
        (contract-call? .stacked-stx burn token-amount (as-contract tx-sender))
    )
  )