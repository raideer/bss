import { render } from "preact";
import { useState } from "preact/hooks";
import { dom } from "util/dom";
import { Gallery } from "./Gallery";

interface Props {
  row: any;
}

export const GalleryButton = ({ row }: Props) => {
  const [container, setContainer] = useState<HTMLElement | null>(null)

  const onClick = (e: any) => {
    e.stopPropagation();

    if (container) {
      container.remove()
      setContainer(null)
    } else {
      const container = dom(
        'tr',
        { class: 'ssplus-gallery__container' },
        dom('td', { colspan: 100 })
      )

      setContainer(container)
      row.after(container)

      const col = container.querySelector('td')
      if (col) {
        render(<Gallery row={row} />, col)
      }
    }
  }

  return (
    <button type="button" onClick={onClick} className="ssplus-gallery__button">
      <i className="fas fa-image" />
      <i className="fas fa-chevron-down" />
    </button>
  )
}