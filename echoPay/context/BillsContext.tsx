import React, { createContext, useContext, useState, ReactNode } from 'react'
import bankingData from '../assets/data/banking_data.json'
import { Bill } from '../types/core'

interface BillsContextType {
    bills: Bill[]
    updateBillStatus: (billId: string, status: string) => void
    updateBillsStatus: (billIds: string[], status: string) => void
}

const BillsContext = createContext<BillsContextType | undefined>(undefined)

export const BillsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [bills, setBills] = useState<Bill[]>(bankingData.bills)

    const updateBillStatus = (billId: string, status: string) => {
        setBills(prevBills => 
            prevBills.map(bill => 
                bill.id === billId ? { ...bill, status } : bill
            )
        )
    }

    const updateBillsStatus = (billIds: string[], status: string) => {
        setBills(prevBills => 
            prevBills.map(bill => 
                billIds.includes(bill.id) ? { ...bill, status } : bill
            )
        )
    }

    return (
        <BillsContext.Provider value={{ bills, updateBillStatus, updateBillsStatus }}>
            {children}
        </BillsContext.Provider>
    )
}

export const useBills = (): BillsContextType => {
    const context = useContext(BillsContext)
    if (!context) {
        throw new Error('useBills must be used within a BillsProvider')
    }
    return context
}