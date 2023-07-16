import { Lexer } from "./lexer.mjs";

export function tokenize(/** @type {string} */ code) {
  let result = [];
  const lexer = new Lexer({
    write: (v) => result.push(v),
    end: () => null,
  });

  lexer.write(code);
  lexer.end();

  return result;
}
