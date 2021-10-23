import { useEffect, useRef, useState } from "preact/hooks"

interface Props {
  src: string;
  setContainerHeight: (height: number) => void;
}

export const GalleryImage = ({ src, setContainerHeight }: Props) => {
  const image = useRef<HTMLImageElement>(null)
  const [dragging, setDragging] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 })
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })

  const hideGhostImage = (event: any) => {
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
    event.dataTransfer.setDragImage(img, 0, 0);
  }

  const onDragStart = (e: any) => {
    hideGhostImage(e)

    setImageSize({
      width: e.target.clientWidth,
      height: e.target.clientHeight
    })

    setDragging(true)
    setDragStartPos({
      x: e.pageX,
      y: e.pageY
    })
  }

  const onDragEnd = (e: any) => {
    setDragging(false)
  }

  const setImageContainerHeight = (el: any) => {
    if (rotation % 2) {
      setContainerHeight(el.clientWidth)
    } else {
      setContainerHeight(el.clientHeight)
    }
  }

  const onDrag = (e: any) => {
    if (!dragging || !e.pageX) return
    const xDif = e.pageX - dragStartPos.x

    e.target.style.width = `${imageSize.width + xDif}px`

    setImageContainerHeight(e.target)
  }

  const rotate = (deg: number) => {
    if (image.current) {
      if (rotation === 0 && deg === -1) {
        setRotation(3)
      } else if (rotation === 3 && deg === 1) {
        setRotation(0)
      } else {
        setRotation(rotation + deg)
      }
    }
  }

  useEffect(() => {
    if (image.current) {
      setImageContainerHeight(image.current)
    }
  }, [rotation])

  useEffect(() => {
    if (image.current) {
      setImageContainerHeight(image.current)
    }

    setRotation(0)
  }, [src])

  return (
    <div className="ssplus-gallery-image">
      <div className="ssplus-gallery-image__controls">
        <button title="Pagriezt pa kreisi" onClick={() => rotate(-1)} type="button">
          <i className="fas fa-undo" />
        </button>
        <button title="Pagriezt pa labi" onClick={() => rotate(1)} className="ssplus-gallery-image__controls-rr" type="button">
          <i className="fas fa-undo" />
        </button>
        <a href={src} download={src}>
          <i className="fas fa-download" />
        </a>
        <a title="Reverse image search" href={`https://images.google.com/searchbyimage?image_url=${encodeURIComponent(src)}`} target="_blank" rel="noreferrer">
          <i className="fas fa-search" />
        </a>
      </div>
      <div>
        <img
          data-rotation={rotation}
          ref={image}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDrag={onDrag}
          className="ssplus-gallery-image__image"
          style={{ width: '600px', willChange: 'width' }}
          src={src} />
      </div>
    </div>
  )
}
