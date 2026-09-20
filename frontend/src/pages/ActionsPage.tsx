import { CheckCircle2, ChevronRight, RefreshCw, SkipForward } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { api } from '../services/api'
import type { DailyAction } from '../types'
import { DIFFICULTY_COLORS } from '../types'

const FALLBACK_ACTIONS: DailyAction[] = [
  { title: 'Carry a reusable bottle', description: 'Bring a reusable water bottle with you wherever you go today.', why: 'Reduces single-use plastic without any lifestyle change.', difficulty: 'Easy', category: 'sustainable_living' },
  { title: 'Switch off unused lights', description: 'Walk through your home/office and turn off any unnecessary lights right now.', why: 'Phantom loads account for a significant portion of household energy.', difficulty: 'Easy', category: 'sustainable_living' },
  { title: 'Separate your dry and wet waste', description: 'Use two separate bins — one for organic waste, one for recyclables.', why: 'Correct separation enables both composting and recycling.', difficulty: 'Easy', category: 'recycling' },
  { title: 'Plan tomorrow\'s meals today', description: 'Spend 5 minutes planning what you\'ll eat tomorrow to avoid buying excess.', why: 'Meal planning is one of the most effective ways to reduce food waste.', difficulty: 'Easy', category: 'sustainable_living' },
  { title: 'Walk or cycle for your next short trip', description: 'For the next trip under 2km, leave the vehicle at home.', why: 'Zero emissions and physical activity in one.', difficulty: 'Medium', category: 'eco_travel' },
  { title: 'Fix a leaking tap', description: 'Check your taps and fix or report any dripping tap today.', why: 'A dripping tap wastes up to 30 litres per day.', difficulty: 'Easy', category: 'sustainable_living' },
  { title: 'Dispose of old batteries correctly', description: 'Collect any old batteries and find a local drop-off or collection point.', why: 'Battery chemicals contaminate soil and water when landfilled.', difficulty: 'Medium', category: 'recycling' },
  { title: 'Choose a reusable bag for shopping', description: 'Use a cloth or jute bag for your next shopping trip.', why: 'Each reusable bag replaces hundreds of single-use plastic bags over its life.', difficulty: 'Easy', category: 'sustainable_living' },
]

export default function ActionsPage() {
  const [actions, setActions] = useState<DailyAction[]>(FALLBACK_ACTIONS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [doneIds, setDoneIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .actions()
      .then((res) => setActions(res.actions as DailyAction[]))
      .catch(() => {/* use fallback */})
      .finally(() => setLoading(false))
  }, [])

  const current = actions[currentIndex]

  const markDone = useCallback(() => {
    setDoneIds((prev) => new Set([...prev, currentIndex]))
    const next = (currentIndex + 1) % actions.length
    setCurrentIndex(next)
  }, [currentIndex, actions.length])

  const skipAction = useCallback(() => {
    const next = (currentIndex + 1) % actions.length
    setCurrentIndex(next)
  }, [currentIndex, actions.length])

  const pickRandom = useCallback(() => {
    const idx = Math.floor(Math.random() * actions.length)
    setCurrentIndex(idx)
  }, [actions.length])

  if (loading) {
    return (
      <div className="max-w-2xl">
        <div className="bg-[#0a1a1e] border border-white/8 rounded-2xl p-8 text-center">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-white/5 rounded w-1/3 mx-auto" />
            <div className="h-6 bg-white/5 rounded w-2/3 mx-auto" />
            <div className="h-4 bg-white/5 rounded w-1/2 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Daily Eco Actions</h2>
        <p className="text-sm text-slate-400">One action at a time. Small choices, daily — that's how habits form.</p>
      </div>

      {/* Today's Action Card */}
      {current && (
        <div className="bg-[#0a1a1e] border border-white/8 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">
              Today's Eco Action
            </span>
            <span className={`text-[10px] rounded-full px-2 py-0.5 ${DIFFICULTY_COLORS[current.difficulty] ?? 'bg-slate-800 text-slate-300'}`}>
              {current.difficulty}
            </span>
          </div>

          <div className="text-4xl mb-4">
            {current.category === 'recycling' ? '♻️' :
             current.category === 'eco_travel' ? '🚲' :
             current.category === 'eco_products' ? '🛍️' : '🌱'}
          </div>

          <h3 className="text-xl font-bold text-white mb-2">{current.title}</h3>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">{current.description}</p>

          <div className="bg-[#060f12] border border-white/5 rounded-lg p-3 mb-5">
            <p className="text-xs text-slate-400">
              <span className="text-green-400 font-semibold">Why it matters: </span>
              {current.why}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={markDone}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
            >
              <CheckCircle2 size={15} />
              Done! Next Action
            </button>
            <button
              onClick={skipAction}
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 py-2.5 px-4 rounded-xl transition-colors text-sm"
              title="Skip this action"
            >
              <SkipForward size={14} />
              Skip
            </button>
            <button
              onClick={pickRandom}
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 py-2.5 px-4 rounded-xl transition-colors text-sm"
              title="Random action"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Progress */}
      <div className="bg-[#0a1a1e] border border-white/8 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Today's Progress</h3>
          <span className="text-xs text-green-400 font-bold">{doneIds.size} / {actions.length}</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 mb-3">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${(doneIds.size / actions.length) * 100}%` }}
          />
        </div>
        {doneIds.size === 0 && <p className="text-xs text-slate-500">Start with one easy action above ☝️</p>}
      </div>

      {/* All Actions List */}
      <div className="bg-[#0a1a1e] border border-white/8 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-white mb-3">All Eco Actions</h3>
        <div className="space-y-2">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                i === currentIndex
                  ? 'bg-green-900/30 border border-green-700/30'
                  : doneIds.has(i)
                  ? 'bg-white/3 opacity-50'
                  : 'hover:bg-white/5'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                doneIds.has(i) ? 'bg-green-700/50' : 'bg-slate-800'
              }`}>
                {doneIds.has(i) ? (
                  <CheckCircle2 size={12} className="text-green-400" />
                ) : (
                  <span className="text-[10px] text-slate-500 font-bold">{i + 1}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${doneIds.has(i) ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {action.title}
                </p>
              </div>
              <span className={`text-[9px] rounded-full px-1.5 py-0.5 shrink-0 ${DIFFICULTY_COLORS[action.difficulty] ?? 'bg-slate-800 text-slate-400'}`}>
                {action.difficulty}
              </span>
              {i === currentIndex && <ChevronRight size={12} className="text-green-400 shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-slate-600 text-center">
        Progress resets on page refresh. Log-in-based persistence is a planned feature.
      </p>
    </div>
  )
}
