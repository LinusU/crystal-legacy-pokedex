import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Crystal Legacy Pokédex</h1>
      <p className="text-lg mb-4">Explore Pokémon, moves, and HM information from the Crystal Legacy game.</p>
      <div className="space-x-4">
        <Link to="/pokemon/bulbasaur" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          View Bulbasaur
        </Link>
        <Link to="/move/tackle" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          View Tackle Move
        </Link>
        <Link to="/hms" className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
          View HMs
        </Link>
      </div>
    </div>
  )
}
