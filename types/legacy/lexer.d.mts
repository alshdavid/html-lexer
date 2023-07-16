/** @typedef {[LegacyTokenLabel, string]} LegacyLexerResult */
/** @typedef {LegacyLexerResult[]} LegacyLexerResults */
/** @typedef {(token: LegacyLexerResult) => any} OnWriteCallback */
/** @typedef {() => any} OnEndCallback */
/** @typedef {() => any} DisposeCallback */
export class LegacyLexer {
    /** @returns {LegacyLexerResults} */
    static tokenize(code: string): LegacyLexerResults;
    /** @returns {DisposeCallback} */
    onWrite(callback: OnWriteCallback): DisposeCallback;
    /** @returns {DisposeCallback} */
    onEnd(callback: OnEndCallback): DisposeCallback;
    /** @returns {void} */
    write(input: string): void;
    /** @returns {void} */
    end(): void;
    /** @returns {{ line: number, column: number }} */
    getPosition(): {
        line: number;
        column: number;
    };
    #private;
}
export type LegacyLexerResult = [LegacyTokenLabel, string];
export type LegacyLexerResults = [LegacyTokenLabel, string][];
export type OnWriteCallback = (token: LegacyLexerResult) => any;
export type OnEndCallback = () => any;
export type DisposeCallback = () => any;
import { LegacyTokenLabel } from './token-index-override.mjs';
