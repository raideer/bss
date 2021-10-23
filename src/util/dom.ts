export const dom = (tag: string, attributes: any = {}, ...children: any) => {
  const element = document.createElement(tag)
  for (const attribute in attributes) {
    if (attributes[attribute]) {
      element.setAttribute(attribute, attributes[attribute])
    }
  }
  const fragment = document.createDocumentFragment()
  children.forEach((child: any) => {
    if (typeof child === 'string') {
      child = document.createTextNode(child)
    }
    fragment.appendChild(child)
  })
  element.appendChild(fragment)
  return element
}

export function isElementInViewport (el: HTMLElement | Element): boolean {
  const rect = el.getBoundingClientRect()

  return (
    rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}
