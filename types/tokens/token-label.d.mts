export type TokenLabel = (typeof TokenLabel)[keyof typeof TokenLabel];
/**
 * @typedef {typeof TokenLabel[keyof typeof TokenLabel]} TokenLabel
 * @readonly */
export const TokenLabel: Readonly<{
    errorToken: "errorToken";
    data: "data";
    rawtext: "rawtext";
    rcdata: "rcdata";
    plaintext: "plaintext";
    nulls: "nulls";
    space: "space";
    newline: "newline";
    ampersand: "ampersand";
    lt: "lt";
    charRefDecimal: "charRefDecimal";
    charRefHex: "charRefHex";
    charRefNamed: "charRefNamed";
    charRefLegacy: "charRefLegacy";
    mDeclStart: "mDeclStart";
    commentStart: "commentStart";
    commentData: "commentData";
    commentEnd: "commentEnd";
    bogusStart: "bogusStart";
    bogusData: "bogusData";
    bogusEnd: "bogusEnd";
    startTagStart: "startTagStart";
    endTagStart: "endTagStart";
    tagEnd: "tagEnd";
    attributeSep: "attributeSep";
    attributeName: "attributeName";
    attributeAssign: "attributeAssign";
    valueStartApos: "valueStartApos";
    valueStartQuot: "valueStartQuot";
    valueEnd: "valueEnd";
    unquoted: "unquoted";
    squoted: "squoted";
    quoted: "quoted";
    attributeValueData: "attributeValueData";
    tagName: "tagName";
    tagEndAutoclose: "tagEndAutoclose";
}>;
