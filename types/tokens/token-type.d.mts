export type TokenType = (typeof TokenType)[keyof typeof TokenType];
/**
 * @typedef {typeof TokenType[keyof typeof TokenType]} TokenType
 * @readonly */
export const TokenType: Readonly<{
    errorToken: 0;
    data: 1;
    rawtext: 2;
    rcdata: 3;
    plaintext: 4;
    nulls: 5;
    space: 6;
    newline: 7;
    ampersand: 8;
    lt: 9;
    charRefDecimal: 10;
    charRefHex: 11;
    charRefNamed: 12;
    charRefLegacy: 13;
    mDeclStart: 14;
    commentStart: 15;
    commentData: 16;
    commentEnd: 17;
    bogusStart: 18;
    bogusData: 19;
    bogusEnd: 20;
    startTagStart: 21;
    endTagStart: 22;
    tagEnd: 23;
    attributeSep: 24;
    attributeName: 25;
    attributeAssign: 26;
    valueStartApos: 27;
    valueStartQuot: 28;
    valueEnd: 29;
    unquoted: 30;
    squoted: 31;
    quoted: 32;
}>;
