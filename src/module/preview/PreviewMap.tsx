import { useEffect, useRef, useState } from "preact/hooks";
import { FC } from "preact/compat";

interface Props {
  html: Document;
}

export const PreviewMap: FC<Props> = ({ html }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [iframe, setIframe] = useState<string | null>(null)

  useEffect(() => {
    const openMapLink = html.querySelector('a[onclick*="/gmap/"]')
    if (!openMapLink) return

    const onClickAttribute = openMapLink.getAttribute('onclick')
    const args = onClickAttribute?.match(/'map',\d,\d,'([^']+)'/)
    if (!args) {
      return;
    }

    setIframe(args[1])
  }, [html, setIframe])

  return (
    <div ref={ref} className="bss-preview__map">
      {iframe && <iframe src={iframe} />}
    </div>
  )
}
