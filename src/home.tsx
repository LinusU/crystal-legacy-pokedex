import Fuse from 'fuse.js'
import type React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import data from './data.js'

type Poke = { id: number; name: string; slug: string }
const ALL: Poke[] = [...Object.values(data.species)]

export default function Home() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const listRef = useRef<HTMLUListElement | null>(null)
  const [active, setActive] = useState(0) // keyboard focus index

  // Create Fuse index once
  const fuse = useMemo(() => {
    return new Fuse(ALL, {
      includeScore: true,
      threshold: 0.33, // good typo tolerance
      ignoreLocation: true,
      keys: [
        { name: 'name', weight: 0.7 },
        { name: 'slug', weight: 0.2 },
        { name: 'id', weight: 0.1 },
      ],
    })
  }, [])

  const results: Poke[] = useMemo(() => {
    const term = q.trim()
    if (!term) return ALL

    // If number -> prioritize exact ID
    if (/^\d{1,3}$/.test(term)) {
      const id = Number(term)
      const exact = ALL.find((p) => p.id === id)
      const fuzzy = fuse.search(term).map((r) => r.item)
      const merged = exact ? [exact, ...fuzzy.filter((p) => p.id !== id)] : fuzzy
      return merged
    }

    return fuse.search(term).map((r) => r.item)
  }, [q, fuse])

  // biome-ignore lint/correctness/useExhaustiveDependencies: want to reset index when `q` changes
  useEffect(() => setActive(0), [q])

  const open = (p: Poke | undefined) => {
    if (!p) return
    navigate(`/pokemon/${p.slug}`)
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, Math.max(0, results.length - 1)))
      // ensure into view
      requestAnimationFrame(() => listRef.current?.children[active + 1]?.scrollIntoView({ block: 'nearest' }))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
      requestAnimationFrame(() =>
        listRef.current?.children[Math.max(0, active - 1)]?.scrollIntoView({ block: 'nearest' }),
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      open(results[active] ?? results[0])
    } else if (e.key === 'Escape') {
      setQ('')
    }
  }

  return (
    <div className="mx-auto max-w-xl p-4">
      <h1 className="text-2xl font-bold mb-3">Crystal Legacy Pokédex</h1>

      <form
        className="sticky top-0 z-10"
        onSubmit={(e) => {
          e.preventDefault()
          open(results[active] ?? results[0])
        }}
      >
        <label className="block mb-2 text-sm font-medium" htmlFor="search">
          Search Pokémon
        </label>
        <input
          id="search"
          type="search"
          inputMode="search"
          autoComplete="off"
          placeholder="Try: bulba, ho-oh, 143, mr mime…"
          className="w-full rounded-xl border px-4 py-3 text-base outline-none focus:ring"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </form>

      <ul
        ref={listRef}
        className="mt-4 max-h-[60vh] overflow-auto rounded-xl border divide-y"
        aria-label="Search results"
      >
        {results.map((p, i) => (
          <li key={p.slug}>
            <button
              onClick={() => open(p)}
              className={`w-full flex items-center gap-3 px-3 py-3 text-left ${i === active ? 'bg-gray-100' : 'bg-white'}`}
              type="button"
            >
              <img
                src={`${import.meta.env.BASE_URL}sprites/${p.id}.png`}
                alt={p.name}
                width={48}
                height={48}
                loading="lazy"
                className={`shrink-0 p-1 bg-white border rounded ${i === active ? 'border-black' : 'border-transparent'}`}
                style={{ imageRendering: 'pixelated', transform: 'scale(-1, 1)' }}
              />

              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  #{String(p.id).padStart(3, '0')} {p.name}
                </div>
                <div className="text-xs text-gray-500 truncate">{p.slug}</div>
              </div>
              <span aria-hidden>↵</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-3 text-xs text-gray-600">
        <p>Tips: Type a number for Dex ID. Use arrow keys and Enter.</p>
      </div>

      <nav className="mt-6 flex gap-3 text-sm underline">
        <Link to="/hms">HM Compatibility</Link>
      </nav>
    </div>
  )
}
