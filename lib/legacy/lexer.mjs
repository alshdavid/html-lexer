import { TokenLabel } from '../tokens/index.mjs'
import { states as S, minAccepts } from '../states/index.mjs'
import { defaultClass, eqClass } from '../characters/index.mjs'
import { table } from '../table/index.mjs'
import { TokenType } from '../tokens/index.mjs'
import { splitCharRef } from '../lexer/split-char-ref.mjs'
import { contentMap } from '../lexer/content-map.mjs'
import { FAIL, errorToken } from '../lexer/tokens.mjs'
import { LegacyTokenIndex, LegacyTokenLabel } from './token-index-override.mjs'

/** @typedef {[LegacyTokenLabel, string]} LegacyLexerResult */
/** @typedef {LegacyLexerResult[]} LegacyLexerResults */

/** @typedef {(token: LegacyLexerResult) => any} OnWriteCallback */
/** @typedef {() => any} OnEndCallback */
/** @typedef {() => any} DisposeCallback */

export class LegacyLexer {
  /** @type {Set<OnWriteCallback>} */
  #onWriteCallbacks

  /** @type {Set<OnEndCallback>} */
  #onEndCallbacks

  /** @type {string} */
  #buffer

  /** @type {boolean} */
  #closed

  /** @type {number} */
  #line

  /** @type {number} */
  #lastnl

  /** @type {number} */
  #_c

  /** @type {number} */
  #anchor

  /** @type {number} */
  #end

  /** @type {number} */
  #pos

  /** @type {number} */
  #entry

  /** @type {number} */
  #lastTagType

  /** @type {string} */
  #lastStartTagName

  constructor() {
    this.#onWriteCallbacks = new Set()
    this.#onEndCallbacks = new Set()
    this.#buffer = ''
    this.#closed = false // true after end() call
    this.#line = 1
    this.#lastnl = 0
    this.#_c = 0 // line counter
    this.#anchor = 0
    this.#end = 0
    this.#pos = 0 // lexer position
    this.#entry = S.Main // lexer (entry) state-id
    this.#lastTagType = 0
    this.#lastStartTagName = ''
  }

  /** @returns {LegacyLexerResults} */
  static tokenize(/** @type {string} */ code) {
    /** @type {LegacyLexerResults} */
    const result = []

    const lexer = new LegacyLexer()
    lexer.onWrite((tokens) => result.push(tokens))
    lexer.write(code)
    lexer.end()
    
    return result
  }

  /** @returns {DisposeCallback} */
  onWrite(/** @type {OnWriteCallback} */ callback) {
    if (this.#closed) throw new Error('Cannot subscribe, Lexer has completed')
    this.#onWriteCallbacks.add(callback)
    return () => this.#onWriteCallbacks.delete(callback)
  }

  /** @returns {DisposeCallback} */
  onEnd(/** @type {OnEndCallback} */ callback) {
    if (this.#closed) throw new Error('Cannot subscribe, Lexer has completed')
    this.#onEndCallbacks.add(callback)
    return () => this.#onEndCallbacks.delete(callback)
  }

  /** @returns {void} */
  write(/** @type {string} */ input) {
    this.#buffer += input
    const length = this.#buffer.length
    while (this.#pos < length) {
      /** @type {number | undefined} */
      let state = this.#entry
      let exit = this.#entry < minAccepts ? FAIL : this.#entry
      do {
        const c = this.#buffer.charCodeAt(this.#pos++)
        const indexLookup = (c <= 0x7a ? eqClass[c] : defaultClass) || 0
        state = table[state]?.[indexLookup] || undefined
        if (state && minAccepts <= state)
          (exit = state), (this.#end = this.#pos)
        // Newline counter
        if (c === 0xd || c === 0xa) {
          this.#lastnl = this.#pos
          if (this.#_c !== 0xd) {
            this.#line += 1
          }
        }
        this.#_c = c
      } while (state && this.#pos < length)

      if (this.#end < this.#buffer.length || this.#closed) {
        const type = table[exit]?.[0]
        if (type) {
          this.#emit(type, this.#anchor, this.#end)
        }
      } else {
        this.#pos = this.#end = this.#anchor
        break
      }
    }
    this.#buffer = this.#buffer.substr(this.#end)
    this.#anchor = this.#pos = this.#end = 0
  }

  /** @returns {void} */
  end() {
    this.#closed = true
    this.write('')
    this.#triggerEndCallback()
    this.#onWriteCallbacks.clear()
    this.#onEndCallbacks.clear()
  }

  /** @returns {{ line: number, column: number }} */
  getPosition() {
    return {
      line: this.#line,
      column: this.#pos - this.#lastnl,
    }
  }

  /** @returns {number | undefined} */
  #emit(
    /** @type {number} */ type,
    /** @type {number} */ _anchor,
    /** @type {number} */ end
  ) {
    if (type === errorToken) {
      const message = `Lexer error at line ${this.#line}:${
        this.#pos - this.#lastnl
      }`
      throw new SyntaxError(message)
    } else if (type === TokenType.startTagStart) {
      const tagName = this.#buffer.substring(this.#anchor + 1, end)
      this.#lastTagType = type
      this.#lastStartTagName = tagName.toLowerCase()
      this.#triggerWriteCallback([TokenLabel.startTagStart, '<'])
      this.#triggerWriteCallback([TokenLabel.tagName, tagName])
      this.#entry = S.BeforeAttribute
      return (this.#anchor = this.#pos = end) // NB returns
    } else if (type === TokenType.endTagStart) {
      const tagName = this.#buffer.substring(this.#anchor + 2, end)
      this.#lastTagType = type
      if (
        this.#entry === S.Main ||
        this.#lastStartTagName === tagName.toLowerCase()
      )
        this.#entry = S.BeforeAttribute
      else this.#entry === S.RcData ? TokenType.rcdata : TokenType.rawtext
      this.#triggerWriteCallback(['endTagStart', '</'])
      this.#triggerWriteCallback(['tagName', tagName])
      return (this.#anchor = this.#pos = end) // NB returns
    } else if (type === TokenType.mDeclStart) {
      this.#entry = S.Bogus
      const label = LegacyTokenIndex[TokenType.bogusStart]
      this.#triggerWriteCallback([label, '<!'])
      this.#triggerWriteCallback([
        LegacyTokenIndex[TokenType.bogusData],
        this.#buffer.substring(this.#anchor + 2, end),
      ])
      return (this.#anchor = this.#pos = end) // NB returns
    } else if (type === TokenType.tagEnd) {
      const xmlIsh = false // needs the feedback // TODO support SVG / MathML
      this.#entry =
        this.#lastTagType === TokenType.startTagStart && !xmlIsh
          ? Reflect.get(contentMap, this.#lastStartTagName) || S.Main
          : S.Main
      const ttype = this.#buffer[end - 2] === '/' ? 'tagEndAutoclose' : 'tagEnd'
      this.#triggerWriteCallback([
        ttype,
        this.#buffer.substring(this.#anchor, end),
      ])
      return (this.#anchor = this.#pos = end) // NB returns
    } else if (
      type === TokenType.charRefNamed ||
      type === TokenType.charRefLegacy
    ) {
      const nextChar = this.#buffer[end] || '' // FIXME case at buffer end ? need to back up...
      const parts = splitCharRef(
        this.#buffer.substring(this.#anchor, end),
        this.#entry,
        nextChar
      )
      for (const item of parts) this.#triggerWriteCallback(item)
      return (this.#anchor = this.#pos = end) // NB returns
    } else if (type === TokenType.attributeSep) {
      this.#entry = S.BeforeAttribute
    } else if (type === TokenType.attributeName) {
      this.#entry = S.BeforeAssign
    } else if (type === TokenType.attributeAssign) {
      this.#entry = S.BeforeValue
    } else if (type === TokenType.valueStartQuot) {
      this.#entry = S.ValueQuoted
    } else if (type === TokenType.valueStartApos) {
      this.#entry = S.ValueAposed
    } else if (type === TokenType.valueEnd) {
      this.#entry = S.BeforeAttribute
    } else if (type === TokenType.unquoted) {
      this.#entry = S.ValueUnquoted
    } else if (type === TokenType.commentStart) {
      this.#entry = S.BeforeCommentData
    } else if (type === TokenType.commentData) {
      this.#entry = S.InCommentData
    } else if (type === TokenType.commentEnd) {
      this.#entry = S.Main
    } else if (type === TokenType.bogusStart) {
      this.#entry = S.Bogus
    } else if (type === TokenType.bogusData) {
      this.#entry = S.Bogus
    } else if (type === TokenType.bogusEnd) {
      this.#entry = S.Main
    }
    // case T.newline:      entry = entry;               break

    const name = Reflect.get(LegacyTokenIndex, type)
    this.#triggerWriteCallback([
      name,
      this.#buffer.substring(this.#anchor, end),
    ])
    this.#anchor = this.#pos = end
    return undefined
  }

  #triggerWriteCallback(/** @type {LegacyLexerResult} */ value) {
    for (const callback of this.#onWriteCallbacks) callback(value)
  }

  #triggerEndCallback() {
    for (const callback of this.#onEndCallbacks) callback()
  }
}
