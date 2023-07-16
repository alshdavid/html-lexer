import { TokenType, TokenIndex, TokenLabel } from '../tokens/index.mjs'

// TokenTypes
// ----------

// This maps the DFA tokenTypes from ints to strings;
// It renames some of the token-types to maintain some
// compatibility with previous versions of html-lexer.

/**
 * @typedef {typeof LegacyTokenLabel[keyof typeof LegacyTokenLabel]} LegacyTokenLabel
 * @readonly */
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

/**
 * @typedef {typeof LegacyTokenIndex[keyof typeof LegacyTokenIndex]} LegacyTokenIndex
 * @readonly */
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
