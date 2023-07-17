import * as chars from './characters'

export const defaultClass = chars.other

// Characters - Equivalence Classes
// --------------------------------
const e = new Uint8Array(0x7f)

// Mapping
e[0x00] = chars.nul
e[0x01] = defaultClass
e[0x02] = defaultClass
e[0x03] = defaultClass
e[0x04] = defaultClass
e[0x05] = defaultClass
e[0x06] = defaultClass
e[0x07] = defaultClass
e[0x08] = defaultClass
e[0x09] = chars.space
e[0x0a] = chars.lf
e[0x0b] = defaultClass
e[0x0c] = defaultClass
e[0x0d] = chars.cr
e[0x0e] = defaultClass
e[0x0f] = defaultClass
e[0x10] = defaultClass
e[0x11] = defaultClass
e[0x12] = defaultClass
e[0x13] = defaultClass
e[0x14] = defaultClass
e[0x15] = defaultClass
e[0x16] = defaultClass
e[0x17] = defaultClass
e[0x18] = defaultClass
e[0x19] = defaultClass
e[0x1a] = defaultClass
e[0x1b] = defaultClass
e[0x1c] = defaultClass
e[0x1d] = defaultClass
e[0x1e] = defaultClass
e[0x1f] = defaultClass
e[0x20] = chars.space
e[0x21] = chars.excl
e[0x22] = chars.quot
e[0x23] = chars.hash
e[0x24] = defaultClass
e[0x25] = defaultClass
e[0x26] = chars.amp
e[0x27] = chars.squo
e[0x28] = defaultClass
e[0x29] = defaultClass
e[0x2a] = defaultClass
e[0x2b] = defaultClass
e[0x2c] = defaultClass
e[0x2d] = chars.dash
e[0x2e] = defaultClass
e[0x2f] = chars.slash
e[0x30] = chars.digit
e[0x31] = chars.digit
e[0x32] = chars.digit
e[0x33] = chars.digit
e[0x34] = chars.digit
e[0x35] = chars.digit
e[0x36] = chars.digit
e[0x37] = chars.digit
e[0x38] = chars.digit
e[0x39] = chars.digit
e[0x3a] = defaultClass
e[0x3b] = chars.term
e[0x3c] = chars.lt
e[0x3d] = chars.eq
e[0x3e] = chars.gt
e[0x3f] = chars.que
e[0x40] = defaultClass
e[0x41] = chars.A_F
e[0x42] = chars.A_F
e[0x43] = chars.A_F
e[0x44] = chars.A_F
e[0x45] = chars.A_F
e[0x46] = chars.A_F
e[0x47] = chars.G_WYZ
e[0x48] = chars.G_WYZ
e[0x49] = chars.G_WYZ
e[0x4a] = chars.G_WYZ
e[0x4b] = chars.G_WYZ
e[0x4c] = chars.G_WYZ
e[0x4d] = chars.G_WYZ
e[0x4e] = chars.G_WYZ
e[0x4f] = chars.G_WYZ
e[0x50] = chars.G_WYZ
e[0x51] = chars.G_WYZ
e[0x52] = chars.G_WYZ
e[0x53] = chars.G_WYZ
e[0x54] = chars.G_WYZ
e[0x55] = chars.G_WYZ
e[0x56] = chars.G_WYZ
e[0x57] = chars.G_WYZ
e[0x58] = chars.X
e[0x59] = chars.G_WYZ
e[0x5a] = chars.G_WYZ
e[0x5b] = defaultClass
e[0x5c] = defaultClass
e[0x5d] = defaultClass
e[0x5e] = defaultClass
e[0x5f] = defaultClass
e[0x60] = defaultClass
e[0x61] = chars.A_F
e[0x62] = chars.A_F
e[0x63] = chars.A_F
e[0x64] = chars.A_F
e[0x65] = chars.A_F
e[0x66] = chars.A_F
e[0x67] = chars.G_WYZ
e[0x68] = chars.G_WYZ
e[0x69] = chars.G_WYZ
e[0x6a] = chars.G_WYZ
e[0x6b] = chars.G_WYZ
e[0x6c] = chars.G_WYZ
e[0x6d] = chars.G_WYZ
e[0x6e] = chars.G_WYZ
e[0x6f] = chars.G_WYZ
e[0x70] = chars.G_WYZ
e[0x71] = chars.G_WYZ
e[0x72] = chars.G_WYZ
e[0x73] = chars.G_WYZ
e[0x74] = chars.G_WYZ
e[0x75] = chars.G_WYZ
e[0x76] = chars.G_WYZ
e[0x77] = chars.G_WYZ
e[0x78] = chars.X
e[0x79] = chars.G_WYZ
e[0x7a] = chars.G_WYZ
e[0x7b] = defaultClass
e[0x7c] = defaultClass
e[0x7d] = defaultClass
e[0x7e] = defaultClass
e[0x7f] = defaultClass

export function getCharFromCode(charCode: number): number {
  if (charCode > 0x7f) {
    return defaultClass
  }
  const found = e[charCode]
  if (found === undefined) {
    return 0
  }
  return found
}
