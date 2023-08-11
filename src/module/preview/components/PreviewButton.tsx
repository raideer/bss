import { FC, useState } from 'react'
import { dom } from 'util/dom'
import { AdType, getListingPageInfo } from 'util/page-info'
import { Preview } from './Preview'
import { Button } from 'core/components/Button'
import { renderReact } from 'util/react'
import { useSelector } from 'react-redux'
import { GlobalState } from 'core/module/global-state/store'
import { SETTING_ENABLED } from '..'
interface Props {
  row: any;
}

export const PreviewButton: FC<Props> = ({ row }) => {
  const enabled = useSelector((state: GlobalState) => state.settings.values[SETTING_ENABLED])
  const pageInfo = getListingPageInfo()
  const isGallery = pageInfo.adType === AdType.AD_TYPE_GALLERY
  const [container, setContainer] = useState<HTMLElement | null>(null)

  const onClick = (e: any) => {
    e.stopPropagation()

    if (container && document.body.contains(container)) {
      container.remove()
      setContainer(null)
    } else {
      if (isGallery) {
        document.querySelectorAll('.bss-gallery__container').forEach(el => el.remove())
      }

      const container = dom(
        'tr',
        { class: 'bss-gallery__container' },
        dom('td', { colspan: 100 })
      )

      setContainer(container)
      if (isGallery) {
        row.closest('tr')?.after(container)
      } else {
        row.after(container)
      }

      const col = container.querySelector('td')

      if (col) {
        renderReact(<Preview row={row} />, col, 'append')
      }
    }
  }

  if (!enabled) {
    return null
  }

  return (
    <Button className="bss-gallery__button" onClick={onClick} >
      <span className="icon-image" />
      <span className="icon-chevron-down" />
    </Button>
  )
}
