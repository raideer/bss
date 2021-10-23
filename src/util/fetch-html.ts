export default async function (link: string) {
  const response = await fetch(link)
  const htmlString = await response.text()
  const parser = new DOMParser()
  return parser.parseFromString(htmlString, 'text/html')
}
