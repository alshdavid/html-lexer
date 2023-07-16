export type TokenIndex = (typeof TokenIndex)[keyof typeof TokenIndex];
/**
 * @typedef {typeof TokenIndex[keyof typeof TokenIndex]} TokenIndex
 * @readonly */
export const TokenIndex: Readonly<{
    0: "errorToken";
    1: "data";
    2: "rawtext";
    3: "rcdata";
    4: "plaintext";
    5: "nulls";
    6: "space";
    7: "newline";
    8: "ampersand";
    9: "lt";
    10: "charRefDecimal";
    11: "charRefHex";
    12: "charRefNamed";
    13: "charRefLegacy";
    14: "mDeclStart";
    15: "commentStart";
    16: "commentData";
    17: "commentEnd";
    18: "bogusStart";
    19: "bogusData";
    20: "bogusEnd";
    21: "startTagStart";
    22: "endTagStart";
    23: "tagEnd";
    24: "attributeSep";
    25: "attributeName";
    26: "attributeAssign";
    27: "valueStartApos";
    28: "valueStartQuot";
    29: "valueEnd";
    30: "unquoted";
    31: "squoted";
    32: "quoted";
}>;
