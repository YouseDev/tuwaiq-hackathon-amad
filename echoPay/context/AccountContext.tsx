import React, { createContext, useContext, useState, ReactNode } from 'react'
import bankingData from '../assets/data/banking_data.json'

interface Account {
    accountNumber: string
    balance: number
    currency: string
    type: string
}

interface AccountsType {
    checking: Account
    savings: Account
}

interface AccountContextType {
    accounts: AccountsType
    updateAccountBalance: (accountType: "checking" | "savings", newBalance: number) => void
    deductFromAccount: (accountType: "checking" | "savings", amount: number) => void
}

const AccountContext = createContext<AccountContextType | undefined>(undefined)

interface AccountProviderProps {
    children: ReactNode
}

export function AccountProvider({ children }: AccountProviderProps) {
    const [accounts, setAccounts] = useState<AccountsType>(bankingData.accounts as AccountsType)

    const updateAccountBalance = (accountType: "checking" | "savings", newBalance: number) => {
        setAccounts(prev => ({
            ...prev,
            [accountType]: {
                ...prev[accountType],
                balance: newBalance
            }
        }))
    }

    const deductFromAccount = (accountType: "checking" | "savings", amount: number) => {
        setAccounts(prev => ({
            ...prev,
            [accountType]: {
                ...prev[accountType],
                balance: prev[accountType].balance - amount
            }
        }))
    }

    return (
        <AccountContext.Provider value={{ accounts, updateAccountBalance, deductFromAccount }}>
            {children}
        </AccountContext.Provider>
    )
}

export function useAccounts() {
    const context = useContext(AccountContext)
    if (context === undefined) {
        throw new Error('useAccounts must be used within an AccountProvider')
    }
    return context
}