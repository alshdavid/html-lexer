import * as tokens from './tokens'

export type TokenType = keyof typeof tokens
export type TokenValue = typeof tokens[keyof typeof tokens]
export * as tokens from './tokens'

export function getTokenName(lookup: number): TokenType {
  for (const [name, value] of Object.entries(tokens)) {
    if (value === lookup) {
      // @ts-expect-error
      return name
    }
  }
  throw new Error('Token not found')
}