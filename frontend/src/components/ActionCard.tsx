import { CheckCircle2 } from 'lucide-react'
import type { ActionItem } from '../types'
import { DIFFICULTY_COLORS } from '../types'

interface ActionCardProps {
  action: ActionItem
  index?: number
  onDone?: () => void
  done?: boolean
}

export function ActionCard({ action, index, onDone, done }: ActionCardProps) {
  return (
    <div
      className={`bg-[#0a1a1e] border rounded-xl p-4 transition-all ${
        done
          ? 'border-green-600/40 opacity-70'
          : 'border-white/8 hover:border-green-700/40'
      }`}
    >
      <div className="flex items-start gap-3">
        {index !== undefined && (
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-900/60 text-green-300 text-xs flex items-center justify-center font-bold mt-0.5">
            {index + 1}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="text-sm font-semibold text-green-100">{action.title}</h4>
            {onDone && (
              <button
                onClick={onDone}
                className={`shrink-0 transition-colors ${
                  done ? 'text-green-400' : 'text-slate-600 hover:text-green-400'
                }`}
                title={done ? 'Completed' : 'Mark as done'}
              >
                <CheckCircle2 size={16} />
              </button>
            )}
          </div>
          <p className="text-sm text-slate-300 mb-2">{action.description}</p>
          <p className="text-xs text-slate-400 mb-2 italic">Why: {action.why}</p>
          <span
            className={`text-[10px] rounded-full px-2 py-0.5 font-medium ${
              DIFFICULTY_COLORS[action.difficulty] ?? 'bg-slate-800 text-slate-300'
            }`}
          >
            {action.difficulty}
          </span>
        </div>
      </div>
    </div>
  )
}
