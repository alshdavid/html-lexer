import { TokenType } from './token-type.mjs'
import { TokenLabel } from './token-label.mjs'

/**
 * @typedef {typeof TokenIndex[keyof typeof TokenIndex]} TokenIndex
 * @readonly */
export const TokenIndex = Object.freeze({
  [TokenType.errorToken]: TokenLabel.errorToken,
  [TokenType.data]: TokenLabel.data,
  [TokenType.rawtext]: TokenLabel.rawtext,
  [TokenType.rcdata]: TokenLabel.rcdata,
  [TokenType.plaintext]: TokenLabel.plaintext,
  [TokenType.nulls]: TokenLabel.nulls,
  [TokenType.space]: TokenLabel.space,
  [TokenType.newline]: TokenLabel.newline,
  [TokenType.ampersand]: TokenLabel.ampersand,
  [TokenType.lt]: TokenLabel.lt,
  [TokenType.charRefDecimal]: TokenLabel.charRefDecimal,
  [TokenType.charRefHex]: TokenLabel.charRefHex,
  [TokenType.charRefNamed]: TokenLabel.charRefNamed,
  [TokenType.charRefLegacy]: TokenLabel.charRefLegacy,
  [TokenType.mDeclStart]: TokenLabel.mDeclStart,
  [TokenType.commentStart]: TokenLabel.commentStart,
  [TokenType.commentData]: TokenLabel.commentData,
  [TokenType.commentEnd]: TokenLabel.commentEnd,
  [TokenType.bogusStart]: TokenLabel.bogusStart,
  [TokenType.bogusData]: TokenLabel.bogusData,
  [TokenType.bogusEnd]: TokenLabel.bogusEnd,
  [TokenType.startTagStart]: TokenLabel.startTagStart,
  [TokenType.endTagStart]: TokenLabel.endTagStart,
  [TokenType.tagEnd]: TokenLabel.tagEnd,
  [TokenType.attributeSep]: TokenLabel.attributeSep,
  [TokenType.attributeName]: TokenLabel.attributeName,
  [TokenType.attributeAssign]: TokenLabel.attributeAssign,
  [TokenType.valueStartApos]: TokenLabel.valueStartApos,
  [TokenType.valueStartQuot]: TokenLabel.valueStartQuot,
  [TokenType.valueEnd]: TokenLabel.valueEnd,
  [TokenType.unquoted]: TokenLabel.unquoted,
  [TokenType.squoted]: TokenLabel.squoted,
  [TokenType.quoted]: TokenLabel.quoted,
})
