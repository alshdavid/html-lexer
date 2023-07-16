import * as assert from 'node:assert'
import {
  __reportdir,
  readFile,
  readJson,
  loadCases,
  writeFile,
} from './utils.mjs'
import { tokenize } from '../lib/index.mjs'
import * as fs from 'node:fs'

const VERBOSE = process.argv.includes('--verbose')

const TEST_ONLY = process.env['TEST_ONLY']
  ? process.env['TEST_ONLY'].split(',').map((i) => parseInt(i, 10))
  : undefined

let failed = false
if (fs.existsSync(__reportdir())) {
  fs.rmSync(__reportdir(), { recursive: true })
}
fs.mkdirSync(__reportdir(), { recursive: true })

for (const [caseDir, caseName, caseNumber] of loadCases()) {
  if (caseDir.endsWith('.skip')) {
    console.log(`⚠️  ${caseNumber}`)
    continue
  }

  if (TEST_ONLY !== undefined && !TEST_ONLY.includes(caseNumber)) {
    console.log(`⚠️  ${caseNumber}`)
    continue
  }

  /** @type {import('../lib/index.mjs').LexerResults} */
  const expected = await readJson(caseDir, 'lexer.json')

  const html = await readFile(caseDir, 'index.html')

  const actual = tokenize(html)

  try {
    assert.deepEqual(
      actual,
      expected,
      [
        'Failed to generate tokens',
        'Expected:',
        ...format(expected),
        '',
        'Received:',
        ...format(actual),
      ].join('\n')
    )
  } catch (error) {
    if (VERBOSE) {
      console.error(error)
    }
    console.log(`❌ ${caseNumber}`)
    await writeFile([...format(expected)].join('\n'), [
      __reportdir(),
      caseName,
      'expects.txt',
    ])
    await writeFile([...format(actual)].join('\n'), [
      __reportdir(),
      caseName,
      'received.txt',
    ])
    failed = true
    continue
  }

  console.log(`✅ ${caseNumber}`)
}

if (failed) {
  process.exit(1)
}

/** @returns {string[]} */
function format(
  /** @type {import('../lib/index.mjs').LexerResults} */ result,
  /** @type {boolean} */ padStart = true
) {
  /** @type {string[]} */
  const results = []

  for (const [token, value] of result) {
    if (value === '\n') {
      results.push(
        `${padStart ? '  ' : ''}${token.padEnd(20)}: ${JSON.stringify(value)}`
      )
    } else {
      results.push(`${padStart ? '  ' : ''}${token.padEnd(20)}: "${value}"`)
    }
  }

  return results
}
