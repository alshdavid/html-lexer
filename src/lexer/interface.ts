import { TokenLabel } from '../tokens'

export type LexerResult = [TokenLabel, string]
export type LexerResults = LexerResult[]
export type OnWriteCallback = (token: LexerResult) => any
export type OnEndCallback = () => any
export type DisposeCallback = () => any

export interface ILexer {
  onWrite(callback: OnWriteCallback): DisposeCallback
  onEnd(callback: OnEndCallback): DisposeCallback
  write(input: string): void
  end(): void
  getPosition(): { line: number, column: number }
}
