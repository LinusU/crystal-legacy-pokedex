import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function GlobalShortcuts() {
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // ignore if typing in a field or using modifiers
      const target = e.target as HTMLElement | null
      const tag = target?.tagName
      const editable = target?.isContentEditable
      if (e.altKey || e.ctrlKey || e.metaKey) return
      if (tag === 'INPUT' || tag === 'TEXTAREA' || editable) return

      const k = e.key.toLowerCase()
      if (k === 's' || k === 't') {
        e.preventDefault()
        navigate('/', { state: { focusSearch: true } })
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  return null
}
