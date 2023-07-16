import { Main, RcData, RawText, TOP, BeforeAttribute, BeforeAssign, BeforeValue, BeforeCommentData, InCommentData, Bogus, ValueQuoted, ValueAposed, ValueUnquoted } from "./states";

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
}