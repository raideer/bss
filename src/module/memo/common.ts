import fetchHtml from 'util/fetch-html'

export function parseId (trId: string) {
  const [, id] = trId.split('_')
  return id
}

export async function loadMemoItems () {
  return fetchHtml('/lv/favorites/')
    .then(html => {
    // Favorites page also shows viewed listings so we need to fetch the page
    // that only shows memos
      const memoLinkElement = html.querySelector('.filter_second_line_dv a[href*=favorites]')
      const memoLink = memoLinkElement?.getAttribute('href')

      return memoLink ? fetchHtml(memoLink, true) : null
    })
    .then(html => {
      if (!html) {
        return []
      }

      const items = html.querySelectorAll('[id^=tr_]')
      const ids: string[] = []

      items.forEach(item => {
        const id = item.getAttribute('id')
        if (id) {
          ids.push(parseId(id))
        }
      })

      return ids
    })
}
