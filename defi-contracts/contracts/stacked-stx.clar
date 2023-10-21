(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)


(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-amount-zero (err u102))
(define-constant err-not-authorized (err u103))
(define-constant err-insufficient-funds (err u104))

;; Define the address for the staking contract
;; Set initially to contract owner, will change 
(define-data-var staking-contract principal contract-owner)

;; No maximum supply!
(define-fungible-token stacked-stx)

(define-read-only (get-name)
    (ok "stacked-stx")
)

(define-read-only (get-symbol)
    (ok "stSTX")
)

(define-read-only (get-decimals)
    (ok u6)
)

(define-read-only (get-balance (who principal))
    (ok (ft-get-balance stacked-stx who))
)

(define-read-only (get-total-supply)
    (ok (ft-get-supply stacked-stx))
)


(define-read-only (get-token-uri)
    (ok none)
)

;; (define-public (set-staking-contract (staking-contract-add principal))
;;     (begin
;;         (asserts! (is-eq tx-sender contract-owner) err-not-authorized)
;;         ;; #[allow(unchecked_data)]
;;         (var-set staking-contract staking-contract-add)
;;         (ok true)
;;     )
;; )

;; Define transfer function (any user can transfer their token to another user)
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
    (begin
        (asserts! (is-eq tx-sender sender) err-not-token-owner)
        (asserts! (> amount u0) err-amount-zero)
        ;; #[allow(unchecked_data)]
        (try! (ft-transfer? stacked-stx amount sender recipient))
        (match memo to-print (print to-print) 0x)
        (ok true)
    )
)

;; Define mint function (only allow the staking contract to mint new tokens)
(define-public (mint (amount uint) (recipient principal))
    (begin
        (asserts! (is-eq tx-sender (var-get staking-contract)) err-not-authorized)
        (asserts! (> amount u0) err-amount-zero)
        ;; #[allow(unchecked_data)]
        (ft-mint? stacked-stx amount recipient)
    )
)
;; Define burning function (only allow staking contract to burn tokens)
;; Only tokens that are within the staking contract can be burned
;; (define-public (burn (amount uint))
;;     (begin
;;         (asserts! (is-eq tx-sender (var-get staking-contract)) err-not-authorized)
;;         (asserts! (> amount u0) err-amount-zero)
;;         (asserts! (>= (ft-get-balance stacked-stx (var-get staking-contract)) amount) err-insufficient-funds)
;;                 ;; #[allow(unchecked_data)]
;;         (try! (ft-burn? stacked-stx amount (var-get staking-contract)))
;;         (ok true)
;;     )
;; )

(define-public (burn (amount uint) (account principal))
    (begin
        (asserts! (or (is-eq tx-sender account) (is-eq tx-sender contract-owner)) err-not-authorized)
        (asserts! (> amount u0) err-amount-zero)
        (asserts! (>= (ft-get-balance stacked-stx account) amount) err-insufficient-funds)
        (try! (ft-burn? stacked-stx amount account))
        (ok true)
    )
)
 