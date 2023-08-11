import { whenLoaded } from 'util/lifecycle'
import { whenNextPageLoaded } from 'module/infinite-load'
import { AdType, getListingPageInfo } from 'util/page-info'
import { renderReact } from 'util/react'
import { ReactElement } from 'react'
import { ButtonContainer } from './components/ButtonContainer'

type ButtonElementReturn = ReactElement | null | undefined
export type ButtonElement = (row: Element) => ButtonElementReturn

const elements: ButtonElement[] = []

function renderButtonContainer () {
  const pageInfo = getListingPageInfo()

  document.querySelectorAll('[id^="tr_"]').forEach(row => {
    const rowTitle = pageInfo.adType !== AdType.AD_TYPE_GALLERY
      ? row.querySelector('td.msg2')
      : row.querySelector('.d7, .d7p')

    if (rowTitle) {
      const buttons = elements.map(element => element(row)).filter(e => e)

      if (buttons.length > 0) {
        document.body.classList.add('bss-container-button--has-buttons')
      }

      renderReact(<ButtonContainer>{buttons}</ButtonContainer>, rowTitle, 'append')
    }
  })
}

export function addButton (element: ButtonElement) {
  elements.push(element)
}

whenLoaded(() => {
  renderButtonContainer()
})

whenNextPageLoaded(() => {
  renderButtonContainer()
})
