import classnames from "classnames";
import { useEffect, useState } from "preact/hooks";
import fetchHtml from "util/fetch-html";
import { PreviewDetails } from "./PreviewDetails";
import { PreviewGallery } from "./PreviewGallery"

interface Props {
  row: Element;
}

const Tabs = {
  Gallery: 'gallery',
  Details: 'details'
}

export const Preview = ({ row }: Props) => {
  const [html, setHtml] = useState<Document|null>(null);
  const [activeTab, setActiveTab] = useState(Tabs.Gallery);

  async function loadAdPage() {
    const adLink = row.querySelector('a')

    if (adLink) {
      const adHtml = await fetchHtml(adLink.href)
      setHtml(adHtml)
    }
  }

  useEffect(() => {
    loadAdPage()
  }, [row])

  if (!html) {
    return (
      <div className="ssp-loader">
        <div />
        <div />
        <div />
      </div>
    );
  }

  return (
    <div class="ssplus-preview">
      <div className="ssplus-preview__menu">
        <button
          type="button"
          className={classnames({
            'ssplus-preview__menu--active': activeTab === Tabs.Gallery
          })}
          onClick={() => setActiveTab(Tabs.Gallery)}>
            Galerija
        </button>
        <button
          type="button"
          className={classnames({
            'ssplus-preview__menu--active': activeTab === Tabs.Details
          })}
          onClick={() => setActiveTab(Tabs.Details)}>
            Sludinājums
        </button>
      </div>
      { activeTab === Tabs.Details && <PreviewDetails html={html} />}
      { activeTab === Tabs.Gallery && <PreviewGallery html={html} />}
    </div>
  )
}
