import { whenLoaded } from 'util/lifecycle'
import { render } from 'preact'
import { Container } from './Container'
import { whenNextPageLoaded } from 'module/infinite-load'
import { AdType, getPageInfo } from 'util/page-info'
import { JSXInternal } from 'preact/src/jsx'

type ButtonElementReturn = JSXInternal.Element | null | undefined
export type ButtonElement = (row: Element) => ButtonElementReturn | Promise<ButtonElementReturn>

type Listener = () => Promise<any>
const beforeListeners: Listener[] = []
const elements: ButtonElement[] = []

function addButtonContainer () {
  const pageInfo = getPageInfo()

  Promise.all(beforeListeners.map(listener => listener())).then(() => {
    document.querySelectorAll('[id^="tr_"]').forEach(row => {
      const rowTitle = pageInfo.adType !== AdType.AD_TYPE_GALLERY
        ? row.querySelector('td.msg2')
        : row.querySelector('.d7, .d7p')

      if (rowTitle) {
        const buttons = elements.map(element => element(row)).filter(e => e)
        if (buttons.length > 0) {
          document.body.classList.add('bss-button-container--has-buttons');
        }

        render(<Container children={buttons} />, rowTitle)
      }
    })
  })
}

export function addButton(element: ButtonElement) {
  elements.push(element)
}

export function beforeAddButtons(listener: Listener) {
  beforeListeners.push(listener)
}

whenLoaded(() => {
  addButtonContainer()
})

whenNextPageLoaded(() => {
  addButtonContainer()
})
