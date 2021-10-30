import { PreactHTMLConverter } from 'preact-html-converter';

const converter = PreactHTMLConverter();

export const fetchString = async (link: string) => {
  const response = await fetch(link)
  const htmlString = await response.text()

  return htmlString
}

export default async function (link: string) {
  const htmlString = await fetchString(link)

  const parser = new DOMParser()
  return parser.parseFromString(htmlString, 'text/html')
}
