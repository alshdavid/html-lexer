import * as chars from './characters'

export type CharacterIndex = (typeof CharacterIndex)[keyof typeof CharacterIndex]
export const CharacterIndex = Object.freeze({
  [chars.nul]: 'nul',
  [chars.cr]: 'cr',
  [chars.lf]: 'lf',
  [chars.other]: 'other',
  [chars.quot]: 'quot',
  [chars.squo]: 'squo',
  [chars.space]: 'space',
  [chars.term]: 'term',
  [chars.hash]: 'hash',
  [chars.amp]: 'amp',
  [chars.eq]: 'eq',
  [chars.que]: 'que',
  [chars.excl]: 'excl',
  [chars.dash]: 'dash',
  [chars.lt]: 'lt',
  [chars.gt]: 'gt',
  [chars.slash]: 'slash',
  [chars.digit]: 'digit',
  [chars.A_F]: 'A_F',
  [chars.G_WYZ]: 'G_WYZ',
  [chars.X]: 'X',
})

export function getCharLabel(c: number): string | undefined {
  return (CharacterIndex as any)[c] || undefined
}
