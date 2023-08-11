import { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { dom } from './dom'

export const renderReact = (
  element: ReactNode,
  container: Element,
  mode: 'overwrite' | 'append' | 'prepend' = 'overwrite'
) => {
  let rootElement = container

  if (mode !== 'overwrite') {
    const el = dom('span')

    if (mode === 'prepend') {
      container.prepend(el)
    } else {
      container.appendChild(el)
    }

    rootElement = el
  }

  const root = createRoot(rootElement)
  root.render(element)
}
