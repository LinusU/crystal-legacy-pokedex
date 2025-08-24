import { slugify } from './util.ts'

export function parseTutors(asm: string): Array<{ id: string; move: string }> {
  const lines = asm.split(/\r?\n/)
  const strip = (s: string) => s.replace(/;.*/, '').trim()

  const result: { id: string; move: string }[] = []
  let tm = 1
  let hm = 1
  let mt = 1

  for (const raw of lines) {
    const s = strip(raw)
    if (!s) continue

    let m: RegExpMatchArray | null = null

    // Collect entries
    m = s.match(/^\s*add_tm\s+([A-Z0-9_]+)\b/i)
    if (m) {
      result.push({ id: `TM${String(tm).padStart(2, '0')}`, move: slugify(m[1].replace(/_M$/, '')) })
      tm += 1
    }

    m = s.match(/^\s*add_hm\s+([A-Z0-9_]+)\b/i)
    if (m) {
      result.push({ id: `HM${String(hm).padStart(2, '0')}`, move: slugify(m[1].replace(/_M$/, '')) })
      hm += 1
    }

    m = s.match(/^\s*add_mt\s+([A-Z0-9_]+)\b/i)
    if (m) {
      result.push({ id: `MT${String(mt).padStart(2, '0')}`, move: slugify(m[1].replace(/_M$/, '')) })
      mt += 1
    }
  }

  return result
}
