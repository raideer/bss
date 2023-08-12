export const pluralize = (count: number, singular: string, plural: string) => {
  return count % 10 === 1 ? singular : plural
}
