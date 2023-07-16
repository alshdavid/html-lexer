import { LexerResults } from "./interface"
import { Lexer } from "./lexer"

export function tokenize(code: string): LexerResults {
  const result: LexerResults = []

  const lexer = new Lexer()
  lexer.onWrite((tokens) => result.push(tokens))
  lexer.write(code)
  lexer.end()
  
  return result
}
