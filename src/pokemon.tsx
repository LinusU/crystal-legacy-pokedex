import { Link, useParams } from 'react-router-dom'
import unreachable from 'ts-unreachable'
import Damage from './component/damage.js'
import Type from './component/type'
import data from './data.js'
import { effectDescription } from './util/effect.js'

export default function PokemonPage() {
  const { slug = '' } = useParams<{ slug: string }>()

  if (!(slug in data.species)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-8">Pokémon Not Found</h1>
        <p className="text-lg mb-4">The Pokémon you are looking for does not exist in the Crystal Legacy game.</p>
        <Link to="/" className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
          Back to Home
        </Link>
      </div>
    )
  }

  const species = data.species[slug]

  const previousSpecies = Object.values(data.species).find((s) => s.id === species.id - 1) ?? null
  const nextSpecies = Object.values(data.species).find((s) => s.id === species.id + 1) ?? null

  return (
    <div className="flex flex-col items-center bg-gray-100 pt-6">
      <div className="flex flex-col min-h-screen max-w-5xl">
        <h1 className="text-2xl sm:text-4xl font-bold mb-8 flex items-center justify-between px-2">
          {previousSpecies ? (
            <Link
              to={`/pokemon/${previousSpecies.slug}`}
              className="text-blue-500 hover:underline text-sm hidden sm:inline"
            >
              &larr; #{previousSpecies.id} {previousSpecies.name}
            </Link>
          ) : (
            <span></span>
          )}

          <div className="text-center grow">
            #{species.id} {species.name}
          </div>

          {nextSpecies ? (
            <Link
              to={`/pokemon/${nextSpecies.slug}`}
              className="text-blue-500 hover:underline text-sm hidden sm:inline"
            >
              #{nextSpecies.id} {nextSpecies.name} &rarr;
            </Link>
          ) : (
            <span></span>
          )}
        </h1>

        <div className="bg-white p-0 sm:p-6 rounded shadow-md max-w-5xl text-sm">
          <div className="flex flex-wrap gap-2 mb-4 justify-between max-w-lvw">
            <div className="p-2">
              <img
                src={`${import.meta.env.BASE_URL}sprites/${species.id}.gif`}
                alt={species.name}
                className="mb-6 w-30 h-30"
                style={{ imageRendering: 'pixelated', transform: 'scale(-1, 1)' }}
              />

              <div className="mb-4 flex gap-2">
                {[...new Set(species.types)].map((type) => (
                  <Type key={type} type={type} />
                ))}
              </div>
            </div>

            <table className="border-collapse border border-gray-300 grow" style={{ maxWidth: 420 }}>
              <tbody>
                {[
                  { name: 'HP', value: species.stats.hp },
                  { name: 'Attack', value: species.stats.atk },
                  { name: 'Defense', value: species.stats.def },
                  { name: 'Speed', value: species.stats.spe },
                  { name: 'Sp.\xa0Attack', value: species.stats.spa },
                  { name: 'Sp.\xa0Defense', value: species.stats.spd },
                ].map((stat) => (
                  <tr key={stat.name}>
                    <td style={{ width: 112 }} className="border border-gray-300 px-2 py-1">
                      {stat.name}
                    </td>
                    <td style={{ width: 52 }} className="border border-gray-300 px-2 py-1 text-right">
                      {stat.value}
                    </td>
                    <td
                      style={{ minWidth: 160, width: '100%', maxWidth: 256 }}
                      className="border border-gray-300 px-2 py-1"
                    >
                      <div className="w-full bg-gray-200 rounded">
                        <div
                          className="h-4 rounded"
                          style={{
                            width: `${(stat.value / 255) * 100}%`,
                            backgroundColor: `hsl(${(stat.value / 255) * 120}, 100%, 50%)`,
                          }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Level Up Moves</h2>
          <div className="mb-4 overflow-x-auto max-w-screen">
            <table className="table-auto border-collapse border border-gray-300 w-full">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-2 py-1">Level</th>
                  <th className="border border-gray-300 px-2 py-1">Move</th>
                  <th className="border border-gray-300 px-2 py-1">Type</th>
                  <th className="border border-gray-300 px-2 py-1">Power</th>
                  <th className="border border-gray-300 px-2 py-1">Accuracy</th>
                  <th className="border border-gray-300 px-2 py-1">PP</th>
                  <th className="border border-gray-300 px-2 py-1">Effect</th>
                </tr>
              </thead>
              <tbody>
                {species.levelUpMoves.map((move) => {
                  const moveData = data.moves[move.move]
                  return (
                    <tr key={`${move.level}-${move.move}`}>
                      <td className="border border-gray-300 px-2 py-1 text-right">{move.level}</td>
                      <td className="border border-gray-300 px-2 py-1">
                        <Link to={`/move/${move.move}`} className="text-blue-500 hover:underline">
                          {moveData.name}
                        </Link>
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-center">
                        <div className="flex items-center gap-1">
                          <Type type={moveData.type} />
                          <Damage move={moveData} />
                        </div>
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-right">
                        {moveData.basePower === 1 ? '*' : moveData.basePower || '—'}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-right">{moveData.accuracy || '—'}</td>
                      <td className="border border-gray-300 px-2 py-1 text-right">{moveData.pp}</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs">{effectDescription(moveData)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-semibold mb-4">TM/HM Moves</h2>
          <div className="mb-4 overflow-x-auto max-w-screen">
            <table className="table-auto border-collapse border border-gray-300 w-full">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-2 py-1">TM/HM</th>
                  <th className="border border-gray-300 px-2 py-1">Move</th>
                  <th className="border border-gray-300 px-2 py-1">Type</th>
                  <th className="border border-gray-300 px-2 py-1">Power</th>
                  <th className="border border-gray-300 px-2 py-1">Accuracy</th>
                  <th className="border border-gray-300 px-2 py-1">PP</th>
                  <th className="border border-gray-300 px-2 py-1">Effect</th>
                </tr>
              </thead>
              <tbody>
                {species.tmhm.map((move) => {
                  const moveData = data.moves[move]
                  const tutor = data.tutors.find((t) => t.move === move)

                  return (
                    <tr key={move}>
                      <td className="border border-gray-300 px-2 py-1 text-center">{tutor?.id || move}</td>
                      <td className="border border-gray-300 px-2 py-1">
                        <Link to={`/move/${move}`} className="text-blue-500 hover:underline">
                          {moveData.name}
                        </Link>
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-center">
                        <div className="flex items-center gap-1">
                          <Type type={moveData.type} />
                          <Damage move={moveData} />
                        </div>
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-right">
                        {moveData.basePower === 1 ? '*' : moveData.basePower || '—'}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-right">{moveData.accuracy || '—'}</td>
                      <td className="border border-gray-300 px-2 py-1 text-right">{moveData.pp}</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs">{effectDescription(moveData)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Evolutions</h2>
          {species.evolutions.length > 0 ? (
            <ul>
              {species.evolutions.map((evo) => {
                const evoSpecies = data.species[evo.species]

                switch (evo.method) {
                  case 'level':
                    return (
                      <li key={evo.species}>
                        Evolves to{' '}
                        <Link to={`/pokemon/${evoSpecies.slug}`} className="text-blue-500 hover:underline">
                          {evoSpecies.name}
                        </Link>{' '}
                        at level {evo.level}.
                      </li>
                    )
                  case 'item':
                    return (
                      <li key={evo.species}>
                        Evolves to{' '}
                        <Link to={`/pokemon/${evoSpecies.slug}`} className="text-blue-500 hover:underline">
                          {evoSpecies.name}
                        </Link>{' '}
                        using the item {evo.item}.
                      </li>
                    )
                  case 'trade':
                    return (
                      <li key={evo.species}>
                        Evolves to{' '}
                        <Link to={`/pokemon/${evoSpecies.slug}`} className="text-blue-500 hover:underline">
                          {evoSpecies.name}
                        </Link>{' '}
                        via trade
                        {evo.heldItem ? ` while holding ${evo.heldItem}` : ''}.
                      </li>
                    )
                  case 'happiness':
                    return (
                      <li key={evo.species}>
                        Evolves to{' '}
                        <Link to={`/pokemon/${evoSpecies.slug}`} className="text-blue-500 hover:underline">
                          {evoSpecies.name}
                        </Link>{' '}
                        with high happiness
                        {evo.time !== 'ANYTIME' ? ` during ${evo.time.toLowerCase()}` : ''}.
                      </li>
                    )
                  case 'stat':
                    return (
                      <li key={evo.species}>
                        Evolves to{' '}
                        <Link to={`/pokemon/${evoSpecies.slug}`} className="text-blue-500 hover:underline">
                          {evoSpecies.name}
                        </Link>{' '}
                        at level {evo.level} when a specific stat comparison is met:{' '}
                        {`stat ${evo.cmp === 'LT' ? '<' : evo.cmp === 'GT' ? '>' : '='} threshold`}.
                      </li>
                    )
                  default:
                    return unreachable(evo)
                }
              })}
            </ul>
          ) : (
            <p>This Pokémon does not evolve.</p>
          )}
        </div>
      </div>

      <Link to="/" className="m-4 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
        Back to Home
      </Link>
    </div>
  )
}
