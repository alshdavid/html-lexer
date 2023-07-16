export type LegacyTokenLabel = (typeof LegacyTokenLabel)[keyof typeof LegacyTokenLabel];
/**
 * @typedef {typeof LegacyTokenLabel[keyof typeof LegacyTokenLabel]} LegacyTokenLabel
 * @readonly */
export const LegacyTokenLabel: Readonly<{
    tagSpace: "tagSpace";
    attributeValueStart: "attributeValueStart";
    attributeValueEnd: "attributeValueEnd";
    commentStartBogus: "commentStartBogus";
    commentEndBogus: "commentEndBogus";
    lessThanSign: "lessThanSign";
    uncodedAmpersand: "uncodedAmpersand";
}>;
export type LegacyTokenIndex = (typeof LegacyTokenIndex)[keyof typeof LegacyTokenIndex];
/**
 * @typedef {typeof LegacyTokenIndex[keyof typeof LegacyTokenIndex]} LegacyTokenIndex
 * @readonly */
export const LegacyTokenIndex: Readonly<{
    30: "attributeValueData";
    32: "attributeValueData";
    31: "attributeValueData";
    24: "tagSpace";
    27: "attributeValueStart";
    28: "attributeValueStart";
    29: "attributeValueEnd";
    18: "commentStartBogus";
    19: "commentData";
    20: "commentEndBogus";
    9: "lessThanSign";
    8: "uncodedAmpersand";
    0: "errorToken";
    1: "data";
    2: "rawtext";
    3: "rcdata";
    4: "plaintext";
    5: "nulls";
    6: "space";
    7: "newline";
    10: "charRefDecimal";
    11: "charRefHex";
    12: "charRefNamed";
    13: "charRefLegacy";
    14: "mDeclStart";
    15: "commentStart";
    16: "commentData";
    17: "commentEnd";
    21: "startTagStart";
    22: "endTagStart";
    23: "tagEnd";
    25: "attributeName";
    26: "attributeAssign";
}>;
