const SSPlusVersion = {
  major: __version_major__,
  minor: __version_minor__,
  patch: __version_patch__,
  prerelease: __version_prerelease__,
  hash: __webpack_hash__,
  commit: __git_commit__
};

(window as any).SSPlusVersion = SSPlusVersion
