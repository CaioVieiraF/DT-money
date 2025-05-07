import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { createContext } from 'use-context-selector'
import { api } from '../lib/axios'

export interface Transaction {
  id: number,
  description: string,
  type: 'income' | 'outcome',
  price: number,
  category: string,
  createdAt: string
}

interface CreateTransactionData {
  description: string,
  price: number,
  category: string,
  type: 'income' | 'outcome'
}

interface TransactionsContextType {
  transactions: Transaction[],
  loadTransactions: (query?: string) => Promise<void>,
  createTransaction: (data: CreateTransactionData) => Promise<void>
}

interface TransactionsContextProviderProps {
  children: ReactNode
}

export const TransactionsContext = createContext({} as TransactionsContextType)

export function TransactionsContextProvider({ children }: TransactionsContextProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const loadTransactions = useCallback(async (query?: string) => {
    const response = await api.get('transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
        q: query,
      },
    })

    setTransactions(response.data)
  }, [])

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  const createTransaction = useCallback(async (data: CreateTransactionData) => {
    const { description, price, category, type } = data

    const response = await api.post('transactions', {
      description,
      price,
      category,
      type,
      createdAt: new Date(),
    })

    setTransactions(state => [...state, response.data])
  }, [])

  return (
    <TransactionsContext.Provider value={{ transactions, loadTransactions, createTransaction }}>
      {children}
    </TransactionsContext.Provider>
  )
}
