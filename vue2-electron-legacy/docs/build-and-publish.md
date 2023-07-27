# how to build/push

## build
> https://www.electron.build/multi-platform-build

For example, to build app for MacOS, Windows and Linux:
```
electron-builder -mwl
```
Build performed in parallel, so, it is highly recommended to not use npm task per platform (e.g. npm run dist:mac && npm run dist:win32), but specify multiple platforms/targets in one build command. You don’t need to clean dist output before build — output directory is cleaned automatically.

## publish
> https://www.electron.build/configuration/publish

But please consider using automatic rules instead of explicitly specifying publish:
- If CI server detected, — onTagOrDraft.
- If CI server reports that tag was pushed, — onTag.

Release will be drafted (if doesn’t already exist) and artifacts published only if tag was pushed.
- If npm script named release, — always.

## Q&A
> release doesn't exist and not created because "publish" is not "always" and build is not on tag
