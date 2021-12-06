import { getPageInfo } from "util/page-info";

const BetterSS: any = {};

(window as any).BSS = BetterSS

BetterSS.version = {
  major: __version_major__,
  minor: __version_minor__,
  patch: __version_patch__,
  prerelease: __version_prerelease__,
  hash: '__webpack_hash__',
  commit: __git_commit__,
  toString: () => {
    return `${BetterSS.version.major}.${BetterSS.version.minor}.${BetterSS.version.patch}`
  }
}
