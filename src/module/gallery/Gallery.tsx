import classnames from "classnames"
import SimpleBar from "core/components/Simplebar"
import { useEffect, useState } from "preact/hooks"
import fetchHtml from "util/fetch-html"
import { GalleryImage } from "./GalleryImage"

interface Props {
  row: Element;
}

export const Gallery = ({ row }: Props) => {
  const [activeImageHeight, setActiveImageHeight] = useState(0)
  const [activeImage, setActiveImage] = useState<string|null>(null)
  const [images, setImages] = useState<string[]>([])

  const loadImages = async () => {
    const adLink = row.querySelector('a')

    if (adLink) {
      const adHtml = await fetchHtml(adLink.href)

      const links: string[] = []

      adHtml.querySelectorAll('.pic_dv_thumbnail a').forEach((link) => {
        links.push((link as HTMLAnchorElement).href)
      })

      setImages(links)
    }
  }

  const previewStyle = { willChange: 'height', height: `${activeImageHeight}px` }

  useEffect(() => {
    if (!activeImage && images.length > 0) {
      setActiveImage(images[0])
    }
  }, [activeImage, images])

  useEffect(() => {
    loadImages()
  }, [])

  return (
    <div className="ssplus-gallery">
      <div class="ssplus-gallery__images">
        <SimpleBar style={{ maxHeight: 600 }} autoHide={false}>
          { images.map((image, key) => {
            return (
              <button
                onClick={() => setActiveImage(image)}
                type="button"
                key={key}
                className={classnames({
                  'ssplus-gallery__image': true,
                  'ssplus-gallery__image--active': activeImage === image
                })}>
                <img src={image} />
              </button>
            )
          })}
        </SimpleBar>
      </div>
      <div class="ssplus-gallery__preview" style={previewStyle}>
        {activeImage && (
          <GalleryImage setContainerHeight={setActiveImageHeight} src={activeImage} />
        )}
      </div>
    </div>
  )
}
