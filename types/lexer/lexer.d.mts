/** @typedef {[TokenLabel, string]} LexerResult */
/** @typedef {LexerResult[]} LexerResults */
/** @typedef {(token: LexerResult) => any} OnWriteCallback */
/** @typedef {() => any} OnEndCallback */
/** @typedef {() => any} DisposeCallback */
export class Lexer {
    /** @returns {LexerResults} */
    static tokenize(code: string): LexerResults;
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
export type LexerResult = [TokenLabel, string];
export type LexerResults = [TokenLabel, string][];
export type OnWriteCallback = (token: LexerResult) => any;
export type OnEndCallback = () => any;
export type DisposeCallback = () => any;
import { TokenLabel } from '../tokens/index.mjs';
