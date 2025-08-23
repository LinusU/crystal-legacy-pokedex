import { parseBaseStats } from './lib/parseBaseStats.ts'
import { parseEvosAttacks } from './lib/parseEvosAttacks.ts'
import { parseMoves } from './lib/parseMoves.ts'
import { parsePokemonConstants } from './lib/parsePokemonConstants.ts'

// @ts-ignore
const fs = await import('node:fs')

const base =
  'https://raw.githubusercontent.com/cRz-Shadows/Pokemon_Crystal_Legacy/dcaf1bd2875873ba7b00d3d348d565f472efe74d'

async function fetchData(url: string): Promise<string> {
  if (url.startsWith('file:///')) {
    return fs.readFileSync(url.replace('file://', ''), 'utf-8')
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
  }
  return await response.text()
}

const species = parsePokemonConstants(await fetchData(`${base}/constants/pokemon_constants.asm`))
const moves = parseMoves(await fetchData(`${base}/data/moves/moves.asm`))
const evosAttacks = parseEvosAttacks(await fetchData(`${base}/data/pokemon/evos_attacks.asm`), species)

const result = { species: {}, moves: {} }

for (const pokemon of species) {
  const baseStats = parseBaseStats(
    await fetchData(`${base}/data/pokemon/base_stats/${pokemon.slug.replaceAll('-', '_')}.asm`),
  )

  result.species[pokemon.slug] = {
    ...pokemon,
    ...baseStats,
    levelUpMoves: evosAttacks[pokemon.slug].levelUpMoves,
    evolutions: evosAttacks[pokemon.slug].evolutions,
  }
}

for (const move of moves) {
  result.moves[move.slug] = move
}

fs.writeFileSync('src/data.json', JSON.stringify(result, null, 2), 'utf-8')
