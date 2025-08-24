import type { Move } from '../../src/data.js'
import { prettify, slugify, TYPE_ALIASES } from './util.ts'

function toNum(tok: string): number {
  if (/^0x[0-9a-f]+$/i.test(tok)) return parseInt(tok, 16)
  return parseInt(tok, 10)
}

export function parseMoves(asm: string): Move[] {
  const lines = asm.split(/\r?\n/)

  const isCommentOrBlank = (s: string) => /^\s*(;|$)/.test(s)
  const stripComment = (s: string) => s.replace(/;.*/, '').trim()

  let inTable = false
  const rows: Move[] = []

  for (const raw of lines) {
    const line = stripComment(raw)
    if (!line || isCommentOrBlank(raw)) continue

    if (/^\s*Moves:\s*$/.test(line)) {
      inTable = true
      continue
    }
    if (!inTable) continue

    // End when we hit the assert (common pattern at end of table)
    if (/^\s*assert_table_length\b/i.test(line)) break
    // Skip table/meta directives
    if (/^\s*(table_width|move:\s*MACRO|ENDM|INCLUDE|SECTION)\b/i.test(line)) continue

    // Match lines like:
    // move POUND,        EFFECT_NORMAL_HIT,         40, NORMAL,       100, 35,   0
    const m = line.match(/^\s*move\s+(.+)$/i)
    if (!m) continue

    // Split the 7 arguments by commas (no parentheses here, so a simple split is safe)
    const parts = m[1]
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    if (parts.length !== 7) {
      // If a line wraps or has a trailing comma, you could buffer until you hit 7 args.
      // For now, ignore malformed lines.
      continue
    }

    const [constName, effect, basePowerStr, typeTok, accStr, ppStr, effChanceStr] = parts

    const name = prettify(constName.replace(/_M$/, ''))
    const slug = slugify(constName.replace(/_M$/, ''))

    const basePower = toNum(basePowerStr)
    const type = TYPE_ALIASES[typeTok] ?? typeTok
    const accuracy = toNum(accStr)
    const pp = toNum(ppStr)
    const effectChance = toNum(effChanceStr)

    rows.push({
      name,
      slug,
      effect,
      basePower,
      type,
      accuracy,
      pp,
      effectChance,
    })
  }

  return rows
}
