import { TokenType } from './token-type.mjs'

/** 
* @typedef {typeof TokenIndex[keyof typeof TokenIndex]} TokenIndex
* @readonly */
export const TokenIndex = Object.freeze({
  [TokenType.errorToken]: 'errorToken',
  [TokenType.data]: 'data',
  [TokenType.rawtext]: 'rawtext',
  [TokenType.rcdata]: 'rcdata',
  [TokenType.plaintext]: 'plaintext',
  [TokenType.nulls]: 'nulls',
  [TokenType.space]: 'space',
  [TokenType.newline]: 'newline',
  [TokenType.ampersand]: 'ampersand',
  [TokenType.lt]: 'lt',
  [TokenType.charRefDecimal]: 'charRefDecimal',
  [TokenType.charRefHex]: 'charRefHex',
  [TokenType.charRefNamed]: 'charRefNamed',
  [TokenType.charRefLegacy]: 'charRefLegacy',
  [TokenType.mDeclStart]: 'mDeclStart',
  [TokenType.commentStart]: 'commentStart',
  [TokenType.commentData]: 'commentData',
  [TokenType.commentEnd]: 'commentEnd',
  [TokenType.bogusStart]: 'bogusStart',
  [TokenType.bogusData]: 'bogusData',
  [TokenType.bogusEnd]: 'bogusEnd',
  [TokenType.startTagStart]: 'startTagStart',
  [TokenType.endTagStart]: 'endTagStart',
  [TokenType.tagEnd]: 'tagEnd',
  [TokenType.attributeSep]: 'attributeSep',
  [TokenType.attributeName]: 'attributeName',
  [TokenType.attributeAssign]: 'attributeAssign',
  [TokenType.valueStartApos]: 'valueStartApos',
  [TokenType.valueStartQuot]: 'valueStartQuot',
  [TokenType.valueEnd]: 'valueEnd',
  [TokenType.unquoted]: 'unquoted',
  [TokenType.squoted]: 'squoted',
  [TokenType.quoted]: 'quoted',
})