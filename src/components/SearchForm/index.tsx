import { MagnifyingGlass } from 'phosphor-react'
import { SearchFormContainer } from './styles'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TransactionsContext } from '../../contexts/TransactionsContext'
import { useContextSelector } from 'use-context-selector'

const searchFormSchema = z.object({
  query: z.string(),
})

type SearchFormInput = z.infer<typeof searchFormSchema>

export function SearchForm() {
  const loadTransactions = useContextSelector(TransactionsContext, context => context.loadTransactions)
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<SearchFormInput>({
    resolver: zodResolver(searchFormSchema),
  })

  async function handleSearch(data: SearchFormInput) {
    await loadTransactions(data.query)
  }

  return (
    <SearchFormContainer onSubmit={handleSubmit(handleSearch)}>
      <input
        type="text"
        placeholder="Busque uma transação"
        {...register('query')}
      />
      <button type="submit" disabled={isSubmitting}>
        <MagnifyingGlass size={20} />
        Buscar
      </button>
    </SearchFormContainer>
  )
}
