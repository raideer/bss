import { whenLoaded } from 'util/lifecycle'
import { renderReact } from 'util/react'
import { HomeTopBarContainer } from './components/HomeTopBarContainer'
import { ReactElement } from 'react'
import { StateProvider } from 'core/module/global-state/Provider'

const elements: ReactElement[] = []

const renderTopBar = () => {
  const insertPoint = document.querySelector('#page_main_full')

  if (insertPoint) {
    renderReact(<StateProvider><HomeTopBarContainer>{elements}</HomeTopBarContainer></StateProvider>, insertPoint, 'prepend')
  }
}

export function addHtbElement (element: ReactElement) {
  elements.push(element)
}

whenLoaded(() => {
  renderTopBar()
})
