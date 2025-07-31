import { useMemo } from 'react'
import { useTransactions } from '../context/TransactionContext'
import { useAccounts } from '../context/AccountContext'
import { useCards } from '../context/CardContext'
import { useBills } from '../context/BillsContext'
import bankingData from '../assets/data/banking_data.json'
import { BankingContext } from '../types/core'

/**
 * Custom hook that provides the complete banking context for the LLM
 * Automatically combines data from all contexts and static banking data
 */
export const useLLMContext = (): BankingContext => {
    const { transactions } = useTransactions()
    const { accounts } = useAccounts()
    const { cards } = useCards()
    const { bills } = useBills()

    // Memoize the context to avoid unnecessary re-computations
    const context = useMemo(() => {
        return {
            ...bankingData,
            accounts: accounts || bankingData.accounts,
            bills: bills,
            transactions: transactions,
            creditCards: cards,
        } as BankingContext
    }, [transactions, accounts, cards, bills])

    return context
}