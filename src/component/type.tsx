const Type: React.FC<{ type: string }> = ({ type }) => {
  const typeColors: { [key: string]: string } = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
    normal: '#A8A878',
  }

  const backgroundColor = typeColors[type.toLowerCase()] || '#A8A878'

  return (
    <span
      className="inline-block px-2 py-1 rounded-md font-bold capitalize text-white text-xs"
      style={{ backgroundColor }}
    >
      {type}
    </span>
  )
}

export default Type
