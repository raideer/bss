export type WatcherCallback = (newValue: any, oldValue: any, objectPath: string) => void

export enum SettingValueType {
  Checkbox,
  Select,
  Number
}

export const SettingCategory = {
  AdList: 'ad-list',
  Filters: 'filters',
  Appearance: 'appearance',
  Search: 'search'
}

interface BaseSetting {
  type: SettingValueType,
  title: string,
  description?: string,
  id: string,
  menu: string,
  needsReload?: boolean,
}

export type CheckboxSetting = BaseSetting & {
  type: SettingValueType.Checkbox
  defaultValue: boolean
}

export type SelectSetting = BaseSetting & {
  type: SettingValueType.Select,
  defaultValue: string,
  options: { label: string, value: string }[]
}

export type Setting = CheckboxSetting | SelectSetting

export type SettingChangeCallback = (id: SelectSetting['id'], value: string, needsReload?: boolean) => void;

export interface SettingsCategory {
  id: string;
  title: string;
}
