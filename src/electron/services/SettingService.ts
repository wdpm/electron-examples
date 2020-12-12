import setting from 'electron-settings'

export class SettingService {
  private static readonly flag: string = 'flag'

  static setIsNotifiedOnStartSync = (isNotifiedOnStart: boolean): boolean => {
    setting.setSync(SettingService.flag, isNotifiedOnStart)
    return setting.getSync(SettingService.flag) as boolean
  }

  static getIsNotifiedOnStartSync = (): boolean => {
    if (!setting.hasSync(SettingService.flag)) {
      setting.setSync(SettingService.flag, false)
    }
    return setting.getSync(SettingService.flag) as boolean
  }

  static getPathOfSettings (): string {
    // in windows => C:\Users\{your-user-name}\AppData\Roaming\vue-electron-app\settings.json
    return setting.file() as string
  }
}
