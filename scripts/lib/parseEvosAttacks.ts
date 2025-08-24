import type { Evolution, LevelMove } from '../../src/data.d.ts'
import type { PokemonIndex } from './parsePokemonConstants.ts'
import { slugify } from './util.ts'

export type EvosAttacksEntry = {
  evolutions: Evolution[]
  levelUpMoves: LevelMove[]
}

export type EvosAttacksMap = Record<string, EvosAttacksEntry>

function stripComment(s: string) {
  return s.replace(/;.*/, '').trim()
}

function isDbZero(s: string) {
  // matches: db 0   (allow extra spaces)
  return /^\s*db\s+0\b/i.test(s)
}

function tokenizeDb(s: string): string[] | null {
  // matches: db A, B, C (A/B/C can be identifiers or numbers)
  const m = s.match(/^\s*db\s+(.+)$/i)
  if (!m) return null
  return m[1]
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

function parseEvolution(s: string): Evolution | null {
  const toks = tokenizeDb(s)
  if (!toks) return null
  // EVOLVE_* patterns
  if (toks[0] === 'EVOLVE_LEVEL' && toks.length === 3) {
    const level = num(toks[1])
    const species = toks[2].toLowerCase()
    return { method: 'level', level, species }
  }
  if (toks[0] === 'EVOLVE_ITEM' && toks.length === 3) {
    const item = toks[1] // keep as CONST string; you can map later if needed
    const species = toks[2].toLowerCase()
    return { method: 'item', item, species }
  }
  if (toks[0] === 'EVOLVE_TRADE' && toks.length === 3) {
    const held = toks[1] // could be -1 for none
    const heldItem = held === '-1' ? null : held
    const species = toks[2].toLowerCase()
    return { method: 'trade', heldItem, species }
  }
  if (toks[0] === 'EVOLVE_HAPPINESS' && toks.length === 3) {
    const time = toks[1] as 'ANYTIME' | 'MORNDAY' | 'NITE'
    const species = toks[2].toLowerCase()
    return { method: 'happiness', time, species }
  }
  if (toks[0] === 'EVOLVE_STAT' && toks.length === 4) {
    const level = num(toks[1])
    const cmpTok = toks[2] // ATK_*_DEF where * is LT|GT|EQ
    const cmp = (cmpTok.match(/ATK_(LT|GT|EQ)_DEF/)?.[1] ?? 'EQ') as 'LT' | 'GT' | 'EQ'
    const species = toks[3].toLowerCase()
    return { method: 'stat', level, cmp, species }
  }
  throw new Error(`Unrecognized evolution format: "${s}"`)
}

function parseLevelMove(s: string): LevelMove | null {
  const toks = tokenizeDb(s)
  if (!toks) throw new Error(`Unrecognized level move line (not db): "${s}"`)
  if (toks.length === 2 && isNumberLike(toks[0])) {
    const level = num(toks[0])
    const move = slugify(toks[1])
    return { level, move }
  }
  throw new Error(`Unrecognized level move format: "${s}"`)
}

function isNumberLike(t: string) {
  return /^-?\d+$/i.test(t) || /^0x[0-9a-f]+$/i.test(t)
}
function num(t: string) {
  return /^0x/i.test(t) ? parseInt(t, 16) : parseInt(t, 10)
}

function matchLabel(s: string): string | null {
  // e.g., "BulbasaurEvosAttacks:" or "HoOhEvosAttacks:"
  const m = s.match(/^\s*([A-Za-z0-9_]+)EvosAttacks:\s*$/)
  return m ? m[1] : null
}

export function parseEvosAttacks(asm: string, speciesData: PokemonIndex[]): EvosAttacksMap {
  const lines = asm.split(/\r?\n/)
  const out: EvosAttacksMap = {}

  let i = 0
  while (i < lines.length) {
    const raw = lines[i++]

    // Find a label like "BulbasaurEvosAttacks:" or "HoOhEvosAttacks:"
    const label = matchLabel(raw)
    if (!label) continue

    const species = speciesData.filter(
      (p) => p.slug.replace(/[^A-Za-z0-9]/g, '') === label.toLowerCase().replace(/[^A-Za-z0-9]/g, ''),
    )

    if (species.length !== 1) {
      throw new Error(`Could not uniquely identify species for label "${label}"`)
    }

    const evolutions: Evolution[] = []
    const levelUpMoves: LevelMove[] = []

    // Phase 1: evolutions, until "db 0"
    while (i < lines.length) {
      const lr = stripComment(lines[i])
      if (lr === '') {
        i++
        continue
      }
      if (isDbZero(lr)) {
        i++ // consume the 0 terminator
        break
      }
      const ev = parseEvolution(lr)
      if (ev) evolutions.push(ev)
      i++
    }

    // Phase 2: moves, until "db 0"
    while (i < lines.length) {
      const lr = stripComment(lines[i])
      if (lr === '') {
        i++
        continue
      }
      if (isDbZero(lr)) {
        i++ // consume the 0 terminator
        break
      }
      const mv = parseLevelMove(lr)
      if (mv) levelUpMoves.push(mv)
      i++
    }

    out[species[0].slug] = { evolutions, levelUpMoves }
  }

  return out
}
