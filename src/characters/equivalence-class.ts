import * as chars from './characters'

export const defaultClass = chars.other

// Characters - Equivalence Classes
// --------------------------------
export const eqClass = new Uint8Array(0x7f)

// Mapping
eqClass[0x00] = chars.nul
eqClass[0x01] = defaultClass
eqClass[0x02] = defaultClass
eqClass[0x03] = defaultClass
eqClass[0x04] = defaultClass
eqClass[0x05] = defaultClass
eqClass[0x06] = defaultClass
eqClass[0x07] = defaultClass
eqClass[0x08] = defaultClass
eqClass[0x09] = chars.space
eqClass[0x0a] = chars.lf
eqClass[0x0b] = defaultClass
eqClass[0x0c] = defaultClass
eqClass[0x0d] = chars.cr
eqClass[0x0e] = defaultClass
eqClass[0x0f] = defaultClass
eqClass[0x10] = defaultClass
eqClass[0x11] = defaultClass
eqClass[0x12] = defaultClass
eqClass[0x13] = defaultClass
eqClass[0x14] = defaultClass
eqClass[0x15] = defaultClass
eqClass[0x16] = defaultClass
eqClass[0x17] = defaultClass
eqClass[0x18] = defaultClass
eqClass[0x19] = defaultClass
eqClass[0x1a] = defaultClass
eqClass[0x1b] = defaultClass
eqClass[0x1c] = defaultClass
eqClass[0x1d] = defaultClass
eqClass[0x1e] = defaultClass
eqClass[0x1f] = defaultClass
eqClass[0x20] = chars.space
eqClass[0x21] = chars.excl
eqClass[0x22] = chars.quot
eqClass[0x23] = chars.hash
eqClass[0x24] = defaultClass
eqClass[0x25] = defaultClass
eqClass[0x26] = chars.amp
eqClass[0x27] = chars.squo
eqClass[0x28] = defaultClass
eqClass[0x29] = defaultClass
eqClass[0x2a] = defaultClass
eqClass[0x2b] = defaultClass
eqClass[0x2c] = defaultClass
eqClass[0x2d] = chars.dash
eqClass[0x2e] = defaultClass
eqClass[0x2f] = chars.slash
eqClass[0x30] = chars.digit
eqClass[0x31] = chars.digit
eqClass[0x32] = chars.digit
eqClass[0x33] = chars.digit
eqClass[0x34] = chars.digit
eqClass[0x35] = chars.digit
eqClass[0x36] = chars.digit
eqClass[0x37] = chars.digit
eqClass[0x38] = chars.digit
eqClass[0x39] = chars.digit
eqClass[0x3a] = defaultClass
eqClass[0x3b] = chars.term
eqClass[0x3c] = chars.lt
eqClass[0x3d] = chars.eq
eqClass[0x3e] = chars.gt
eqClass[0x3f] = chars.que
eqClass[0x40] = defaultClass
eqClass[0x41] = chars.A_F
eqClass[0x42] = chars.A_F
eqClass[0x43] = chars.A_F
eqClass[0x44] = chars.A_F
eqClass[0x45] = chars.A_F
eqClass[0x46] = chars.A_F
eqClass[0x47] = chars.G_WYZ
eqClass[0x48] = chars.G_WYZ
eqClass[0x49] = chars.G_WYZ
eqClass[0x4a] = chars.G_WYZ
eqClass[0x4b] = chars.G_WYZ
eqClass[0x4c] = chars.G_WYZ
eqClass[0x4d] = chars.G_WYZ
eqClass[0x4e] = chars.G_WYZ
eqClass[0x4f] = chars.G_WYZ
eqClass[0x50] = chars.G_WYZ
eqClass[0x51] = chars.G_WYZ
eqClass[0x52] = chars.G_WYZ
eqClass[0x53] = chars.G_WYZ
eqClass[0x54] = chars.G_WYZ
eqClass[0x55] = chars.G_WYZ
eqClass[0x56] = chars.G_WYZ
eqClass[0x57] = chars.G_WYZ
eqClass[0x58] = chars.X
eqClass[0x59] = chars.G_WYZ
eqClass[0x5a] = chars.G_WYZ
eqClass[0x5b] = defaultClass
eqClass[0x5c] = defaultClass
eqClass[0x5d] = defaultClass
eqClass[0x5e] = defaultClass
eqClass[0x5f] = defaultClass
eqClass[0x60] = defaultClass
eqClass[0x61] = chars.A_F
eqClass[0x62] = chars.A_F
eqClass[0x63] = chars.A_F
eqClass[0x64] = chars.A_F
eqClass[0x65] = chars.A_F
eqClass[0x66] = chars.A_F
eqClass[0x67] = chars.G_WYZ
eqClass[0x68] = chars.G_WYZ
eqClass[0x69] = chars.G_WYZ
eqClass[0x6a] = chars.G_WYZ
eqClass[0x6b] = chars.G_WYZ
eqClass[0x6c] = chars.G_WYZ
eqClass[0x6d] = chars.G_WYZ
eqClass[0x6e] = chars.G_WYZ
eqClass[0x6f] = chars.G_WYZ
eqClass[0x70] = chars.G_WYZ
eqClass[0x71] = chars.G_WYZ
eqClass[0x72] = chars.G_WYZ
eqClass[0x73] = chars.G_WYZ
eqClass[0x74] = chars.G_WYZ
eqClass[0x75] = chars.G_WYZ
eqClass[0x76] = chars.G_WYZ
eqClass[0x77] = chars.G_WYZ
eqClass[0x78] = chars.X
eqClass[0x79] = chars.G_WYZ
eqClass[0x7a] = chars.G_WYZ
eqClass[0x7b] = defaultClass
eqClass[0x7c] = defaultClass
eqClass[0x7d] = defaultClass
eqClass[0x7e] = defaultClass
eqClass[0x7f] = defaultClass

export function getCharFromCode(charCode: number): number {
  if (charCode > 0x7f) {
    return defaultClass
  }
  const found = eqClass[charCode]
  if (found === undefined) {
    return 0
  }
  return found
}
