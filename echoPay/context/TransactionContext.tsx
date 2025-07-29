import React, { createContext, useContext, useState, ReactNode } from 'react'
import bankingData from '../assets/data/banking_data.json'

interface Transaction {
    id?: string
    date: string
    amount: number
    merchant?: string
    description?: string
    category: string
    type: string
    time?: string
    location?: string
    paymentMethod?: string
    balance?: number
}

interface TransactionContextType {
    transactions: Transaction[]
    addTransactions: (newTransactions: Transaction[]) => void
    updateTransactions: (transactions: Transaction[]) => void
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

interface TransactionProviderProps {
    children: ReactNode
}

export function TransactionProvider({ children }: TransactionProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>(bankingData.transactions.january_2024)

    const addTransactions = (newTransactions: Transaction[]) => {
        setTransactions(prev => [...newTransactions, ...prev])
    }

    const updateTransactions = (newTransactions: Transaction[]) => {
        setTransactions(newTransactions)
    }

    return (
        <TransactionContext.Provider value={{ transactions, addTransactions, updateTransactions }}>
            {children}
        </TransactionContext.Provider>
    )
}

export function useTransactions() {
    const context = useContext(TransactionContext)
    if (context === undefined) {
        throw new Error('useTransactions must be used within a TransactionProvider')
    }
    return context
}