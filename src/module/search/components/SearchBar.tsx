import { FC, useCallback, useEffect, useState } from 'react'
import { FlatSearchCategory, SearchCategory } from '../types'
import Fuse from 'fuse.js'
import { each, take } from 'lodash-es'
import { getLocationInfo } from 'util/page-info'
import { Modal } from 'core/components/Modal'

const flattenCategories = (categories: SearchCategory[], parent?: string, flattened: FlatSearchCategory[] = []) => {
  each(categories, (category: SearchCategory) => {
    flattened.push({
      name: category.name,
      url: category.url,
      parent
    })

    if (category.children) {
      const parentName = parent ? `${parent} - ${category.name}` : category.name

      flattenCategories(category.children, parentName, flattened)
    }
  })

  return flattened
}

export const SearchBar: FC = () => {
  const [query, setQuery] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [fuse, setFuse] = useState<Fuse<FlatSearchCategory> | null>(null)
  const [results, setResults] = useState<Fuse.FuseResult<FlatSearchCategory>[]>([])
  const locationInfo = getLocationInfo()

  const loadFuse = useCallback(() => {
    setLoaded(false)
    const index = localStorage.getItem('bss_search_index')

    if (!index) {
      setLoaded(true)
      return
    }

    const categories = JSON.parse(index)

    if (!categories) {
      setLoaded(true)
      return
    }

    const flattened = flattenCategories(categories)

    setFuse(
      new Fuse(
        flattened,
        {
          includeScore: true,
          useExtendedSearch: true,
          threshold: 0.4,
          keys: [
            {
              name: 'name',
              weight: 3
            }
          ]
        }
      )
    )
    setLoaded(true)
  }, [])

  const handleSearch = (value: string) => {
    if (!fuse) {
      if (!loaded) {
        loadFuse()
      }

      return
    }

    setResults(fuse.search(value))
  }

  useEffect(() => {
    if (query.length > 0) {
      handleSearch(query)
    } else {
      setResults([])
    }
  }, [query])

  return (
    <div className="bss-search__container">
      <input className="bss-input" value={query} onChange={(e) => setQuery((e.target as any).value) } type="text" placeholder="Meklēt kategoriju..." />

      <Modal onClose={() => setQuery('')} title={`Rezultāti (${results.length})`} visible={query.length > 1}>
        {take(results, 10).map((result, index) => {
          const name = [result.item.parent, result.item.name].filter(Boolean).join(' - ')
          const url = locationInfo?.lang + result.item.url

          return <div className="bss-search__results-item" key={url}>
            {index + 1}. <a href={url}>{name}</a>
          </div>
        })}
      </Modal>
    </div>
  )
}
