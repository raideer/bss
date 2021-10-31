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

export function waitForChild(ele: Element, selector: string): Promise<HTMLElement> {
  return new Promise(resolve => {
    const child = Array.from(ele.children).find(child => child.matches(selector));
    if (child) {
      resolve(child as HTMLElement);
      return;
    }

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node.nodeType === Node.ELEMENT_NODE && (node as any).matches(selector)) {
            observer.disconnect();
            resolve(node as HTMLElement);
            return;
          }
        }
      }
    });

    observer.observe(ele, { childList: true });
  });
}

export const generateQuerySelector = (el: any): string => {
  if (el.tagName.toLowerCase() === "html") { return "HTML"; }
  let str = el.tagName;
  str += (el.id !== "") ? `#${el.id}` : "";
  if (el.className) {
    const classes = el.className.split(/\s/);
    for (let i = 0; i < classes.length; i++) {
      str += `.${classes[i]}`
    }
  }
  return `${generateQuerySelector(el.parentNode)} > ${str}`;
}
