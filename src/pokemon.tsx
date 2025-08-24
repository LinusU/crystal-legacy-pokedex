import { useParams } from 'react-router-dom'
import Type from './component/type'
import data, { type Evolution } from './data.js'

export default function PokemonPage() {
  const { slug = '' } = useParams<{ slug: string }>()

  if (!(slug in data.species)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-8">Pokémon Not Found</h1>
        <p className="text-lg mb-4">The Pokémon you are looking for does not exist in the Crystal Legacy game.</p>
        <a href="/crystal-legacy-pokedex/" className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
          Back to Home
        </a>
      </div>
    )
  }

  const species = data.species[slug]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">
        #{species.id} {species.name}
      </h1>

      <div className="bg-white p-6 rounded shadow-md w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 mb-4">
          <div className="p-4 rounded">
            <img
              src={`${import.meta.env.BASE_URL}sprites/${species.id}.gif`}
              alt={species.name}
              className="mb-4 w-24 h-24"
              style={{ imageRendering: 'pixelated', transform: 'scale(-1, 1)' }}
            />

            <div className="mb-4 flex gap-2">
              {[...new Set(species.types)].map((type) => (
                <Type key={type} type={type} />
              ))}
            </div>
          </div>

          <div className="p-4 rounded">
            <table className="table-auto border-collapse border border-gray-300 w-full">
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
                    <td className="border border-gray-300 px-2 py-1">{stat.name}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">{stat.value}</td>
                    <td className="border border-gray-300 px-2 py-1 w-full">
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
        </div>

        <h2 className="text-2xl font-semibold mb-4">Level Up Moves</h2>
        <div className="mb-4">
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr>
                <th className="border border-gray-300 px-2 py-1">Level</th>
                <th className="border border-gray-300 px-2 py-1">Move</th>
                <th className="border border-gray-300 px-2 py-1">Type</th>
                <th className="border border-gray-300 px-2 py-1">Power</th>
                <th className="border border-gray-300 px-2 py-1">Accuracy</th>
                <th className="border border-gray-300 px-2 py-1">PP</th>
              </tr>
            </thead>
            <tbody>
              {species.levelUpMoves.map((move) => {
                const moveData = data.moves[move.move]
                return (
                  <tr key={`${move.level}-${move.move}`}>
                    <td className="border border-gray-300 px-2 py-1 text-right">{move.level}</td>
                    <td className="border border-gray-300 px-2 py-1">
                      <a
                        href={`${import.meta.env.BASE_URL}move/${move.move}`}
                        className="text-blue-500 hover:underline"
                      >
                        {moveData.name}
                      </a>
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      <Type type={moveData.type} />
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right">{moveData.basePower || '—'}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">{moveData.accuracy || '—'}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">{moveData.pp}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Evolutions</h2>
        {species.evolutions.length > 0 ? (
          <ul>
            {species.evolutions.map((_evo) => {
              const evo = _evo as unknown as Evolution
              const evoSpecies = data.species[evo.species as keyof typeof data.species]

              switch (evo.method) {
                case 'level':
                  return (
                    <li key={evo.species}>
                      Evolves to{' '}
                      <a
                        href={`${import.meta.env.BASE_URL}pokemon/${evoSpecies.slug}`}
                        className="text-blue-500 hover:underline"
                      >
                        {evoSpecies.name}
                      </a>{' '}
                      at level {evo.level}.
                    </li>
                  )
                case 'item':
                  return (
                    <li key={evo.species}>
                      Evolves to{' '}
                      <a
                        href={`${import.meta.env.BASE_URL}pokemon/${evoSpecies.slug}`}
                        className="text-blue-500 hover:underline"
                      >
                        {evoSpecies.name}
                      </a>{' '}
                      using the item {evo.item}.
                    </li>
                  )
                case 'trade':
                  return (
                    <li key={evo.species}>
                      Evolves to{' '}
                      <a
                        href={`${import.meta.env.BASE_URL}pokemon/${evoSpecies.slug}`}
                        className="text-blue-500 hover:underline"
                      >
                        {evoSpecies.name}
                      </a>{' '}
                      via trade
                      {evo.heldItem ? ` while holding ${evo.heldItem}` : ''}.
                    </li>
                  )
                case 'happiness':
                  return (
                    <li key={evo.species}>
                      Evolves to{' '}
                      <a
                        href={`${import.meta.env.BASE_URL}pokemon/${evoSpecies.slug}`}
                        className="text-blue-500 hover:underline"
                      >
                        {evoSpecies.name}
                      </a>{' '}
                      with high happiness
                      {evo.time !== 'ANYTIME' ? ` during ${evo.time.toLowerCase()}` : ''}.
                    </li>
                  )
                case 'stat':
                  return (
                    <li key={evo.species}>
                      Evolves to{' '}
                      <a
                        href={`${import.meta.env.BASE_URL}pokemon/${evoSpecies.slug}`}
                        className="text-blue-500 hover:underline"
                      >
                        {evoSpecies.name}
                      </a>{' '}
                      at level {evo.level} when a specific stat comparison is met:{' '}
                      {`stat ${evo.cmp === 'LT' ? '<' : evo.cmp === 'GT' ? '>' : '='} threshold`}.
                    </li>
                  )
              }
            })}
          </ul>
        ) : (
          <p>This Pokémon does not evolve.</p>
        )}
      </div>

      <a href="/crystal-legacy-pokedex/" className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
        Back to Home
      </a>
    </div>
  )
}
