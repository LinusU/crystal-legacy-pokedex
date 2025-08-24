const physicalTypes = new Set(['NORMAL', 'FIGHTING', 'FLYING', 'POISON', 'GROUND', 'ROCK', 'BUG'])

const Damage: React.FC<{ basePower: number; type: string }> = ({ basePower, type }) => {
  return (
    <span className="border border-gray-800 rounded-xs">
      {basePower === 0 ? (
        <img alt="status" src={`${import.meta.env.BASE_URL}status.png`} />
      ) : physicalTypes.has(type) ? (
        <img alt="physical" src={`${import.meta.env.BASE_URL}physical.png`} />
      ) : (
        <img alt="special" src={`${import.meta.env.BASE_URL}special.png`} />
      )}
    </span>
  )
}

export default Damage
