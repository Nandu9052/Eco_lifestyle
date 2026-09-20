interface SuggestedQuestionsProps {
  questions: string[]
  onSelect: (q: string) => void
  disabled?: boolean
}

export function SuggestedQuestions({ questions, onSelect, disabled }: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {questions.map((q) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          disabled={disabled}
          className="text-xs bg-[#0a1a1e] border border-white/10 text-slate-300 rounded-full px-3 py-1.5 hover:border-green-700/50 hover:text-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
        >
          {q}
        </button>
      ))}
    </div>
  )
}
