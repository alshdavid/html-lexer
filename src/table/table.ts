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
  DD, AmpH, Ref, nRef_, xRef_, dRef_, LTx, LTs, STN, LXD, DTN, RLTs
} = states

// prettier-ignore
const {
  plaintext, nulls, space, unquoted, newline, attributeSep, data, rawtext, rcdata,
  attributeName, quoted, squoted, bogusData, commentData, ampersand, charRefLegacy, 
  charRefHex, charRefDecimal, lt, bogusStart, startTagStart, endTagStart, mDeclStart,
  commentStart, tagEnd, bogusEnd, commentEnd, attributeAssign, valueStartQuot,
  valueStartApos, valueEnd, charRefNamed
} = tokens

const ___ = states.STOP

// prettier-ignore
const table = [
//                 nul   CR    LF    other  "     '    \s     ;     #     &     =     ?     !     -     <     >     /    0-9   A-F   G-WYZ  X   ;
[ 0,               ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___  ], // STOP
[ 0,               Nul,  CR,   NL_,  Wrd,  Wrd,  Wrd,  Wsp,  Wrd,  Wrd,  Amp,  Wrd,  Wrd,  Wrd,  Wrd,  LT,   Wrd,  Wrd,  Wrd,  Wrd,  Wrd,  Wrd  ], // Main
[ 0,               Nul,  CR,   NL_,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  Amp,  Rcd,  Rcd,  Rcd,  Rcd,  RcdLT,Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd  ], // RcData
[ 0,               Nul,  CR,   NL_,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  RawLT,Raw,  Raw,  Raw,  Raw,  Raw,  Raw  ], // RawText
[ 0, /*TODO CRLF*/ Att,  Sep,  Sep,  Att,  Att,  Att,  Sep,  Att,  Att,  Att,  Att,  Att,  Att,  Att,  Att,  TagE, Sep,  Att,  Att,  Att,  Att  ], // BeforeAttribute
[ 0, /*TODO CRLF*/ Att,  Tsp,  Tsp,  Att,  Att,  Att,  Tsp,  Att,  Att,  Att,  Eq,   Att,  Att,  Att,  Att,  TagE, Sep,  Att,  Att,  Att,  Att  ], // BeforeAssign
[ 0,               Nul,  CR,   NL_,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  CmtSD,Cmt,  Cmt_, Cmt,  Cmt,  Cmt,  Cmt,  Cmt  ], // BeforeCommentData
[ 0,               Nul,  CR,   NL_,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  CmtD, Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt  ], // InCommentData
[ 0,               Nul,  CR,   NL_,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog_, Bog,  Bog,  Bog,  Bog,  Bog  ], // Bogus
[ 0,               Nul,  CR,   NL_,  ValQ, rQ_,  ValQ, ValQ, ValQ, ValQ, Amp,  ValQ, ValQ, ValQ, ValQ, ValQ, ValQ, ValQ, ValQ, ValQ, ValQ, ValQ ], // ValueQuoted
[ 0,               Nul,  CR,   NL_,  ValS, ValS, rQ_,  ValS, ValS, ValS, Amp,  ValS, ValS, ValS, ValS, ValS, ValS, ValS, ValS, ValS, ValS, ValS ], // ValueAposed
[ 0, /*TODO CRLF*/ Val,  Sep,  Sep,  Val,  Val,  Val,  Sep,  Val,  Val,  Amp,  Val,  Val,  Val,  Val,  Val,  TagE, Val,  Val,  Val,  Val,  Val  ], // ValueUnquoted
[ 0,               ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ETN,  ETN,  ETN  ], // RLTs:  after </ in rcdata and rawtext
[ 0,               ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  LXDD, ___,  ___,  ___,  ___,  ___,  ___,  ___  ], // LXD:   after <!-
[ 0, /*TODO CRLF*/ Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  DX,   ___,  Cmt,  Cmt_, Cmt,  Cmt,  Cmt,  Cmt,  Cmt  ], // DD:    after --
[ 0, /*TODO CRLF*/ Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt_, Cmt,  Cmt,  Cmt,  Cmt,  Cmt  ], // DX:    after -!
[ 0,               ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  dRef, ___,  ___,  AmpX ], // AmpH:  after &#
[ 0,               ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  xRef, xRef, ___,  ___  ], // AmpX:  after &#x or &#X
[ plaintext,       TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP,  TOP  ], // TOP
[ nulls,           Nul,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___  ], // Nul    null bytes
[ space,           ___,  ___,  ___,  ___,  ___,  ___,  Wsp,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___  ], // Wsp    whitespace
[ unquoted,        Val,  ___,  ___,  Val,  lQ_,  Sq_,  ___,  Val,  Val,  Amp,  Val,  Val,  Val,  Val,  Val,  TagE, Val,  Val,  Val,  Val,  Val  ], // BeforeValue
[ newline,         ___,  ___,  NL_,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___  ], // CR     after CR
[ attributeSep,    ___,  Tsp,  Tsp,  ___,  ___,  ___,  Tsp,  ___,  ___,  ___,  Eq,   ___,  ___,  ___,  ___,  TagE, Sep,  ___,  ___,  ___,  ___  ], // Tsp    after space after attribute name
[ data,            ___,  ___,  ___,  Wrd,  Wrd,  Wrd,  ___,  Wrd,  Wrd,  ___,  Wrd,  Wrd,  Wrd,  Wrd,  ___,  Wrd,  Wrd,  Wrd,  Wrd,  Wrd,  Wrd  ], // Wrd    alphanumeric
[ rawtext,         ___,  ___,  ___,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  ___,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw  ], // Raw    rawtext
[ rcdata,          ___,  ___,  ___,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  ___,  Rcd,  Rcd,  Rcd,  Rcd,  ___,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd  ], // Rcd    rcdata
[ attributeName,   Att,  ___,  ___,  Att,  Att,  Att,  ___,  Att,  Att,  Att,  ___,  Att,  Att,  Att,  Att,  ___,  ___,  Att,  Att,  Att,  Att  ], // Att
[ unquoted,        Val,  ___,  ___,  Val,  Val,  Val,  ___,  Val,  Val,  ___,  Val,  Val,  Val,  Val,  Val,  ___,  Val,  Val,  Val,  Val,  Val  ], // Val
[ quoted,          ___,  ___,  ___,  ValQ, ___,  ValQ, ValQ, ValQ, ValQ, ___,  ValQ, ValQ, ValQ, ValQ, ValQ,ValQ,  ValQ, ValQ, ValQ, ValQ, ValQ ], // ValQ   double-quoted value
[ squoted,         ___,  ___,  ___,  ValS, ValS, ___,  ValS, ValS, ValS, ___,  ValS, ValS, ValS, ValS, ValS,ValS,  ValS, ValS, ValS, ValS, ValS ], // ValS   single-quoted value
[ bogusData  ,     ___,  ___,  ___,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  Bog,  ___,  Bog,  Bog,  Bog,  Bog,  Bog  ], // Bog    bogus-comment-data
[ commentData,     ___,  ___,  ___,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  ___,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt  ], // Cmt:   comment-data
[ commentData,     ___,  ___,  ___,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  DD,   Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt  ], // CmtD:  after - in comment
[ commentData,     ___,  ___,  ___,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt,  DX,   DD,   Cmt, Cmt_,  Cmt,  Cmt,  Cmt,  Cmt,  Cmt  ], // CmtSD: after - after <!--
[ attributeSep,    ___,  Sep,  Sep,  ___,  ___,  ___,  Sep,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___, TagE,  Sep,  ___,  ___,  ___,  ___  ], // Sep
[ ampersand,       ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  AmpH, ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  Ref,  Ref,  Ref  ], // Amp
[ charRefLegacy,   ___,  ___,  ___,  ___,  ___,  ___,  ___,  nRef_,___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  Ref,  Ref,  Ref,  Ref  ], // Ref
[ charRefHex,      ___,  ___,  ___,  ___,  ___,  ___,  ___,  xRef_,___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  xRef, xRef, ___,  ___  ], // xRef
[ charRefDecimal,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  dRef_,___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  dRef, ___,  ___,  ___  ], // dRef
[ lt,              ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  LTx,  LTx,  ___,  ___,  ___,  LTs,  ___,  STN,  STN,  STN  ], // LT:    after <
[ bogusStart,      ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ETN,  ETN,  ETN  ], // LTs:   after </
[ bogusStart,      ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  LXD,  ___,  ___,  ___,  ___,  DTN,  DTN,  DTN  ], // LTx:   after <!
[ startTagStart,   STN,  ___,  ___,  STN,  STN,  STN,  ___,  STN,  STN,  STN,  STN,  STN,  STN,  STN,  STN,  ___,  ___,  STN,  STN,  STN,  STN  ], // STN:   after <a
[ endTagStart,     ETN,  ___,  ___,  ETN,  ETN,  ETN,  ___,  ETN,  ETN,  ETN,  ETN,  ETN,  ETN,  ETN,  ETN,  ___,  ___,  ETN,  ETN,  ETN,  ETN  ], // ETN:   after </a
[ mDeclStart,      DTN,  ___,  ___,  DTN,  DTN,  DTN,  ___,  DTN,  DTN,  DTN,  DTN,  DTN,  DTN,  DTN,  DTN,  ___,  ___,  DTN,  DTN,  DTN,  DTN  ], // DTN:   after <!a
[ rawtext,         ___,  ___,  ___,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  Raw,  ___,  Raw,  RLTs, Raw,  Raw,  Raw,  Raw  ], // RawLT: after <
[ rcdata,          ___,  ___,  ___,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  Rcd,  ___,  Rcd,  RLTs, Rcd,  Rcd,  Rcd,  Rcd  ], // RcdLT: after <
[ commentStart,    ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___  ], // LXDD:  after <!--
[ tagEnd,          ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___  ], // TagE:  after >
[ bogusEnd,        ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___  ], // Bog_:  after >
[ commentEnd,      ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___  ], // Cmt_:  
[ attributeAssign, ___,  Eq ,  Eq ,  ___,  ___,  ___,  Eq ,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___  ], // Eq:    after =
[ valueStartQuot,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___  ], // lQ_    after "
[ valueStartApos,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___  ], // Sq_    after '
[ valueEnd,        ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___  ], // rQ_    after ' or " (or space)
[ charRefNamed,    ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___  ], // nRef_  after eg. &amp;
[ charRefDecimal,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___  ], // dRef_  after eg. &#10;
[ charRefHex,      ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___  ], // xRef_  after eg. &#xAA;
[ newline,         ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___,  ___  ], // NL_    after CRLF or LF
//                 nul   CR    LF    other  "     '    \s     ;     #     &     =     ?     !     -     <     >     /    0-9   A-F   G-WYZ  X   ;
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
