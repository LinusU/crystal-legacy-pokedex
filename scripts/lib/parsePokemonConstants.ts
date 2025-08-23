import { prettify, slugify } from './util.ts'

export interface PokemonIndex {
  id: number
  name: string
  slug: string
}

export function parsePokemonConstants(pokemonConstants: string): PokemonIndex[] {
  const lines = pokemonConstants.split(/\r?\n/)

  let current = 0 // "const_value" (we'll keep it in sync)
  let inUnownBlock = false // after the "Unown forms" header

  const results: PokemonIndex[] = []

  // Helpers
  const stripInlineComment = (s: string) => s.replace(/;.*/, '').trim()
  const isBlankOrComment = (s: string) => /^(\s*;|\s*$)/.test(s)

  for (const rawLine of lines) {
    const line = stripInlineComment(rawLine)
    if (isBlankOrComment(line)) continue

    // Detect the start of the Unown block by its comment header line in the source.
    // Safer: flip the flag when we see "Unown forms" in a comment in the *raw* line.
    if (/^\s*;.*Unown forms/i.test(rawLine)) {
      inUnownBlock = true
      continue
    }

    // const_def X  -> sets current to X
    let m = line.match(/^\s*const_def\s+(\d+)/i)
    if (m) {
      current = parseInt(m[1], 10)
      continue
    }

    // const_skip -> increments without assigning a name
    if (/^\s*const_skip\b/i.test(line)) {
      current += 1
      continue
    }

    // const NAME -> assigns NAME, and increments
    m = line.match(/^\s*const\s+([A-Z0-9_]+)\b/i)
    if (m) {
      const sym = m[1]

      // Stop collecting once we pass 251 (the Gen 2 range)
      if (current > 251) continue

      // Ignore Unown block entries and EGG
      if (inUnownBlock) continue
      if (sym === 'EGG') continue
      if (sym.startsWith('UNOWN_')) continue

      results.push({ id: current, name: prettify(sym), slug: slugify(sym) })
      current += 1 // const increments
    }

    // Not a directive we care about; ignore (e.g., EQU lines)
  }

  return results
}
