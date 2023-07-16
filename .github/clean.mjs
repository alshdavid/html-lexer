import * as path from 'node:path'
import * as fs from 'node:fs'

function __dirname() {
  if (process.platform === 'win32') {
    return path.dirname(import.meta.url).replace('file:///', '')
  }
  return path.dirname(import.meta.url).replace('file://', '')
}

const target = process.argv[2]
if (!target) {
  process.exit(0)
}

const abTarget = path.resolve(__dirname(), '..', target)

if (fs.existsSync(abTarget)) {
  fs.rmSync(abTarget, { recursive: true })
}
