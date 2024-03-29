import { FC, useCallback, useEffect, useState } from 'react'
import fetchHtml from 'util/fetch-html'
import { PreviewDetails } from './PreviewDetails'
import { PreviewGallery } from './PreviewGallery'
import { Loader } from 'core/components/Loader'
import first from 'lodash-es/first'
import { PreviewMap } from './PreviewMap'
import { Button } from 'core/components/Button'
import { addPageToHistory } from 'module/history'

interface Props {
  row: Element;
}

enum Tab {
  Gallery = 'gallery',
  Details = 'details',
  Map = 'map'
}

const TABS = [
  { key: Tab.Gallery, label: 'Galerija', component: PreviewGallery },
  { key: Tab.Details, label: 'Sludinājums', component: PreviewDetails },
  { key: Tab.Map, label: 'Karte', component: PreviewMap }
]

export const Preview: FC<Props> = ({ row }) => {
  const [html, setHtml] = useState<Document|null>(null)
  const [showMap, setShowMap] = useState(false)
  const [activeTab, setActiveTab] = useState(first(TABS))

  const loadAdPage = async () => {
    const adLink = row.querySelector('a')

    if (adLink) {
      const adHtml = await fetchHtml(adLink.href)
      setHtml(adHtml)
    }
  }

  const handleSwitchTab = useCallback((tab: string) => {
    const newTab = TABS.find((t) => t.key === tab)
    if (newTab) {
      setActiveTab(newTab)
    }
  }, [])

  const addRowToHistory = () => {
    const id = row.id.replace('tr_', '')
    const adLink = row.querySelector('a[id^="dm_"]') as HTMLAnchorElement

    if (!id || !adLink) {
      return
    }

    const url = new URL(adLink.href)

    addPageToHistory({
      id,
      url: url.pathname,
      title: adLink.textContent || ''
    })
  }

  useEffect(() => {
    if (html) {
      const map = html.querySelector('#google_map')
      setShowMap(!!map)
    }
  }, [html])

  useEffect(() => {
    loadAdPage()
    addRowToHistory()
  }, [row])

  if (!html) {
    return <Loader />
  }

  return (
    <div className="bss-preview">
      <div className="bss-preview__menu">
        <div className="bss-menu">
          {TABS.map((tab) => {
            if (tab.key === Tab.Map && !showMap) {
              return null
            }

            return <Button
              active={activeTab && activeTab.key === tab.key}
              key={tab.key}
              onClick={() => setActiveTab(tab)}>
                {tab.label}
            </Button>
          })}

        </div>
      </div>
      {activeTab && activeTab.component && <activeTab.component switchTab={handleSwitchTab} html={html} />}
    </div>
  )
}
