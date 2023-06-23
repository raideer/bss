
export enum SettingValueType {
  Checkbox,
  Select,
  Text,
  Information
}

export const SettingCategory = {
  AdList: 'ad-list',
  Appearance: 'appearance',
  Search: 'search'
}

interface BaseSetting {
  type: SettingValueType,
  title: string,
  description?: string,
  id: string,
}

export type TextSetting = BaseSetting & {
  type: SettingValueType.Text
  disabled?: boolean
}

export type InformationSetting = BaseSetting & {
  type: SettingValueType.Information
}

export type CheckboxSetting = BaseSetting & {
  type: SettingValueType.Checkbox
}

export type SelectSetting = BaseSetting & {
  type: SettingValueType.Select,
  options: { label: string, value: string }[]
}

export type Setting = CheckboxSetting | SelectSetting | TextSetting | InformationSetting

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
