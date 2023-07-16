export const STOP = 0;

// Entry States
export const Main = 1;
export const RcData = 2;
export const RawText = 3;

export const BeforeAttribute = 4;
export const BeforeAssign = 5;

// BeforeValue
export const BeforeCommentData = 6;
export const InCommentData = 7;
export const Bogus = 8;

export const ValueQuoted = 9;
export const ValueAposed = 10;
export const ValueUnquoted = 11;

// Internal States
export const RLTs = 12;
export const LXD = 13;
export const DD = 14;
export const DX = 15;

export const AmpH = 16;
export const AmpX = 17;
export const TOP = 18;

export const Nul = 19;
export const Wsp = 20;
export const BeforeValue = 21;
export const CR = 22;
export const Tsp = 23;
export const Wrd = 24;
export const Raw = 25;
export const Rcd = 26;
export const Att = 27;

export const Val = 28;
export const ValQ = 29;
export const ValS = 30;

export const Bog = 31;
export const Cmt = 32;
export const CmtD = 33;
export const CmtSD = 34;
export const Sep = 35;

export const Amp = 36;
export const Ref = 37;
export const xRef = 38;
export const dRef = 39;

export const LT = 40;
export const LTs = 41;
export const LTx = 42;

export const STN = 43;
export const ETN = 44;
export const DTN = 45;

export const RawLT = 46;
export const RcdLT = 47;
export const LXDD = 48;

export const TagE = 49;
export const Bog_ = 50;
export const Cmt_ = 51;

export const Eq = 52;
export const lQ_ = 53;
export const Sq_ = 54;
export const rQ_ = 55;
export const nRef_ = 56;
export const dRef_ = 57;
export const xRef_ = 58;
export const NL_ = 59;

export const entryStates = {
  Main,
  RcData,
  RawText,
  PlainText: TOP,
  BeforeAttribute,
  BeforeAssign,
  BeforeValue,
  BeforeCommentData,
  InCommentData,
  Bogus,
  ValueQuoted,
  ValueAposed,
  ValueUnquoted,
};
