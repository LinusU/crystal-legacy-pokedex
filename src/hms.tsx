import { useState } from 'react'
import { Link } from 'react-router-dom'

import Type from './component/type.js'
import data from './data.js'

export default function HMsPage() {
  const [filters, setFilters] = useState({
    cut: false,
    fly: false,
    surf: false,
    strength: false,
    flash: false,
    whirlpool: false,
    waterfall: false,
  })

  const handleFilterChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { name, checked } = event.target
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }))
  }

  const filteredSpecies = Object.values(data.species).filter((species) => {
    return Object.entries(filters).every(([hm, isChecked]) => {
      if (!isChecked) return true
      return species.tmhm.includes(hm)
    })
  })

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 pt-6">
      <h1 className="text-4xl font-bold mb-8">HMs Page</h1>

      <div className="bg-white p-6 rounded shadow-md max-w-4xl">
        <div className="mb-4">
          <label className="mr-4">
            <input type="checkbox" name="cut" className="mr-2" checked={filters.cut} onChange={handleFilterChange} />{' '}
            Cut
          </label>
          <label className="mr-4">
            <input type="checkbox" name="fly" className="mr-2" checked={filters.fly} onChange={handleFilterChange} />{' '}
            Fly
          </label>
          <label className="mr-4">
            <input type="checkbox" name="surf" className="mr-2" checked={filters.surf} onChange={handleFilterChange} />{' '}
            Surf
          </label>
          <label className="mr-4">
            <input
              type="checkbox"
              name="strength"
              className="mr-2"
              checked={filters.strength}
              onChange={handleFilterChange}
            />{' '}
            Strength
          </label>
          <label className="mr-4">
            <input
              type="checkbox"
              name="flash"
              className="mr-2"
              checked={filters.flash}
              onChange={handleFilterChange}
            />{' '}
            Flash
          </label>
          <label className="mr-4">
            <input
              type="checkbox"
              name="whirlpool"
              className="mr-2"
              checked={filters.whirlpool}
              onChange={handleFilterChange}
            />{' '}
            Whirlpool
          </label>
          <label className="mr-4">
            <input
              type="checkbox"
              name="waterfall"
              className="mr-2"
              checked={filters.waterfall}
              onChange={handleFilterChange}
            />{' '}
            Waterfall
          </label>
        </div>

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
            {filteredSpecies.map((species) => (
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
