import { BrowserWindowConstructorOptions } from 'electron'
import { WebPreferencesConfig } from './WebPreferencesConfig'
export class WindowConfig implements BrowserWindowConstructorOptions {
  width?
  height?
  maximizable?
  resizable?
  x?
  y?
  alwaysOnTop?
  skipTaskbar?
  frame = false
  show = false
  webPreferences = new WebPreferencesConfig()
  nodeIntegrationInSubFrames = true
  nativeWindowOpen = true
  modal?
  parent?
  movable = true
  thickFrame = true
  minHeight?
  minWidth?
}
