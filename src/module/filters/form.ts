import { startsWith } from 'lodash-es'
import { FilterInput, Filter, TextFilterInput, SelectFilterInput, PageFilterInput } from './types'

const INPUT_BLACKLIST = [
  'Režīms:'
]

export const getFormInputs = (form: HTMLFormElement) => {
  const filters: Filter[] = []

  const filterElements = Array.from(form.querySelectorAll('.filter_name, .filter_opt_dv'))

  filterElements.forEach((filterElement) => {
    const inputs = getElementInputs(filterElement)
    const title = filterElement.firstChild?.textContent || '<filter-name>'

    if (INPUT_BLACKLIST.includes(title)) {
      return
    }

    if (inputs.length > 0) {
      filters.push({
        title,
        inputs
      })
    }
  })

  return filters
}

const getElementInputs = (element: Element) => {
  const inputElements = Array.from(element.querySelectorAll('input, select'))

  return inputElements.map(input => {
    return getInputData(input as HTMLInputElement | HTMLSelectElement)
  }).filter(input => input !== null) as FilterInput[]
}

const getInputData = (input: HTMLInputElement | HTMLSelectElement): FilterInput | null => {
  switch (input.tagName) {
    case 'INPUT':
      return getTextInputData(input as HTMLInputElement)
    case 'SELECT':
      return getSelectInputData(input as HTMLSelectElement)
  }

  return null
}

const getTextInputData = (input: HTMLInputElement): TextFilterInput => {
  const inputName = input.getAttribute('name') || '<input name>'

  return {
    name: inputName,
    type: input.getAttribute('type') as 'text' | 'number' || 'text'
  }
}

const getSelectInputData = (input: HTMLSelectElement): SelectFilterInput | PageFilterInput => {
  const inputName = input.getAttribute('name') || '<input name>'
  const onChange = input.getAttribute('onchange')
  const usesDifferentPage = onChange && startsWith(onChange, 'go(')

  return {
    name: inputName,
    type: 'select',
    changesPage: !!usesDifferentPage,
    values: Array.from(input.querySelectorAll('option')).map(option => {
      return {
        name: option.textContent || '',
        value: option.value
      }
    })
  }
}
