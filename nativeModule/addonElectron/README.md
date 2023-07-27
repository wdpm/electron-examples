## compilation
Make sure the following system variables are correctly set:
- msvs_version
- VCINSTALLDIR

```
npm config set msvs_version 2017
setx /M VSINSTALLDIR "C:\Program Files\Microsoft Visual Studio\2017\Community\"
# npm config set msbuild_path "C:\Program Files (x86)\Microsoft Visual Studio\2017\Community\MSBuild\15.0\Bin\MSBuild.exe"
```