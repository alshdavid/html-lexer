import { states as S } from '../states/index.mjs'
import { PREFIXED, LEGACY } from '../characters/index.mjs'
import { TokenLabel } from '../tokens/index.mjs'

/** @returns {[TokenLabel, string][]} */
export function splitCharRef(
  /** @type {string} */ string,
  /** @type {number} */ entry,
  /** @type {string} */ nextChar
) {
  // A semicolon-terminated, known charref
  if (PREFIXED.test(string)) {
    return [[TokenLabel.charRefNamed, string]]
  }

  // Test legacy charrefs (terminated or nonterminated)
  const r = LEGACY.exec (string)
  const terminated = string[string.length-1] === ';'

  const dataTokenType
    = entry === S.Main   ? TokenLabel.data
    : entry === S.RcData ? TokenLabel.rcdata : TokenLabel.attributeValueData

  // Not a special charref, nor one with trailing alphanums
  if (!r) {
    return (terminated
      ? [[TokenLabel.charRefNamed, string]]
      : [[dataTokenType, string]])
    }

  // A semicolon terminated legacy charref
  if (r[2] === ';')
    return [[TokenLabel.charRefNamed, '&'+r[1]+';']]

  const inAttribute
    =  entry === S.BeforeValue
    || entry === S.ValueQuoted
    || entry === S.ValueAposed
    || entry === S.ValueUnquoted

  // A nonterminated legacy charref (exact match)
  if (r[2] === '') {
    if (!inAttribute || nextChar !== '=') {
      return [[TokenLabel.charRefLegacy, string]] // And also a parse error
    }
    return [[dataTokenType, string]]
  }

  // A nonterminated legacy charref with trailing alphanums
  else {
    if (!inAttribute) {
      return [[TokenLabel.charRefLegacy, '&'+r[1]], [dataTokenType, r[2] || '']]
    } 
    return [[dataTokenType, string]]
  }
}
