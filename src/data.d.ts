export type BaseStats = {
  stats: { hp: number; atk: number; def: number; spe: number; spa: number; spd: number }
  types: [string, string]
  catchRate: number
  baseExp: number
  items: [string | null, string | null]
  genderRatio: string
  hatchCycles: number
  growthRate: string
  eggGroups: [string, string]
  tmhm: string[]
}

export type Evolution =
  | { method: 'level'; level: number; species: string }
  | { method: 'item'; item: string; species: string }
  | { method: 'trade'; heldItem: string | null; species: string }
  | {
      method: 'happiness'
      time: 'ANYTIME' | 'MORNDAY' | 'NITE'
      species: string
    }
  | {
      method: 'stat'
      level: number
      cmp: 'LT' | 'GT' | 'EQ'
      species: string
    }

export type LevelMove = { level: number; move: string }

export interface Move {
  name: string // from the first token (usually matches the move constant)
  slug: string // lowercased constant with underscores -> hyphens
  effect: string // e.g., "EFFECT_SLEEP" (keep as-is for now)
  basePower: number // integer
  type: string // e.g., "PSYCHIC" (normalized; see TYPE_ALIASES)
  accuracy: number // integer (%)
  pp: number // integer
  effectChance: number // integer (%)
}

interface Data {
  species: Record<
    string,
    { id: number; name: string; slug: string; evolutions: Evolution[]; levelUpMoves: LevelMove[] } & BaseStats
  >

  moves: Record<string, Move>
  tutors: Array<{ id: string; move: string }>
}

declare const data: Data

export default data
