import { LegacyTokenLabel } from './token-index-override'

export type LegacyLexerResult = [LegacyTokenLabel, string]
export type LegacyLexerResults = LegacyLexerResult[]
export type LegacyOnWriteCallback = (token: LegacyLexerResult) => any
export type OnEndCallback = () => any
export type DisposeCallback = () => any

export interface ILegacyLexer {
  onWrite(callback: LegacyOnWriteCallback): DisposeCallback
  onEnd(callback: OnEndCallback): DisposeCallback
  write(input: string): void
  end(): void
  getPosition(): { line: number, column: number }
}
