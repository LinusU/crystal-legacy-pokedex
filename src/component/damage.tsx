import type { Move } from '../data'

const physicalTypes = new Set(['NORMAL', 'FIGHTING', 'FLYING', 'POISON', 'GROUND', 'ROCK', 'BUG'])
const nonStatusMoveEffects = new Set(['EFFECT_OHKO', 'EFFECT_BIDE'])

const Damage: React.FC<{ move: Move }> = ({ move }) => {
  return (
    <span className="border border-gray-800 rounded-xs" style={{ width: 41, height: 18 }}>
      {move.basePower === 0 && !nonStatusMoveEffects.has(move.effect) ? (
        <img alt="status" src={`${import.meta.env.BASE_URL}status.png`} />
      ) : physicalTypes.has(move.type) ? (
        <img alt="physical" src={`${import.meta.env.BASE_URL}physical.png`} />
      ) : (
        <img alt="special" src={`${import.meta.env.BASE_URL}special.png`} />
      )}
    </span>
  )
}

export default Damage
