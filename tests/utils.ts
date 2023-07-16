import * as path from 'node:path'
import * as fs from 'node:fs'
import * as fsAsync from 'node:fs/promises'

function __dirname(): string {
  if (process.platform === 'win32') {
    return path.dirname(import.meta.url).replace('file:///', '')
  }
  return path.dirname(import.meta.url).replace('file://', '')
}

export function __reportdir(): string {
  return path.join(__dirname(), 'reports')
}

export function loadCases(): [string, string, number][] {
  const __fixtures = path.join(__dirname(), 'fixtures')

  const cases: [string, string, number][] = []
  for (const caseDir of fs.readdirSync(__fixtures)) {
    cases.push([path.join(__fixtures, caseDir), caseDir, parseInt(caseDir, 10)])
  }
  return cases
}

export async function readFile(...filepathSegments: string[]) {
  return await fsAsync.readFile(path.join(...filepathSegments), 'utf8')
}

export async function writeFile(
  content: string,
  filepathSegments: string[]
): Promise<void> {
  const targetFile = path.join(...filepathSegments)
  if (!fs.existsSync(path.dirname(targetFile))) {
    fs.mkdirSync(path.dirname(targetFile), { recursive: true })
  }
  await fsAsync.writeFile(targetFile, content, 'utf8')
}

export async function readJson<T = unknown>(...filepathSegments: string[]): Promise<T> {
  return JSON.parse(await readFile(...filepathSegments))
}

export async function writeJson(
  json: any,
  filepathSegments: string[]
): Promise<void> {
  await writeFile(JSON.stringify(json, null, 2), filepathSegments)
}
