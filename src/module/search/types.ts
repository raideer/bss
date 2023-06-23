export interface SearchCategory {
  name: string;
  url: string;
  children: SearchCategory[];
}

export type FlatSearchCategory = Omit<SearchCategory, 'children'> & {
  parent?: string;
}
