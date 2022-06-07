const htmlCache: Record<string, Document> = {}

export const fetchString = async (link: string) => {
  const response = await fetch(link)
  const htmlString = await response.text()

  return htmlString
}

export default async function (link: string, skipCache = false) {
  if (skipCache || !htmlCache[link]) {
    const htmlString = await fetchString(link)

    const parser = new DOMParser()
    htmlCache[link] = parser.parseFromString(htmlString, 'text/html')
  }

  return htmlCache[link]
}
