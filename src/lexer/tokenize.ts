import { LexerResults } from "./interface.js"
import { Lexer } from "./lexer.js"

export function tokenize(code: string): LexerResults {
  const result: LexerResults = []

  const lexer = new Lexer()
  lexer.onWrite((tokens) => result.push(tokens))
  lexer.write(code)
  lexer.end()
  
  return result
}
