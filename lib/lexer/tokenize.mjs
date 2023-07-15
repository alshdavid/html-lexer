import { Lexer } from "./lexer.mjs";

/** @returns {import('./lexer.mjs').LexerResults} */
export function tokenize(
  /** @type {string} */ code
) {
  /** @type {import('./lexer.mjs').LexerResults} */
  let result = []

  const lexer = new Lexer({
    write: (v) => result.push(v),
  })

  lexer.write(code)
  lexer.end()

  return result
}
