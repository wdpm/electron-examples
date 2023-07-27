# git tags

List All local tags.
```
git tag -l
```
Delete All local tags.
```
git tag -d $(git tag -l)
```
Fetch remote All tags.
```
git fetch
```
Delete All remote tags.
```
git push origin --delete $(git tag -l) 
```
