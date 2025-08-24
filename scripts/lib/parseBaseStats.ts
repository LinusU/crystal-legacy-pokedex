import type { BaseStats } from '../../src/data.d.ts'
import { slugify, TYPE_ALIASES } from './util.ts'

// helper to assert presence
function req<T>(v: T | undefined, what: string): T {
  if (v === undefined) throw new Error(`Missing ${what}`)
  return v
}

export function parseBaseStats(asm: string): BaseStats {
  const lines = asm.split(/\r?\n/)

  // utilities
  const strip = (s: string) => s.replace(/;.*/, '').trim()
  const tokens = (after: string, sep = ',') =>
    after
      .split(sep)
      .map((t) => t.trim())
      .filter(Boolean)
  const toNum = (t: string) => (/^0x[0-9a-f]+$/i.test(t) ? parseInt(t, 16) : parseInt(t, 10))
  const normType = (t: string) => TYPE_ALIASES[t] ?? t
  const itemOrNull = (t: string) => (t === 'NO_ITEM' ? null : t)

  // state we’ll fill
  let speciesConst = ''

  let stats: BaseStats['stats'] | undefined
  let types: [string, string] | undefined
  let catchRate: number | undefined
  let baseExp: number | undefined
  let items: [string | null, string | null] | undefined
  let genderRatio: string | undefined
  let unknown1: number | undefined
  let hatchCycles: number | undefined
  let unknown2: number | undefined
  let growthRate: string | undefined
  let eggGroups: [string, string] | undefined

  const tmhm: string[] = []

  // pass 1: scan line-by-line
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]
    const s = strip(raw)
    if (!s) continue

    // 1) db SPECIES ; dex
    if (!speciesConst) {
      const m = s.match(/^db\s+([A-Z0-9_]+)\b/i)
      if (m) {
        speciesConst = m[1].toUpperCase()
        continue
      }
    }

    // 2) stats: db  25,  20,  15,  90, 105,  55
    if (!stats && /^db\s+/.test(s)) {
      const arr = tokens(s.replace(/^db\s+/i, ''))
      if (arr.length === 6 && arr.every((x) => /^0x[0-9a-f]+$|^\d+$/i.test(x))) {
        const [hp, atk, def, spe, spa, spd] = arr.map(toNum)
        stats = { hp, atk, def, spe, spa, spd }
        continue
      }
    }

    // 3) types: db X, Y ; type
    if (!types && /^db\s+.+,\s*.+\s*$/i.test(s)) {
      const arr = tokens(s.replace(/^db\s+/i, ''))
      if (arr.length === 2 && arr.every((x) => /^[A-Z0-9_]+$/.test(x))) {
        types = [normType(arr[0].toUpperCase()), normType(arr[1].toUpperCase())] as [string, string]
        continue
      }
    }

    // 4) catch rate: db N
    if (catchRate === undefined && /^db\s+\S+/i.test(s)) {
      const v = s.replace(/^db\s+/i, '').trim()
      if (/^\d+|^0x[0-9a-f]+$/i.test(v)) {
        catchRate = toNum(v)
        continue
      }
    }

    // 5) base exp: db N
    if (baseExp === undefined && /^db\s+\S+/i.test(s)) {
      const v = s.replace(/^db\s+/i, '').trim()
      if (/^\d+|^0x[0-9a-f]+$/i.test(v)) {
        baseExp = toNum(v)
        continue
      }
    }

    // 6) items: db ITEM1, ITEM2
    if (!items && /^db\s+.+,\s*.+/i.test(s)) {
      const arr = tokens(s.replace(/^db\s+/i, ''))
      if (arr.length === 2 && arr.every((x) => /^[A-Z0-9_]+$/.test(x))) {
        items = [itemOrNull(arr[0]), itemOrNull(arr[1])] as [string | null, string | null]
        continue
      }
    }

    // 7) gender ratio: db GENDER_*
    if (!genderRatio && /^db\s+[A-Z0-9_]+$/i.test(s)) {
      const tok = s
        .replace(/^db\s+/i, '')
        .trim()
        .toUpperCase()
      if (/^GENDER_/.test(tok)) {
        genderRatio = tok
        continue
      }
    }

    // 8) unknown1: db N
    if (unknown1 === undefined && /^db\s+\S+/.test(s)) {
      const v = s.replace(/^db\s+/i, '').trim()
      if (/^\d+|^0x[0-9a-f]+$/i.test(v)) {
        unknown1 = toNum(v)
        continue
      }
    }

    // 9) hatchCycles: db N
    if (hatchCycles === undefined && /^db\s+\S+/.test(s)) {
      const v = s.replace(/^db\s+/i, '').trim()
      if (/^\d+|^0x[0-9a-f]+$/i.test(v)) {
        hatchCycles = toNum(v)
        continue
      }
    }

    // 10) unknown2: db N
    if (unknown2 === undefined && /^db\s+\S+/.test(s)) {
      const v = s.replace(/^db\s+/i, '').trim()
      if (/^\d+|^0x[0-9a-f]+$/i.test(v)) {
        unknown2 = toNum(v)
        continue
      }
    }

    // Skip graphics/incbin and unused words
    if (/^(incbin|dw)\b/i.test(s)) continue

    // 11) growth rate: db GROWTH_*
    if (!growthRate && /^db\s+[A-Z0-9_]+$/i.test(s)) {
      const tok = s
        .replace(/^db\s+/i, '')
        .trim()
        .toUpperCase()
      if (/^GROWTH_/.test(tok)) {
        growthRate = tok
        continue
      }
    }

    // 12) egg groups: dn EGG_*, EGG_*
    if (!eggGroups && /^dn\s+.+/i.test(s)) {
      const arr = tokens(s.replace(/^dn\s+/i, ''))
      if (arr.length === 2 && arr.every((x) => /^[A-Z0-9_]+$/.test(x))) {
        eggGroups = [arr[0], arr[1]] as [string, string]
        continue
      }
    }

    // 13) tm/hm learnset: starts with "tmhm " and may span to "; end"
    if (/^tmhm\s/i.test(s)) {
      // collect tokens on this and subsequent lines until we see "; end"
      let collected = s.replace(/^tmhm\s+/i, '')
      // include raw line comment to detect '; end'
      let j = i
      let done = /;\s*end/i.test(lines[j])
      while (!done && j + 1 < lines.length) {
        j++
        const ln = lines[j]
        collected += ` ${strip(ln)}`
        if (/;\s*end/i.test(ln)) {
          done = true
        }
      }
      i = j // advance

      // remove anything after ; (comments)
      collected = collected.replace(/;.*/, '').trim()
      if (collected) {
        const list = tokens(collected).map((x) => x.replace(/\s+/g, ''))
        for (const m of list) {
          if (m) tmhm.push(slugify(m.replace(/_M$/, '')))
        }
      }
    }

    // ignore others
  }

  const result: BaseStats = {
    stats: req(stats, 'stats'),
    types: req(types, 'types'),
    catchRate: req(catchRate, 'catchRate'),
    baseExp: req(baseExp, 'baseExp'),
    items: req(items, 'items'),
    genderRatio: req(genderRatio, 'genderRatio'),
    hatchCycles: req(hatchCycles, 'hatchCycles'),
    growthRate: req(growthRate, 'growthRate'),
    eggGroups: req(eggGroups, 'eggGroups'),
    tmhm,
  }

  return result
}
