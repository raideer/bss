
declare global {
  interface Window {
    BSS: typeof BSS;
  }
}

export const BSS = {
  version: {
    major: __version_major__,
    minor: __version_minor__,
    patch: __version_patch__,
    prerelease: __version_prerelease__,
    hash: `${__webpack_hash__}`,
    commit: __git_commit__,
    full: `${__version_major__}.${__version_minor__}.${__version_patch__}`
  }
}
