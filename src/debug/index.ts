import { states } from '../states'
import { chars } from '../characters'

export function getStateLabel(stateCode: number | undefined): string | undefined {
  if (stateCode === undefined) {
    return undefined
  }
  for (const [name, value] of Object.entries(states)) {
    if (value === stateCode) {
      return name
    }
  }
  return undefined
}

export function getCharLabel(charCode: number | undefined): string | undefined {
  if (charCode === undefined) {
    return undefined
  }
  for (const [name, value] of Object.entries(chars)) {
    if (value === charCode) {
      return name
    }
  }
  return undefined
}

export const log = (...items: any[]) => {
  const output: string[] = []

  for (const item of items) {
    if (typeof item === 'string') {
      output.push(item)
      continue
    }
    if (typeof item === 'number') {
      output.push(item.toString())
      continue
    }
    if (typeof item === 'boolean') {
      output.push(item === true ? 'true' : 'false')
      continue
    }
    output.push(JSON.stringify(item))
  }

  console.log(...output.map(i => i.padEnd(15)))
}