import { maxBy, trimEnd, trimStart } from 'lodash-es'

export interface PatternOutput {
  position: number
  values: string[]
  partLength: number
  pattern: string
}

export interface CombinedPattern {
  pattern: string
  values: Record<string, string[]>
}

/**
 * Takes in an array of options and returns a pattern that can be used to
 * generate all possible options.
 *
 * For example,
 * - /lv/real-estate/flats/riga/centre/filter/
 * - /lv/real-estate/flats/riga/centre/sell/filter/
 * - /lv/real-estate/flats/riga/centre/buy/filter/
 *
 * outputs
 * - /lv/real-estate/flats/riga/centre/$1/filter/
 * and options
 * - '', 'sell', 'buy'
 */
export const getPattern = (options: string[]): PatternOutput | null => {
  let previousParts: string[] = []
  const possibleValues: string[] = []

  let changingPosition: number | null = null
  // Used to account for the first empty value
  let lastEmpty = false

  options.forEach((option, i) => {
    // Trim trailing and leading slashes
    const optionClean = trimStart(trimEnd(option, '/'), '/')
    const parts = optionClean.split('/')

    if (previousParts.length) {
      // If the number of parts has changed, we can assume that it's
      // possible to have an empty value at this position
      if (previousParts.length !== parts.length) {
        possibleValues.push('')
        lastEmpty = true
      } else {
        // Find which part changed
        parts.forEach((section, j) => {
          if (previousParts[j] !== section) {
            changingPosition = j

            if (lastEmpty) {
              possibleValues.push(previousParts[j])
              lastEmpty = false
            }

            possibleValues.push(section)
          }
        })
      }
    }

    previousParts = parts
  })

  if (!changingPosition) {
    return null
  }

  const pattern = [...previousParts]
  pattern[changingPosition] = '$1'

  return {
    position: changingPosition,
    values: possibleValues,
    partLength: pattern.length,
    pattern: pattern.join('/')
  }
}

/**
 * Takes multiple patterns and combines them into a single pattern
 */
export const getCombinedPattern = (patterns: PatternOutput[]): CombinedPattern | null => {
  const longest = maxBy(patterns, 'partLength')

  if (!longest) {
    return null
  }

  const basePattern = longest.pattern.split('/')
  const values: Record<string, string[]> = {}

  patterns.forEach((pattern, i) => {
    const mask = `$${i + 1}`
    basePattern[pattern.position] = mask
    values[mask] = pattern.values
  })

  return {
    pattern: basePattern.join('/'),
    values
  }
}
