import React, { createContext, useContext, useState, ReactNode } from 'react'
import bankingData from '../assets/data/banking_data.json'
import { CreditCard } from '../types/core'

interface CardContextType {
    cards: CreditCard[]
    updateCardSecurity: (cardId: string, isLocked: boolean, internetPurchasesEnabled: boolean) => void
    toggleCardLock: (cardId: string) => void
    toggleInternetPurchases: (cardId: string) => void
}

const CardContext = createContext<CardContextType | undefined>(undefined)

interface CardProviderProps {
    children: ReactNode
}

export function CardProvider({ children }: CardProviderProps) {
    const [cards, setCards] = useState<CreditCard[]>(bankingData.creditCards as CreditCard[])

    const updateCardSecurity = (cardId: string, isLocked: boolean, internetPurchasesEnabled: boolean) => {
        setCards(prev => prev.map(card => 
            card.id === cardId 
                ? { ...card, isLocked, internetPurchasesEnabled }
                : card
        ))
    }

    const toggleCardLock = (cardId: string) => {
        setCards(prev => prev.map(card => 
            card.id === cardId 
                ? { ...card, isLocked: !card.isLocked }
                : card
        ))
    }

    const toggleInternetPurchases = (cardId: string) => {
        setCards(prev => prev.map(card => 
            card.id === cardId 
                ? { ...card, internetPurchasesEnabled: !card.internetPurchasesEnabled }
                : card
        ))
    }

    return (
        <CardContext.Provider value={{ cards, updateCardSecurity, toggleCardLock, toggleInternetPurchases }}>
            {children}
        </CardContext.Provider>
    )
}

export function useCards() {
    const context = useContext(CardContext)
    if (context === undefined) {
        throw new Error('useCards must be used within a CardProvider')
    }
    return context
}