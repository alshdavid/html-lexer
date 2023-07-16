import { states as S } from '../states'
import { PREFIXED, LEGACY } from '../characters'
import { LegacyTokenLabel } from './token-index-override'
import { LegacyLexerResults } from './interface'

export function splitCharRef(
  string: string,
  entry: number,
  nextChar: string
): LegacyLexerResults {
  // A semicolon-terminated, known charref
  if (PREFIXED.test(string)) {
    return [[LegacyTokenLabel.charRefNamed, string]]
  }

  // Test legacy charrefs (terminated or nonterminated)
  const r = LEGACY.exec(string)
  const terminated = string[string.length - 1] === ';'

  const dataTokenType =
    entry === S.Main
      ? LegacyTokenLabel.data
      : entry === S.RcData
      ? LegacyTokenLabel.rcdata
      : LegacyTokenLabel.attributeValueData

  // Not a special charref, nor one with trailing alphanums
  if (!r) {
    return terminated
      ? [[LegacyTokenLabel.charRefNamed, string]]
      : [[dataTokenType, string]]
  }

  // A semicolon terminated legacy charref
  if (r[2] === ';') return [[LegacyTokenLabel.charRefNamed, '&' + r[1] + ';']]

  const inAttribute =
    entry === S.BeforeValue ||
    entry === S.ValueQuoted ||
    entry === S.ValueAposed ||
    entry === S.ValueUnquoted

  // A nonterminated legacy charref (exact match)
  if (r[2] === '') {
    if (!inAttribute || nextChar !== '=') {
      return [[LegacyTokenLabel.charRefLegacy, string]] // And also a parse error
    }
    return [[dataTokenType, string]]
  }

  // A nonterminated legacy charref with trailing alphanums
  else {
    if (!inAttribute) {
      return [
        [LegacyTokenLabel.charRefLegacy, '&' + r[1]],
        [dataTokenType, r[2] || ''],
      ]
    }
    return [[dataTokenType, string]]
  }
}
