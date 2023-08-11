import { trimEnd } from 'lodash-es'

export function urlArgs (url: string, args: Record<string, string>) {
  let output = url

  for (const key in args) {
    output = output.replace(`{{${key}}}`, args[key])
  }

  return output
}

export const trimUrl = (url: string) => {
  return trimEnd(url.slice(3), '/')
}
