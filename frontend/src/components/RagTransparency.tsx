import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { SourceCard } from './SourceCard'
import type { ChatResult } from '../types'

interface RagTransparencyProps {
  result: ChatResult
}

export function RagTransparency({ result }: RagTransparencyProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-white/8 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-400 hover:text-slate-200 hover:bg-white/4 transition-colors"
      >
        <span className="flex items-center gap-2">
          <span className="text-green-500">🔍</span>
          Why this answer? (RAG Transparency)
        </span>
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/8 pt-4">
          {/* Retrieved Topics */}
          <div>
            <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Retrieved Topics
            </h5>
            <div className="flex flex-wrap gap-2">
              {result.retrieved_topics.map((topic) => (
                <span
                  key={topic}
                  className="text-xs bg-green-900/30 text-green-300 border border-green-700/20 rounded-full px-2.5 py-0.5"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Confidence */}
          <div>
            <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Retrieval Confidence
            </h5>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    result.confidence === 'High'
                      ? 'bg-green-500 w-full'
                      : result.confidence === 'Medium'
                      ? 'bg-yellow-500 w-2/3'
                      : 'bg-red-500 w-1/3'
                  }`}
                />
              </div>
              <span className="text-xs text-slate-400">{result.confidence}</span>
            </div>
          </div>

          {/* Reason */}
          <div>
            <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Recommendation Reason
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              {result.reason_for_recommendation}
            </p>
          </div>

          {/* Sources */}
          {result.sources.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Retrieved Documents ({result.sources.length})
              </h5>
              <div className="space-y-2">
                {result.sources.map((source, i) => (
                  <SourceCard key={i} source={source} compact />
                ))}
              </div>
            </div>
          )}

          <p className="text-[10px] text-slate-600 border-t border-white/5 pt-3">
            This response was generated using RAG (Retrieval-Augmented Generation). The answer is grounded in retrieved
            knowledge base documents. Always verify important decisions with official sources.
          </p>
        </div>
      )}
    </div>
  )
}
