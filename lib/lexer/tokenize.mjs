import { Lexer } from './lexer.mjs'

/** @returns {import('./lexer.mjs').LexerResults} */
export function tokenize(/** @type {string} */ code) {
  /** @type {import('./lexer.mjs').LexerResults} */
  let result = []

  const lexer = new Lexer({
    useLegacyTokens: false,
  })

  lexer.onWrite((tokens) => result.push(tokens))

  lexer.write(code)
  lexer.end()

  return result
}
