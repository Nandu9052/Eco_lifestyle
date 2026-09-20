import { INTENT_COLORS, INTENT_LABELS } from '../types'

interface IntentBadgeProps {
  intent: string
}

export function IntentBadge({ intent }: IntentBadgeProps) {
  const label = INTENT_LABELS[intent] ?? intent
  const color = INTENT_COLORS[intent] ?? 'bg-slate-900/50 text-slate-300 border-slate-700/40'
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium border rounded-full px-2.5 py-0.5 ${color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  )
}
