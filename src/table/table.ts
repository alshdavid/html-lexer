import { tokens } from '../tokens'
import { states } from '../states'

// State Transitions
// -----------------

// Columns are character classes, rows are states.
// The first column marks the acceptance of states, by labeling
// it with a nonzero token-type. The runtime assumes that states
// are pre-sorted, such that all states st >= minAccepts are
// accepting states that produce an output token.

// REVIEW How should NUL be handled in rawtext / rcdata?
// TODO handle newlines separately always
// NB nulls in attribute names and values are to be always
// converted to u+fffd and they do not end unquoted values.

// prettier-ignore
const {
  Nul, CR, NL_, Wrd, Wsp, Amp, Rcd, LT, RcdLT, Raw, RawLT, Att, 
  Sep, TagE, Tsp, Cmt, Eq, CmtSD, Cmt_, CmtD, Bog, Bog_, ValQ,
  rQ_, ValS, Val, ETN, LXDD, DX, dRef, AmpX, xRef, TOP, lQ_, Sq_,
  DD, AmpH, Ref, nRef_, xRef_, dRef_, LTx, LTs, STN, LXD, DTN, RLTs,
  EX_, EXs, EN_, EC_, EE_, EEs
} = states

// prettier-ignore
const {
  plaintext, nulls, space, unquoted, newline, attributeSep, data, rawtext, rcdata,
  attributeName, quoted, squoted, bogusData, commentData, ampersand, charRefLegacy, 
  charRefHex, charRefDecimal, lt, bogusStart, startTagStart, endTagStart, mDeclStart,
  commentStart, tagEnd, bogusEnd, commentEnd, attributeAssign, valueStartQuot,
  valueStartApos, valueEnd, charRefNamed, 
  expressionOpen, expressionName, expressionClose, expressionEnd
} = tokens

const ___ = states.STOP

// prettier-ignore
const table = [
//                          nul   CR    LF    other  "     '    \s     ;     #     &     =     ?     !     -     <     >     /    0-9   A-F   G-WYZ  X     {    }  ;
/* 0  */ [ 0,               ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___, ___ ], // STOP
/* 1  */ [ 0,               Nul,  CR,   NL_,  Wrd,  Wrd,  Wrd,  Wsp,  Wrd,  Wrd,  Amp,  Wrd,  Wrd,  Wrd,  Wrd,  LT,   Wrd,  Wrd,  Wrd,  Wrd,  Wrd,  Wrd,  EX_, Wrd ], // Main
/* 2  */ [ 0,               Nul,  CR,   NL_,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  Amp,  Rcd,  Rcd,  Rcd,  Rcd,  RcdLT,Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  ___, ___ ], // RcData
/* 3  */ [ 0,               Nul,  CR,   NL_,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  RawLT,Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  ___, ___ ], // RawText
/* 4  */ [ 0, /*TODO CRLF*/ Att,  Sep,  Sep,  Att,  Att,  Att,  Sep,  Att,  Att,  Att,  Att,  Att,  Att,  Att,  Att,  TagE, Sep,  Att,  Att,  Att,  Att,  ___, ___ ], // BeforeAttribute
/* 5  */ [ 0, /*TODO CRLF*/ Att,  Tsp,  Tsp,  Att,  Att,  Att,  Tsp,  Att,  Att,  Att,  Eq,   Att,  Att,  Att,  Att,  TagE, Sep,  Att,  Att,  Att,  Att,  ___, ___ ], // BeforeAssign
/* 6  */ [ 0,               Nul,  CR,   NL_,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  CmtSD,Cmt,  Cmt_, Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  ___, ___ ], // BeforeCommentData
/* 7  */ [ 0,               Nul,  CR,   NL_,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  CmtD, Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  ___, ___ ], // InCommentData
/* 8  */ [ 0,               Nul,  CR,   NL_,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog_, Bog,  Bog,  Bog,  Bog,  Bog,  ___, ___ ], // Bogus
/* 9  */ [ 0,               Nul,  CR,   NL_,  ValQ, rQ_,  ValQ, ValQ, ValQ, ValQ, Amp,  ValQ, ValQ, ValQ, ValQ, ValQ, ValQ, ValQ, ValQ, ValQ, ValQ, ValQ, ___, ___ ], // ValueQuoted
/* 10 */ [ 0,               Nul,  CR,   NL_,  ValS, ValS, rQ_,  ValS, ValS, ValS, Amp,  ValS, ValS, ValS, ValS, ValS, ValS, ValS, ValS, ValS, ValS, ValS, ___, ___ ], // ValueAposed
/* 11 */ [ 0, /*TODO CRLF*/ Val,  Sep,  Sep,  Val,  Val,  Val,  Sep,  Val,  Val,  Amp,  Val,  Val,  Val,  Val,  Val,  TagE, Val,  Val,  Val,  Val,  Val,  ___, ___ ], // ValueUnquoted
/* 12 */ [ 0,               ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ETN,  ETN,  ETN,  ___, ___ ], // RLTs:  after </ in rcdata and rawtext
/* 13 */ [ 0,               ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  LXDD, ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___, ___ ], // LXD:   after <!-
/* 14 */ [ 0, /*TODO CRLF*/ Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  DX,   ___,  Cmt,  Cmt_, Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  ___, ___ ], // DD:    after --
/* 15 */ [ 0, /*TODO CRLF*/ Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt_, Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  ___, ___ ], // DX:    after -!
/* 16 */ [ 0,               ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  dRef, ___,  ___,  AmpX, ___, ___ ], // AmpH:  after &#
/* 17 */ [ 0,               ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  xRef, xRef, ___,  ___,  ___, ___ ], // AmpX:  after &#x or &#X
/* 18 */ [ plaintext,       TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  ___, ___ ], // TOP
/* 19 */ [ nulls,           Nul,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___, ___ ], // Nul    null bytes
/* 20 */ [ space,           ___,  ___,  ___,  ___,  ___,  ___,  Wsp,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___, ___ ], // Wsp    whitespace
/* 21 */ [ unquoted,        Val,  ___,  ___,  Val,  lQ_,  Sq_,  ___,  Val,  Val,  Amp,  Val,  Val,  Val,  Val,  Val,  TagE, Val,  Val,  Val,  Val,  Val,  ___, ___ ], // BeforeValue
/* 22 */ [ newline,         ___,  ___,  NL_,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___, ___ ], // CR     after CR
/* 23 */ [ attributeSep,    ___,  Tsp,  Tsp,  ___,  ___,  ___,  Tsp,  ___,  ___,  ___,  Eq,   ___,  ___,  ___,  ___,  TagE, Sep,  ___,  ___,  ___,  ___,  ___, ___ ], // Tsp    after space after attribute name
/* 24 */ [ data,            ___,  ___,  ___,  Wrd,  Wrd,  Wrd,  ___,  Wrd,  Wrd,  ___,  Wrd,  Wrd,  Wrd,  Wrd,  ___,  Wrd,  Wrd,  Wrd,  Wrd,  Wrd,  Wrd,  ___, Wrd ], // Wrd    alphanumeric
/* 25 */ [ rawtext,         ___,  ___,  ___,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  ___,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  ___, Raw ], // Raw    rawtext
/* 26 */ [ rcdata,          ___,  ___,  ___,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  ___,  Rcd,  Rcd,  Rcd,  Rcd,  ___,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  ___, Rcd ], // Rcd    rcdata
/* 27 */ [ attributeName,   Att,  ___,  ___,  Att,  Att,  Att,  ___,  Att,  Att,  Att,  ___,  Att,  Att,  Att,  Att,  ___,  ___,  Att,  Att,  Att,  Att,  ___, ___ ], // Att
/* 28 */ [ unquoted,        Val,  ___,  ___,  Val,  Val,  Val,  ___,  Val,  Val,  ___,  Val,  Val,  Val,  Val,  Val,  ___,  Val,  Val,  Val,  Val,  Val,  ___, ___ ], // Val
/* 29 */ [ quoted,          ___,  ___,  ___,  ValQ, ___,  ValQ, ValQ, ValQ, ValQ, ___,  ValQ, ValQ, ValQ, ValQ, ValQ,ValQ,  ValQ, ValQ, ValQ, ValQ, ValQ, ___, ___ ], // ValQ   double-quoted value
/* 30 */ [ squoted,         ___,  ___,  ___,  ValS, ValS, ___,  ValS, ValS, ValS, ___,  ValS, ValS, ValS, ValS, ValS,ValS,  ValS, ValS, ValS, ValS, ValS, ___, ___ ], // ValS   single-quoted value
/* 31 */ [ bogusData  ,     ___,  ___,  ___,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  ___,  Bog,  Bog,  Bog,  Bog,  Bog,  ___, ___ ], // Bog    bogus-comment-data
/* 32 */ [ commentData,     ___,  ___,  ___,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  ___,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  ___, ___ ], // Cmt:   comment-data
/* 33 */ [ commentData,     ___,  ___,  ___,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  DD,   Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  ___, ___ ], // CmtD:  after - in comment
/* 34 */ [ commentData,     ___,  ___,  ___,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  DX,   DD,   Cmt, Cmt_,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  ___, ___ ], // CmtSD: after - after <!--
/* 35 */ [ attributeSep,    ___,  Sep,  Sep,  ___,  ___,  ___,  Sep,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___, TagE,  Sep,  ___,  ___,  ___,  ___,  ___, ___ ], // Sep
/* 36 */ [ ampersand,       ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  AmpH, ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  Ref,  Ref,  Ref,  ___, ___ ], // Amp
/* 37 */ [ charRefLegacy,   ___,  ___,  ___,  ___,  ___,  ___,  ___,  nRef_,___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  Ref,  Ref,  Ref,  Ref,  ___, ___ ], // Ref
/* 38 */ [ charRefHex,      ___,  ___,  ___,  ___,  ___,  ___,  ___,  xRef_,___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  xRef, xRef, ___,  ___,  ___, ___ ], // xRef
/* 39 */ [ charRefDecimal,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  dRef_,___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  dRef, ___,  ___,  ___,  ___, ___ ], // dRef
/* 40 */ [ lt,              ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  LTx,  LTx,  ___,  ___,  ___,  LTs,  ___,  STN,  STN,  STN,  ___, ___ ], // LT:    after <
/* 41 */ [ bogusStart,      ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ETN,  ETN,  ETN,  ___, ___ ], // LTs:   after </
/* 42 */ [ bogusStart,      ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  LXD,  ___,  ___,  ___,  ___,  DTN,  DTN,  DTN,  ___, ___ ], // LTx:   after <!
/* 43 */ [ startTagStart,   STN,  ___,  ___,  STN,  STN,  STN,  ___,  STN,  STN,  STN,  STN,  STN,  STN,  STN,  STN,  ___,  ___,  STN,  STN,  STN,  STN,  ___, ___ ], // STN:   after <a
/* 44 */ [ endTagStart,     ETN,  ___,  ___,  ETN,  ETN,  ETN,  ___,  ETN,  ETN,  ETN,  ETN,  ETN,  ETN,  ETN,  ETN,  ___,  ___,  ETN,  ETN,  ETN,  ETN,  ___, ___ ], // ETN:   after </a
/* 45 */ [ mDeclStart,      DTN,  ___,  ___,  DTN,  DTN,  DTN,  ___,  DTN,  DTN,  DTN,  DTN,  DTN,  DTN,  DTN,  DTN,  ___,  ___,  DTN,  DTN,  DTN,  DTN,  ___, ___ ], // DTN:   after <!a
/* 46 */ [ rawtext,         ___,  ___,  ___,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  ___,  Raw,  RLTs, Raw,  Raw,  Raw,  Raw,  ___, ___ ], // RawLT: after <
/* 47 */ [ rcdata,          ___,  ___,  ___,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  ___,  Rcd,  RLTs, Rcd,  Rcd,  Rcd,  Rcd,  ___, ___ ], // RcdLT: after <
/* 48 */ [ commentStart,    ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___, ___ ], // LXDD:  after <!--
/* 49 */ [ tagEnd,          ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___, ___ ], // TagE:  after >
/* 50 */ [ bogusEnd,        ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___, ___ ], // Bog_:  after >
/* 51 */ [ commentEnd,      ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___, ___ ], // Cmt_:  
/* 52 */ [ attributeAssign, ___,  Eq ,  Eq ,  ___,  ___,  ___,  Eq ,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___, ___ ], // Eq:    after =
/* 53 */ [ valueStartQuot,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___, ___ ], // lQ_    after "
/* 54 */ [ valueStartApos,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___, ___ ], // Sq_    after '
/* 55 */ [ valueEnd,        ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___, ___ ], // rQ_    after ' or " (or space)
/* 56 */ [ charRefNamed,    ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___, ___ ], // nRef_  after eg. &amp;
/* 57 */ [ charRefDecimal,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___, ___ ], // dRef_  after eg. &#10;
/* 58 */ [ charRefHex,      ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___, ___ ], // xRef_  after eg. &#xAA;
/* 59 */ [ newline,         ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___, ___ ], // NL_    after CRLF or LF
/* 60 */ [ expressionOpen,  ___,  ___,  ___,  ___,  ___,  ___,  EXs,  ___,  EX_,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  EE_,  ___,  EX_,  EX_,  EX_,  Wrd, ___ ], // 
/* 61 */ [ expressionOpen,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___, ___ ], // 
/* 62 */ [ expressionName,  ___,  ___,  ___,  EN_,  EN_,  EN_,  EN_,  ___,  ___,  EN_,  EN_,  EN_,  EN_,  EN_,  EN_,  EN_,  ___,  EN_,  EN_,  EN_,  EN_,  ___, EC_ ], // 
/* 63 */ [ expressionClose, ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___, ___ ], // 
/* 64 */ [ expressionEnd,   ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  EE_,  ___,  EE_,  EE_,  EE_,  ___, EEs ], // 
/* 65 */ [ expressionEnd,   ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___, ___ ], // 
//                          nul   CR    LF    other  "     '    \s     ;     #     &     =     ?     !     -     <     >     /    0-9   A-F   G-WYZ  X     {    }  ;
]

export function getCellFromStateTable(row: number | undefined, col: number | undefined): number | undefined {
  if (row === undefined || col === undefined) {
    return undefined
  }
  const foundRow = table[row]
  if (foundRow === undefined) {
    return undefined
  }
  const foundCol = foundRow[col]
  if (foundCol === undefined) {
    return undefined
  }
  return foundCol
}

export function getTokenForState(state: number | undefined): number | undefined {
  return getCellFromStateTable(state, 0)
}
