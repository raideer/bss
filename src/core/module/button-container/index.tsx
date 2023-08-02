import { whenLoaded } from 'util/lifecycle'
import { Container } from './components/Container'
import { whenNextPageLoaded } from 'module/infinite-load'
import { AdType, getPageInfo } from 'util/page-info'
import { renderReact } from 'util/react'
import { ReactElement } from 'react'

type ButtonElementReturn = ReactElement | null | undefined
export type ButtonElement = (row: Element) => ButtonElementReturn

const elements: ButtonElement[] = []

function addButtonContainer () {
  const pageInfo = getPageInfo()

  document.querySelectorAll('[id^="tr_"]').forEach(row => {
    const rowTitle = pageInfo.adType !== AdType.AD_TYPE_GALLERY
      ? row.querySelector('td.msg2')
      : row.querySelector('.d7, .d7p')

    if (rowTitle) {
      const buttons = elements.map(element => element(row)).filter(e => e)

      if (buttons.length > 0) {
        document.body.classList.add('bss-button-container--has-buttons')
      }

      renderReact(<Container>{buttons}</Container>, rowTitle, 'append')
    }
  })
}

export function addButton (element: ButtonElement) {
  elements.push(element)
}

whenLoaded(() => {
  addButtonContainer()
})

whenNextPageLoaded(() => {
  addButtonContainer()
})
