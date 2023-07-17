import { getTokenName, tokens } from '../tokens'
import { states as S } from '../states'
import { getCharFromCode } from '../characters'
import { getCellFromStateTable, getTokenForState } from '../table'
import { splitCharRef } from './split-char-ref'
import { contentMap } from './content-map'
import { FAIL, errorToken } from './tokens'
import {
  DisposeCallback,
  ILexer,
  LexerResult,
  OnEndCallback,
  OnWriteCallback,
} from './interface'

export class Lexer implements ILexer {
  #onWriteCallbacks: Set<OnWriteCallback>
  #onEndCallbacks: Set<OnEndCallback>
  #buffer: string
  #closed: boolean
  #line: number
  #lastnl: number
  #_c: number
  #anchor: number
  #end: number
  #pos: number
  #entry: number
  #lastTagType: number
  #lastStartTagName: string

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

  onWrite(callback: OnWriteCallback): DisposeCallback {
    if (this.#closed) throw new Error('Cannot subscribe, Lexer has completed')
    this.#onWriteCallbacks.add(callback)
    return () => this.#onWriteCallbacks.delete(callback)
  }

  onEnd(callback: OnEndCallback): DisposeCallback {
    if (this.#closed) throw new Error('Cannot subscribe, Lexer has completed')
    this.#onEndCallbacks.add(callback)
    return () => this.#onEndCallbacks.delete(callback)
  }

  write(input: string): void {
    this.#buffer += input
    const length = this.#buffer.length

    while (this.#pos < length) {
      let state: number | undefined = this.#entry
      let exit = this.#entry < S.minAccepts ? FAIL : this.#entry

      while (true) {
        const charCode = this.#buffer.charCodeAt(this.#pos)
        const charLookup = getCharFromCode(charCode)
        state = getCellFromStateTable(state, charLookup)
        
        this.#pos += 1

        if (state && S.minAccepts <= state) {
          exit = state
          this.#end = this.#pos
        }

        // Newline counter
        if (charCode === 0xD || charCode === 0xA) {
          this.#lastnl = this.#pos

          if (this.#_c !== 0xd) {
            this.#line += 1
          }
        }

        this.#_c = charCode

        if (state === S.STOP || this.#pos > length) {
          break
        }
      }

      if (this.#end < this.#buffer.length || this.#closed) {
        const type = getTokenForState(exit)

        if (type) {
          this.#emit(type, this.#anchor, this.#end)
        }
      } else {
        this.#pos = this.#end = this.#anchor
        break
      }
    }

    this.#buffer = this.#buffer.substring(this.#end)
    this.#anchor = this.#pos = this.#end = 0
  }

  end(): void {
    this.#closed = true
    this.write('')
    this.#triggerEndCallback()
    this.#onWriteCallbacks.clear()
    this.#onEndCallbacks.clear()
  }

  getPosition(): { line: number; column: number } {
    return {
      line: this.#line,
      column: this.#pos - this.#lastnl,
    }
  }

  #emit(type: number, _anchor: number, end: number): void {
    if (type === errorToken) {
      const message = `Lexer error at line ${this.#line}:${
        this.#pos - this.#lastnl
      }`
      throw new SyntaxError(message)
    } 
    
    if (type === tokens.startTagStart) {
      const tagName = this.#buffer.substring(this.#anchor + 1, end)
      this.#lastTagType = type
      this.#lastStartTagName = tagName.toLowerCase()
      this.#triggerWriteCallback(['startTagStart', '<'])
      this.#triggerWriteCallback(['tagName', tagName])
      this.#entry = S.BeforeAttribute
      this.#anchor = end
      this.#pos = end
      return
    }

    if (type === tokens.endTagStart) {
      const tagName = this.#buffer.substring(this.#anchor + 2, end)
      this.#lastTagType = type
      if (
        this.#entry === S.Main ||
        this.#lastStartTagName === tagName.toLowerCase()
      )
        this.#entry = S.BeforeAttribute
      else this.#entry === S.RcData ? tokens.rcdata : tokens.rawtext
      this.#triggerWriteCallback(['endTagStart', '</'])
      this.#triggerWriteCallback(['tagName', tagName])
      this.#anchor = end
      this.#pos = end
      return
    }

    if (type === tokens.mDeclStart) {
      this.#entry = S.Bogus
      const data = this.#buffer.substring(this.#anchor + 2, end)
      this.#triggerWriteCallback(['bogusStart', '<!'])
      this.#triggerWriteCallback(['bogusData', data])
      this.#anchor = end
      this.#pos = end
      return
    }

    if (type === tokens.tagEnd) {
      const xmlIsh = false // needs the feedback // TODO support SVG / MathML
      this.#entry =
        this.#lastTagType === tokens.startTagStart && !xmlIsh
          ? Reflect.get(contentMap, this.#lastStartTagName) || S.Main
          : S.Main
      const type = this.#buffer[end - 2] === '/' ? 'tagEndAutoclose' : 'tagEnd'
      const data = this.#buffer.substring(this.#anchor, end)
      this.#triggerWriteCallback([type, data])
      this.#anchor = end
      this.#pos = end
      return
    }

    if (
      type === tokens.charRefNamed ||
      type === tokens.charRefLegacy
    ) {
      const nextChar = this.#buffer[end] || '' // FIXME case at buffer end ? need to back up...
      const parts = splitCharRef(
        this.#buffer.substring(this.#anchor, end),
        this.#entry,
        nextChar
      )
      for (const item of parts) {
        this.#triggerWriteCallback(item)
      }
      this.#anchor = end
      this.#pos = end
      return
    }

    if (type === tokens.attributeSep) {
      this.#entry = S.BeforeAttribute
    }

    if (type === tokens.attributeName) {
      this.#entry = S.BeforeAssign
    }

    if (type === tokens.attributeAssign) {
      this.#entry = S.BeforeValue
    }

    if (type === tokens.valueStartQuot) {
      this.#entry = S.ValueQuoted
    }

    if (type === tokens.valueStartApos) {
      this.#entry = S.ValueAposed
    }

    if (type === tokens.valueEnd) {
      this.#entry = S.BeforeAttribute
    }

    if (type === tokens.unquoted) {
      this.#entry = S.ValueUnquoted
    }

    if (type === tokens.commentStart) {
      this.#entry = S.BeforeCommentData
    }

    if (type === tokens.commentData) {
      this.#entry = S.InCommentData
    }

    if (type === tokens.commentEnd) {
      this.#entry = S.Main
    }

    if (type === tokens.bogusStart) {
      this.#entry = S.Bogus
    }

    if (type === tokens.bogusData) {
      this.#entry = S.Bogus
    }

    if (type === tokens.bogusEnd) {
      this.#entry = S.Main
    }

    const name = getTokenName(type)
    const char = this.#buffer.substring(this.#anchor, end)
    this.#triggerWriteCallback([name, char])
    this.#anchor = end
    this.#pos = end
  }

  #triggerWriteCallback(value: LexerResult): void {
    for (const callback of this.#onWriteCallbacks) callback(value)
  }

  #triggerEndCallback(): void {
    for (const callback of this.#onEndCallbacks) callback()
  }
}
