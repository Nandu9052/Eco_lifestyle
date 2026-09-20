import { ExternalLink, ShieldCheck } from 'lucide-react'
import type { SourceItem } from '../types'

interface SourceCardProps {
  source: SourceItem
  compact?: boolean
}

export function SourceCard({ source, compact = false }: SourceCardProps) {
  return (
    <div className="bg-[#0a1a1e] border border-white/8 rounded-xl p-3.5 hover:border-green-600/40 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="inline-flex items-center gap-1 text-[10px] bg-green-900/40 text-green-300 border border-green-700/30 rounded-full px-2 py-0.5 font-medium">
            <ShieldCheck size={10} className="text-green-400" />
            Official Source
          </span>
          {source.target_group && (
            <span className="text-[10px] bg-blue-950/60 text-blue-300 border border-blue-700/30 rounded-full px-2 py-0.5 font-medium max-w-[140px] truncate">
              {source.target_group}
            </span>
          )}
        </div>

        <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">
          {source.title}
        </h4>

        <div className="mt-1 space-y-0.5">
          <p className="text-xs text-green-200/90 font-medium truncate">
            {source.source}
          </p>
          {source.organization && (
            <p className="text-xs text-slate-400 truncate">
              {source.organization}
            </p>
          )}
        </div>

        {!compact && source.summary && (
          <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
            {source.summary}
          </p>
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between gap-2">
        {(source.last_verified || source.date) && (
          <span className="text-[10px] text-slate-500">
            {source.last_verified ? `Verified: ${source.last_verified}` : `Date: ${source.date}`}
          </span>
        )}

        {source.source_url ? (
          <a
            href={source.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-400 hover:text-green-300 bg-green-950/40 hover:bg-green-900/50 border border-green-700/40 px-2.5 py-1 rounded-lg transition-colors ml-auto"
            title={`Visit ${source.title}`}
          >
            <span>View Official Website</span>
            <ExternalLink size={11} />
          </a>
        ) : (
          <span className="text-[10px] text-slate-500 italic ml-auto">Official Record</span>
        )}
      </div>
    </div>
  )
}

