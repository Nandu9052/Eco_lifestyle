import { Leaf } from 'lucide-react'

export function LoadingIndicator() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-7 h-7 rounded-full bg-green-900/50 border border-green-700/30 flex items-center justify-center shrink-0">
        <Leaf size={13} className="text-green-400" />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-slate-400">Eco Agent is thinking</span>
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-green-500 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </span>
      </div>
    </div>
  )
}
