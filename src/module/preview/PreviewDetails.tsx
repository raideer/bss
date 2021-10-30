import { PreactHTMLConverter } from "preact-html-converter";
import { useEffect, useRef, useState } from "preact/hooks";

interface Props {
  html: Document;
}

const converter = PreactHTMLConverter();

export const PreviewDetails = ({ html }: Props) => {
  const ref = useRef<any>();
  const [component, setComponent] = useState<any>(null);

  useEffect(() => {
    const details = html.querySelector('#msg_div_msg')
    if (details) {
      setComponent(converter.convert(details.innerHTML))
    }
  }, [html])

  return (
    <div ref={ref} className="ssplus-preview__details">
      {component}
    </div>
  )
}
