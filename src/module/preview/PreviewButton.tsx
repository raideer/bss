import { render } from "preact";
import { useState } from "preact/hooks";
import { dom } from "util/dom";
import { AdType, getPageInfo } from "util/page-info";
import { Preview } from "./Preview";
interface Props {
  row: any;
}

export const PreviewButton = ({ row }: Props) => {
  const pageInfo = getPageInfo()
  const isGallery = pageInfo.adType === AdType.AD_TYPE_GALLERY
  const [container, setContainer] = useState<HTMLElement | null>(null)

  const onClick = (e: any) => {
    e.stopPropagation();

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
        render(<Preview row={row} />, col)
      }
    }
  }

  return (
    <button type="button" onClick={onClick} className="bss-gallery__button">
      <span class="icon-image" />
      <span class="icon-chevron-down" />
    </button>
  )
}
