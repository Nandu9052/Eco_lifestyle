import { Send, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ChatMessageBubble } from '../components/ChatMessageBubble'
import { LoadingIndicator } from '../components/LoadingIndicator'
import { SuggestedQuestions } from '../components/SuggestedQuestions'
import { useChat } from '../hooks/useChat'
import { useProfile } from '../hooks/useProfile'

const SUGGESTED = [
  'How can I reduce plastic use at home?',
  'How can I save electricity at home?',
  'What should I do with an old phone?',
  'How do I dispose of batteries?',
  'What eco-friendly travel options are there?',
  'What government schemes support solar energy?',
  'How can I reduce food waste?',
  'How do I choose an energy-efficient appliance?',
]

export default function ChatPage() {
  const { messages, loading, error, sendMessage, clearMessages } = useChat()
  const { profile } = useProfile()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async () => {
    const msg = input.trim()
    if (!msg || loading) return
    setInput('')
    await sendMessage(msg, profile.location || undefined)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  const handleSuggest = (q: string) => {
    setInput(q)
    textareaRef.current?.focus()
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Eco Agent Chat</h2>
          <p className="text-xs text-slate-500">RAG-powered · Source-transparent · Grounded guidance</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors"
          >
            <Trash2 size={12} />
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-1 pb-4">
        {messages.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-green-900/30 border border-green-700/30 flex items-center justify-center text-3xl mx-auto mb-4">
              🌱
            </div>
            <h3 className="text-base font-semibold text-white mb-2">
              Ask me anything about sustainability
            </h3>
            <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
              I retrieve information from a curated knowledge base and generate grounded, source-backed guidance.
            </p>
            <SuggestedQuestions questions={SUGGESTED} onSelect={handleSuggest} />
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}

        {loading && <LoadingIndicator />}

        {error && (
          <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl px-4 py-3 text-xs text-amber-300">
            ⚠️ {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested questions (after messages) */}
      {messages.length > 0 && !loading && (
        <div className="py-2">
          <p className="text-[10px] text-slate-600 mb-2 uppercase tracking-wider">Follow-up suggestions</p>
          <SuggestedQuestions
            questions={SUGGESTED.slice(0, 4)}
            onSelect={handleSuggest}
            disabled={loading}
          />
        </div>
      )}

      {/* Input */}
      <div className="pt-3 border-t border-white/8">
        {profile.location && (
          <p className="text-[10px] text-slate-600 mb-1.5">
            Location context: <span className="text-slate-400">{profile.location}</span>
            {' '}(set in Dashboard)
          </p>
        )}
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about sustainability, recycling, eco products, travel, or government schemes…"
            rows={2}
            className="flex-1 bg-[#0a1a1e] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-green-700/60 resize-none"
            disabled={loading}
          />
          <button
            onClick={() => void handleSend()}
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-xl bg-green-600 hover:bg-green-500 disabled:bg-slate-800 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shrink-0"
          >
            <Send size={15} />
          </button>
        </div>
        <p className="text-[10px] text-slate-700 mt-1.5">
          Press Enter to send · Shift+Enter for new line · Answers grounded in retrieved knowledge documents
        </p>
      </div>
    </div>
  )
}
