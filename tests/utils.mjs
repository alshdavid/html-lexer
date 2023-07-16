import * as path from 'node:path';
import * as fs from 'node:fs';
import * as fsAsync from 'node:fs/promises';

function __dirname() {
  if (process.platform === "win32") {
    return path.dirname(import.meta.url).replace('file:///', '')
  }
  return path.dirname(import.meta.url).replace('file://', '')
}

export function __reportdir() {
  return path.join(__dirname(), 'reports')
}

export function loadCases() {
  const __fixtures = path.join(__dirname(), 'fixtures')

  /** @type {[string, string, number][]} */
  const cases = []
  for (const caseDir of fs.readdirSync(__fixtures)) {
    cases.push([path.join(__fixtures, caseDir), caseDir, parseInt(caseDir, 10)])
  }
  return cases
}

export async function readFile(/** @type {string[]} */...filepathSegments) {
  return await fsAsync.readFile(path.join(...filepathSegments), 'utf8')
}

export async function writeFile(/** @type {string} */ content, /** @type {string[]} */ filepathSegments) {
  const targetFile = path.join(...filepathSegments)
  if (!fs.existsSync(path.dirname(targetFile))) {
    fs.mkdirSync(path.dirname(targetFile), { recursive: true })
  }
  await fsAsync.writeFile(targetFile, content, 'utf8')
}

export async function readJson(/** @type {string[]} */ ...filepathSegments) {
  return JSON.parse(await readFile(...filepathSegments))
}

export async function writeJson(/** @type {any} */ json, /** @type {string[]} */ filepathSegments) {
  await writeFile(JSON.stringify(json, null, 2), filepathSegments)
}
