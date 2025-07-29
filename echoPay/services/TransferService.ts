import { TransferData } from "../types/core"

interface TransferResult {
    success: boolean
    transactionId?: string
    message: string
    error?: string
    updatedBalances?: {
        checking: number
        savings: number
    }
}

interface Account {
    balance: number
    accountNumber: string
    type: string
}

class TransferService {
    private static instance: TransferService
    private accountsState: { checking: Account; savings: Account } = {
        checking: { balance: 5263, accountNumber: "1234", type: "جاري" },
        savings: { balance: 12851, accountNumber: "5678", type: "توفير" }
    }

    static getInstance(): TransferService {
        if (!TransferService.instance) {
            TransferService.instance = new TransferService()
        }
        return TransferService.instance
    }

    setAccountsState(accounts: { checking: Account; savings: Account }) {
        this.accountsState = { ...accounts }
    }

    getAccountsState() {
        return this.accountsState
    }

    async processTransfer(
        transferData: TransferData,
        otp?: string
    ): Promise<TransferResult> {
        try {
            console.log("💸 Processing transfer:", transferData)

            // Simulate OTP validation if required
            if (transferData.requires_otp && !otp) {
                return {
                    success: false,
                    message: "رمز التحقق مطلوب لإتمام التحويل",
                    error: "OTP_REQUIRED"
                }
            }

            if (transferData.requires_otp && otp) {
                // Simulate OTP validation (for demo, accept "1234")
                if (otp !== "1234") {
                    return {
                        success: false,
                        message: "رمز التحقق غير صحيح",
                        error: "INVALID_OTP"
                    }
                }
            }

            // Check source account balance
            const sourceAccount = this.accountsState[transferData.source_account]
            if (sourceAccount.balance < transferData.amount) {
                return {
                    success: false,
                    message: `رصيد ${sourceAccount.type} غير كافي للتحويل`,
                    error: "INSUFFICIENT_FUNDS"
                }
            }

            // Simulate transfer processing delay
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Generate transaction ID
            const transactionId = `TRF${Date.now()}`

            // Always succeed for hackathon demo
            const isSuccessful = true

            if (isSuccessful) {
                // Update account balance
                this.updateAccountBalance(transferData.source_account, transferData.amount)

                return {
                    success: true,
                    transactionId,
                    message: `تم تحويل ${transferData.amount} ريال إلى ${transferData.recipient_name} بنجاح`,
                    updatedBalances: {
                        checking: this.accountsState.checking.balance,
                        savings: this.accountsState.savings.balance
                    }
                }
            } else {
                return {
                    success: false,
                    message: "فشل في معالجة التحويل، يرجى المحاولة مرة أخرى",
                    error: "TRANSFER_FAILED"
                }
            }

        } catch (error) {
            console.error("❌ Transfer processing error:", error)
            return {
                success: false,
                message: "حدث خطأ في معالجة التحويل",
                error: "PROCESSING_ERROR"
            }
        }
    }

    private updateAccountBalance(accountType: "checking" | "savings", amount: number) {
        // Deduct amount from source account
        this.accountsState[accountType].balance -= amount
        console.log(`💰 Updated ${accountType} balance: ${this.accountsState[accountType].balance} SAR`)
    }

    async validateOTP(otp: string): Promise<boolean> {
        // Simulate OTP validation
        // For demo, accept "1234" as valid OTP
        return otp === "1234"
    }

    generateOTP(): string {
        // For demo, always return "1234"
        // In real app, this would generate a random OTP and send it via SMS
        return "1234"
    }

    getAvailableBalance(accountType: "checking" | "savings"): number {
        return this.accountsState[accountType].balance
    }

    getAccountDisplay(accountType: "checking" | "savings"): string {
        const account = this.accountsState[accountType]
        return accountType === "checking" 
            ? `الحساب الجاري (${account.accountNumber})`
            : `حساب التوفير (${account.accountNumber})`
    }
}

export default TransferService.getInstance()