# how to push
> https://www.electron.build/configuration/publish

But please consider using automatic rules instead of explicitly specifying publish:
- If CI server detected, — onTagOrDraft.
- If CI server reports that tag was pushed, — onTag.

Release will be drafted (if doesn’t already exist) and artifacts published only if tag was pushed.
- If npm script named release, — always.

## Q&A
> release doesn't exist and not created because "publish" is not "always" and build is not on tag
