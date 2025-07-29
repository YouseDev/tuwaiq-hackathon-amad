import { Bill, BillPaymentData } from "../types/core"

interface PaymentResult {
    success: boolean
    transactionId?: string
    message: string
    error?: string
    updatedBills?: Bill[]
}

class PaymentService {
    private static instance: PaymentService
    private billsState: Bill[] = []

    static getInstance(): PaymentService {
        if (!PaymentService.instance) {
            PaymentService.instance = new PaymentService()
        }
        return PaymentService.instance
    }

    setBillsState(bills: Bill[]) {
        this.billsState = [...bills] // Create a copy
    }

    getBillsState(): Bill[] {
        return this.billsState
    }

    async processBillPayment(
        paymentData: BillPaymentData,
        bills: Bill[],
        otp?: string
    ): Promise<PaymentResult> {
        // Update our internal state with current bills
        this.setBillsState(bills)
        try {
            console.log("💳 Processing bill payment:", paymentData)

            // Simulate OTP validation if required
            if (paymentData.requires_otp && !otp) {
                return {
                    success: false,
                    message: "رمز التحقق مطلوب لإتمام الدفع",
                    error: "OTP_REQUIRED"
                }
            }

            if (paymentData.requires_otp && otp) {
                // Simulate OTP validation (for demo, accept "1234")
                if (otp !== "1234") {
                    return {
                        success: false,
                        message: "رمز التحقق غير صحيح",
                        error: "INVALID_OTP"
                    }
                }
            }

            // Find bills to pay
            const billsToPay = this.billsState.filter(bill => 
                paymentData.final_bills.includes(bill.id)
            )

            if (billsToPay.length === 0) {
                return {
                    success: false,
                    message: "لم يتم العثور على الفواتير المحددة",
                    error: "BILLS_NOT_FOUND"
                }
            }

            // Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Generate transaction ID
            const transactionId = `TXN${Date.now()}`

            // Simulate random success/failure for demo (90% success rate)
            const isSuccessful = Math.random() > 0.1

            if (isSuccessful) {
                // Update bill status in banking data
                this.updateBillStatus(paymentData.final_bills, "مدفوعة")

                const paidBillsNames = billsToPay.map(bill => bill.provider).join("، ")
                
                return {
                    success: true,
                    transactionId,
                    message: `تم دفع فواتير ${paidBillsNames} بنجاح بمبلغ ${paymentData.total_amount} ريال`,
                    updatedBills: this.getUpdatedBills()
                }
            } else {
                return {
                    success: false,
                    message: "فشل في معالجة الدفع، يرجى المحاولة مرة أخرى",
                    error: "PAYMENT_FAILED"
                }
            }

        } catch (error) {
            console.error("❌ Payment processing error:", error)
            return {
                success: false,
                message: "حدث خطأ في معالجة الدفع",
                error: "PROCESSING_ERROR"
            }
        }
    }

    private updateBillStatus(billIds: string[], status: string) {
        // Update bills in our internal state
        billIds.forEach(billId => {
            const bill = this.billsState.find(b => b.id === billId)
            if (bill) {
                bill.status = status
                bill.lastPaid = new Date().toISOString().split('T')[0]
                console.log(`📋 Updated bill ${billId} (${bill.provider}) to status: ${status}`)
            }
        })
    }

    private getUpdatedBills(): Bill[] {
        return [...this.billsState] // Return a copy
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
}

export default PaymentService.getInstance()