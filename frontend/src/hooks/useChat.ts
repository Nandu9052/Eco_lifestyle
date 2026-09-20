import { useCallback, useRef, useState } from 'react'
import { api } from '../services/api'
import type { ChatMessage, ChatResult } from '../types'

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const idRef = useRef(0)

  const sendMessage = useCallback(async (content: string, location?: string) => {
    if (!content.trim()) return

    const userMsg: ChatMessage = {
      id: `u-${++idRef.current}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setLoading(true)
    setError(null)

    try {
      const result: ChatResult = await api.chat(content.trim(), location)
      const assistantMsg: ChatMessage = {
        id: `a-${++idRef.current}`,
        role: 'assistant',
        content: result.answer,
        result,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to reach the Eco Agent backend.'
      setError(msg)
      const errorMsg: ChatMessage = {
        id: `a-${++idRef.current}`,
        role: 'assistant',
        content: `Error: ${msg}. Please ensure the backend service is running and verified knowledge base index is loaded.`,
        result: {
          answer: `Unable to retrieve verified information at this time: ${msg}`,
          actions: [],
          sources: [],
          intent: 'ERROR',
          confidence: 'Unavailable',
          retrieved_topics: [],
          reason_for_recommendation: 'Service request failed. No speculative answer was generated.',
        },
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return { messages, loading, error, sendMessage, clearMessages }
}
