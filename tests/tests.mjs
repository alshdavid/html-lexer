import * as assert from 'node:assert';
import { readFile, readJson, loadCases } from './utils.mjs'
import { tokenize } from '../lib/index.mjs';

const VERBOSE = process.argv.includes('--verbose')

const TEST_ONLY = process.env['TEST_ONLY'] 
  ? process.env['TEST_ONLY'].split(',').map(i => parseInt(i, 10)) 
  : undefined

let failed = false

for (const [caseDir, _, caseNumber] of loadCases()) {
  if (caseDir.endsWith('.skip')) {
    console.log(`⚠️  ${caseNumber}`)
    continue
  }

  if (TEST_ONLY !== undefined && !TEST_ONLY.includes(caseNumber)) {
    console.log(`⚠️  ${caseNumber}`)
    continue
  }

  const html = await readFile(caseDir, 'index.html')
  const actual = tokenize(html)

  /** @type {import('../lib/index.mjs').LexerResults} */
  const expected = await readJson(caseDir, 'lexer.json')

  try {
    assert.deepEqual(actual, expected, [
      'Failed to generate tokens',
      'Expected:',
      ...format(expected),
      '',
      'Received:',
      ...format(actual),
    ].join('\n'))
  } catch (error) {
    if (VERBOSE) {
      console.error(error)
    }
    console.log(`❌ ${caseNumber}`)
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
  /** @type {import('../lib/index.mjs').LexerResults} */ result
) {
  /** @type {string[]} */
  const results = []

  for (const [token, value] of result) {
    if (value === '\n') {
      results.push(`  ${token.padEnd(20)}: ${JSON.stringify(value)}`)
    } else {
      results.push(`  ${token.padEnd(20)}: "${value}"`)
    }
  }

  return results
}
