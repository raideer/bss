import { PreactHTMLConverter } from "preact-html-converter";
import { useEffect, useRef, useState } from "preact/hooks";
import trim from 'lodash-es/trim'
import { urlArgs } from "util/url";
import { FC } from "preact/compat";

interface Props {
  html: Document;
  switchTab?: (tab: string) => void;
}

const ENDPOINT = '/w_inc/ajax.php?action=show_special_js_data&version=1&lg={{lang}}&data={{hash}}'

const converter = PreactHTMLConverter();

function getOnClickArgs(onclick: string|null|undefined) {
  if (!onclick) return null

  const match = onclick.match(/\((.*)\)/)

  if (match) {
    return match[1].split(', ').map(part => trim(part, '\''));
  }

  return null
}

function loadSpecialData(hash: string, lang: string) {
  return fetch(urlArgs(ENDPOINT, { hash, lang }), {
    headers: {
      accept: 'message/x-ajax'
    }
  })
    .then(res => res.text())
    .then(res => {
      if (res.substring(0, 2) !== 'OK') {
        throw new Error('Invalid response')
      }

      return JSON.parse(res.substring(2))
    })
}

export const PreviewDetails: FC<Props> = ({ html, switchTab }) => {
  const ref = useRef<any>();
  const [Component, setComponent] = useState<any>(null);

  useEffect(() => {
    if (!ref.current) return;

    const specialLinks = html.querySelectorAll('[id^="tdo_"]')

    specialLinks.forEach((link) => {
      const id = link.getAttribute('id')
      const onclick = link.querySelector('a')?.getAttribute('onclick')
      const args = getOnClickArgs(onclick)

      const currentLink = ref.current.querySelector(`#${id}`)?.querySelector('a')

      if (!args || !currentLink) return

      currentLink.addEventListener('click', (e: MouseEvent) => {
        const targetId = (e.target as HTMLAnchorElement).getAttribute('id')

        if (switchTab && targetId === 'mnu_map') {
          switchTab('map')
          return
        }

        const [hash, lang] = args

        loadSpecialData(hash, lang).then(body => {
          for (const key in body[1]) {
            ref.current.querySelector(`#tdo_${key}`).innerHTML = body[1][key]
          }
        })
      })
    })

    return () => {
      if (!ref.current) return;

      const specialLinks = ref.current.querySelectorAll('[id^="tdo_"] a')
      // Remove event listeners
      specialLinks.forEach((link: HTMLAnchorElement) => {
        link.parentNode?.replaceChild(link.cloneNode(true), link)
      })
    }
  })

  useEffect(() => {
    const details = html.querySelector('#msg_div_msg')
    if (details) {
      setComponent(converter.convert(details.innerHTML))
    }
  }, [html])

  return (
    <div ref={ref} className="bss-preview__details">
      {Component}
    </div>
  )
}
