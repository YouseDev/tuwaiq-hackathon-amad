export interface BankingContext {
    user: any
    accounts: any
    creditCards: any[]
    transactions: any[]
    bills: any[]
    contacts: any[]
}

export type ChatMessage = {
    role: "system" | "user" | "assistant"
    content: string
}

export default {}
