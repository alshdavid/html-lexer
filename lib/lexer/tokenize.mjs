import { Lexer } from "./lexer.mjs";
import { LexerOG } from "./original.mjs";
import * as OOG from "../original/index.mjs";
import * as OOOG from "html-lexer";

/** @returns {import('./lexer.mjs').LexerResults} */
export function tokenize(
  /** @type {string} */ code
) {
  /** @type {import('./lexer.mjs').LexerResults} */
  let result = []
  const lexer = new OOOG.Lexer({
    write: (v) => result.push(v),
    end: () => null,
  })

  lexer.write(code)
  lexer.end()

  return result
}
