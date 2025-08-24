export default function HMsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">HMs Page</h1>
      <p className="text-lg mb-4">
        This is where you can find information about different HMs from the Crystal Legacy game.
      </p>
      <a href="/crystal-legacy-pokedex/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Back to Home
      </a>
    </div>
  )
}
