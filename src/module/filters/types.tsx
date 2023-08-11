interface BaseFilterInput {
  name: string,
  type: string,
}

export interface TextFilterInput extends BaseFilterInput {
  type: 'text' | 'number'
}

export interface SelectFilterInputValue {
  name: string,
  value: string
}

export interface SelectFilterInput extends BaseFilterInput {
  type: 'select'
  changesPage: boolean
  values: SelectFilterInputValue[]
}

export interface PageFilterInput extends SelectFilterInput {
  changesPage: true
}

export type FilterInput = TextFilterInput | SelectFilterInput | PageFilterInput

export interface Filter {
  title: string,
  inputs: FilterInput[]
}

export interface PageFilter extends Filter {
  inputs: PageFilterInput[]
}

export interface FilterPreset {
  id: string,
  name: string,
  notifications: boolean,
  filters: Filter[],
  path: string,
  params: Record<string, string>
}
