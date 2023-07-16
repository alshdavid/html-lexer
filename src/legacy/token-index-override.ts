import { TokenType, TokenIndex, TokenLabel } from '../tokens'

// TokenTypes
// ----------

// This maps the DFA tokenTypes from ints to strings;
// It renames some of the token-types to maintain some
// compatibility with previous versions of html-lexer.

export type LegacyTokenLabel =
  (typeof LegacyTokenLabel)[keyof typeof LegacyTokenLabel]
export const LegacyTokenLabel = Object.freeze({
  ...TokenLabel,
  tagSpace: 'tagSpace',
  attributeValueStart: 'attributeValueStart',
  attributeValueEnd: 'attributeValueEnd',
  commentStartBogus: 'commentStartBogus',
  commentEndBogus: 'commentEndBogus',
  lessThanSign: 'lessThanSign',
  uncodedAmpersand: 'uncodedAmpersand',
})

export type LegacyTokenIndex =
  (typeof LegacyTokenIndex)[keyof typeof LegacyTokenIndex]
export const LegacyTokenIndex = Object.freeze({
  ...TokenIndex,
  [TokenType.unquoted]: TokenLabel.attributeValueData,
  [TokenType.quoted]: TokenLabel.attributeValueData,
  [TokenType.squoted]: TokenLabel.attributeValueData,
  [TokenType.attributeSep]: LegacyTokenLabel.tagSpace,
  [TokenType.valueStartApos]: LegacyTokenLabel.attributeValueStart,
  [TokenType.valueStartQuot]: LegacyTokenLabel.attributeValueStart,
  [TokenType.valueEnd]: LegacyTokenLabel.attributeValueEnd,
  [TokenType.bogusStart]: LegacyTokenLabel.commentStartBogus,
  [TokenType.bogusData]: TokenLabel.commentData,
  [TokenType.bogusEnd]: LegacyTokenLabel.commentEndBogus,
  [TokenType.lt]: LegacyTokenLabel.lessThanSign,
  [TokenType.ampersand]: LegacyTokenLabel.uncodedAmpersand,
})
