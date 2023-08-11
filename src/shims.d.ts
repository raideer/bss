/* eslint-disable camelcase */
declare module 'react-html-converter/browser'
declare module 'unique-selector'
declare module 'js-md5'
declare module 'winbox/src/js/winbox'

declare let __webpack_hash__: string
declare let __git_commit__: string
declare let __version_major__: number
declare let __version_minor__: number
declare let __version_patch__: number
declare let __version_prerelease__: number

declare module '*.scss' {
  const content: {[className: string]: string}
  export default content
}
