import { Bot, CheckCircle2, Copy } from 'lucide-react'
import { useState } from 'react'
import { ActionCard } from './ActionCard'
import { IntentBadge } from './IntentBadge'
import { SourceCard } from './SourceCard'
import type { ChatMessage } from '../types'

interface ChatMessageProps {
  message: ChatMessage
}

export function ChatMessageBubble({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] bg-green-900/30 border border-green-700/30 rounded-2xl rounded-tr-sm px-4 py-3">
          <p className="text-sm text-green-100">{message.content}</p>
        </div>
      </div>
    )
  }

  const result = message.result

  return (
    <div className="flex gap-3 items-start">
      <div className="w-7 h-7 rounded-full bg-green-900/60 border border-green-700/40 flex items-center justify-center shrink-0 mt-1">
        <Bot size={13} className="text-green-400" />
      </div>

      <div className="flex-1 min-w-0 space-y-3">
        {/* Header */}
        {result && (
          <div className="flex items-center gap-2 flex-wrap">
            <IntentBadge intent={result.intent} />
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-green-900/30 text-green-300 border border-green-700/30 rounded-full px-2.5 py-0.5">
              <CheckCircle2 size={11} />
              Verified Grounded
            </span>
          </div>
        )}

        {/* Answer */}
        <div className="bg-[#0a1a1e] border border-white/8 rounded-xl rounded-tl-sm p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="answer-prose text-sm text-slate-200 leading-relaxed whitespace-pre-wrap flex-1">
              {message.content}
            </div>
            <button
              onClick={handleCopy}
              className="text-slate-600 hover:text-slate-400 transition-colors shrink-0"
              title="Copy response"
            >
              <Copy size={13} />
            </button>
          </div>
          {copied && <p className="text-[10px] text-green-400 mt-1">Copied!</p>}
        </div>

        {/* Actions */}
        {result && result.actions && result.actions.length > 0 && (
          <div>
            <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Practical Next Steps
            </h5>
            <div className="space-y-2">
              {result.actions.map((action, i) => (
                <ActionCard key={i} action={action} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Sources */}
        {result && result.sources && result.sources.length > 0 && (
          <div>
            <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Official & Verified Sources
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {result.sources.map((source, i) => (
                <SourceCard key={i} source={source} />
              ))}
            </div>
          </div>
        )}

        <p className="text-[10px] text-slate-600">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}

