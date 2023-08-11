import { GlobalState } from 'core/module/global-state/store'
import { FC, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'core/components/Button'
import { applyFilter } from '../common'
import { STORAGE_MEMORY } from '../constants'

export const HomeFilterList: FC = () => {
  const savedFilters = useSelector((state: GlobalState) => {
    return state.settings.values[STORAGE_MEMORY] || {}
  })

  const filters = useMemo(() => {
    const items = []

    for (const pageKey in savedFilters) {
      for (const filterName in savedFilters[pageKey]) {
        items.push({
          name: filterName,
          ...savedFilters[pageKey][filterName]
        })
      }
    }

    return items
  }, [savedFilters])

  return <div className='bss-fm-home-list'>
    {filters.map((filter: any) => {
      return <Button onClick={() => applyFilter(filter)} size="xs" key={filter.id}>{filter.name}</Button>
    })}
    {filters.map((filter: any) => {
      return <Button size="xs" key={filter.id + '1'}>{filter.name}</Button>
    })}
    {filters.map((filter: any) => {
      return <Button size="xs" key={filter.id + '2'}>{filter.name}</Button>
    })}
  </div>
}
