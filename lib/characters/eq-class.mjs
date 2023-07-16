import * as chars from '../characters/index.mjs'

export const defaultClass = chars.other

// Characters - Equivalence Classes
// --------------------------------

/** @returns {number} */
const eqClassFn = (/** @type {number} */ c) =>
  0x00 === c
    ? chars.nul
    : 0x0d === c
    ? chars.cr
    : 0x0a === c
    ? chars.lf
    : 0x09 === c
    ? chars.space
    : 0x20 === c
    ? chars.space
    : 0x21 === c
    ? chars.excl
    : 0x22 === c
    ? chars.quot
    : 0x23 === c
    ? chars.hash
    : 0x26 === c
    ? chars.amp
    : 0x27 === c
    ? chars.squo
    : 0x2d === c
    ? chars.dash
    : 0x2f === c
    ? chars.slash
    : 0x30 <= c && c <= 0x39
    ? chars.digit
    : 0x3b === c
    ? chars.term
    : 0x3c === c
    ? chars.lt
    : 0x3d === c
    ? chars.eq
    : 0x3e === c
    ? chars.gt
    : 0x3f === c
    ? chars.que
    : 0x41 <= c && c <= 0x46
    ? chars.A_F
    : 0x58 === c
    ? chars.X
    : 0x78 === c
    ? chars.X
    : 0x47 <= c && c <= 0x5a
    ? chars.G_WYZ
    : 0x61 <= c && c <= 0x66
    ? chars.A_F
    : 0x66 <= c && c <= 0x7a
    ? chars.G_WYZ
    : defaultClass

// Precompute a lookup table
export const eqClass = new Uint8Array(0x7f)

for (let i = 0, l = 0x7f; i <= l; i++) {
  eqClass[i] = eqClassFn(i)
}
