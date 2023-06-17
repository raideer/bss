
export enum SettingValueType {
  Checkbox,
  Select
}

export const SettingCategory = {
  AdList: 'ad-list',
  Appearance: 'appearance'
}

interface BaseSetting {
  type: SettingValueType,
  title: string,
  description?: string,
  id: string,
}

export type CheckboxSetting = BaseSetting & {
  type: SettingValueType.Checkbox
}

export type SelectSetting = BaseSetting & {
  type: SettingValueType.Select,
  options: { label: string, value: string }[]
}

export type Setting = CheckboxSetting | SelectSetting

export interface SettingsTab {
  id: string;
  title: string;
}

export interface SettingsCategory {
  id: string;
  tab?: SettingsTab,
  title: string;
  items: Setting[];
}
