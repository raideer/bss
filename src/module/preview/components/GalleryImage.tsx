import { useCallback, useEffect, useRef, useState } from 'react'

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

  const ghostImage = new Image(0, 0)
  ghostImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='

  const hideGhostImage = (event: any) => {
    event.dataTransfer.setDragImage(ghostImage, 0, 0)
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
    setImageContainerHeight(e.target)
  }

  const setImageContainerHeight = (el: HTMLImageElement) => {
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
  }

  const onImageLoad = useCallback(() => {
    if (image.current) {
      setImageContainerHeight(image.current)
    }
  }, [image.current])

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
    setRotation(0)
  }, [src])

  return (
    <div className="bss-gallery-image">
      <div className="bss-gallery-image__controls">
        <button title="Pagriezt pa kreisi" onClick={() => rotate(-1)} type="button">
          <span className="icon-rotate-left" />
        </button>
        <button title="Pagriezt pa labi" onClick={() => rotate(1)} className="bss-gallery-image__controls-rr" type="button">
          <span className="icon-rotate-left" />
        </button>
        <a href={src} download={src}>
          <span className="icon-download" />
        </a>
        <a title="Reverse image search" href={`https://www.google.com/searchbyimage?sbisrc=4chanx&image_url=${encodeURIComponent(src)}&safe=off`} target="_blank" rel="noreferrer">
          <span className="icon-search" />
        </a>
      </div>
      <div>
        <img
          data-rotation={rotation}
          ref={image}
          onLoad={onImageLoad}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDrag={onDrag}
          className="bss-gallery-image__image"
          style={{ width: '600px', willChange: 'width' }}
          src={src} />
      </div>
    </div>
  )
}
