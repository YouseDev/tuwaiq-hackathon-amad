export interface BankingContext {
    user: any
    accounts: any
    creditCards: any[]
    transactions: any[]
    bills: any[]
    contacts: any[]
}

export interface Bill {
    id: string
    provider: string
    type: string
    amount: number
    dueDate: string
    status: string
    accountNumber: string
    lastPaid: string
}

export interface BillSelectionData {
    intent: "pay_bills"
    selection_criteria: {
        specific_bills?: string[]
        bill_types?: string[]
        all_pending?: boolean
        amount_range?: [number, number]
    }
    matched_bills: Bill[]
    total_amount: number
}

export interface BillPaymentData {
    action: "confirm_payment" | "modify_selection" | "cancel"
    final_bills: string[]
    payment_source: "checking" | "savings"
    total_amount: number
    requires_otp: boolean
}

export type ChatMessage = {
    role: "system" | "user" | "assistant"
    content: string
}

export default {}
