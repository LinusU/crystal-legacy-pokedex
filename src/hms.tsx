import { Link } from 'react-router-dom'
import Type from './component/type.js'
import data from './data.js'

export default function HMsPage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 pt-6">
      <h1 className="text-4xl font-bold mb-8">HMs Page</h1>

      <div className="bg-white p-6 rounded shadow-md max-w-4xl">
        <table className="table-auto border-collapse border border-gray-400 w-full">
          <thead>
            <tr>
              <th className="border border-gray-400 px-4 py-2">Dex</th>
              <th className="border border-gray-400 px-4 py-2">Pokemon</th>
              <th className="border border-gray-400 px-4 py-2">Type</th>
              <th className="border border-gray-400 px-4 py-2">Cut</th>
              <th className="border border-gray-400 px-4 py-2">Fly</th>
              <th className="border border-gray-400 px-4 py-2">Surf</th>
              <th className="border border-gray-400 px-4 py-2">Strength</th>
              <th className="border border-gray-400 px-4 py-2">Flash</th>
              <th className="border border-gray-400 px-4 py-2">Whirlpool</th>
              <th className="border border-gray-400 px-4 py-2">Waterfall</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(data.species).map((species) => (
              <tr key={species.id} className="text-center">
                <td className="border border-gray-400 px-4 py-2 text-right">{species.id}</td>
                <td className="border border-gray-400 px-4 py-2 text-left">
                  <Link to={`/pokemon/${species.slug}`} className="text-blue-500 hover:underline">
                    {species.name}
                  </Link>
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {[...new Set(species.types)].map((type) => (
                    <Type key={type} type={type} />
                  ))}
                </td>
                <td className="border border-gray-400 px-4 py-2">{species.tmhm.includes('cut') ? '✔️' : ''}</td>
                <td className="border border-gray-400 px-4 py-2">{species.tmhm.includes('fly') ? '✔️' : ''}</td>
                <td className="border border-gray-400 px-4 py-2">{species.tmhm.includes('surf') ? '✔️' : ''}</td>
                <td className="border border-gray-400 px-4 py-2">{species.tmhm.includes('strength') ? '✔️' : ''}</td>
                <td className="border border-gray-400 px-4 py-2">{species.tmhm.includes('flash') ? '✔️' : ''}</td>
                <td className="border border-gray-400 px-4 py-2">{species.tmhm.includes('whirlpool') ? '✔️' : ''}</td>
                <td className="border border-gray-400 px-4 py-2">{species.tmhm.includes('waterfall') ? '✔️' : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Back to Home
      </Link>
    </div>
  )
}
