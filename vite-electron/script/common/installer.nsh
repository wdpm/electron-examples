!macro customInit
WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "YourApp Name" "$INSTDIR\YourAppName.exe"
!macroend

!macro customUnInstall
DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "YourAppName"
!macroend