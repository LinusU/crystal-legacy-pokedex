export const TYPE_ALIASES: Record<string, string> = {
  CURSE_TYPE: 'CURSE',
  PSYCHIC_TYPE: 'PSYCHIC',
}

const prettyOverrides: Record<string, string> = {
  MR__MIME: 'Mr. Mime',
  FARFETCH_D: "Farfetch'd",
  HO_OH: 'Ho-Oh',
  PORYGON2: 'Porygon2',
  NIDORAN_F: 'Nidoran♀',
  NIDORAN_M: 'Nidoran♂',
}

export function prettify(sym: string): string {
  if (prettyOverrides[sym]) return prettyOverrides[sym]
  // generic fallback: underscores -> spaces, Title Case
  const name = sym.replace(/_/g, ' ').toLowerCase()
  return name.replace(/\b\w/g, (m) => m.toUpperCase())
}

export function slugify(sym: string): string {
  return sym.toLowerCase().replace(/_/g, '-')
}
