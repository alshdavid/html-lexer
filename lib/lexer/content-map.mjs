import { states as S } from "../states/index.mjs"

// The contentMap defines the lexer state to use 
// immediately _after_ specific html start-tags.
export const contentMap = {
  style:     S.RawText,
  script:    S.RawText,
  xmp:       S.RawText,
  iframe:    S.RawText,
  noembed:   S.RawText,
  noframes:  S.RawText,
  textarea:  S.RcData,
  title:     S.RcData,
  plaintext: S.PlainText
  // noscript: scriptingEnabled ? S.RawText : S.Main
}