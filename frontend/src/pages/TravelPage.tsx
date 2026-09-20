import { AlertTriangle, Info } from 'lucide-react'
import { useState } from 'react'

const travelModes = [
  {
    mode: 'Walking',
    icon: '🚶',
    emission: 'Zero',
    emissionColor: 'text-green-400',
    bestFor: 'Under 2 km',
    pros: ['Zero emissions', 'No fuel cost', 'Health benefits', 'No parking needed'],
    cons: ['Limited to short distances', 'Weather-dependent', 'Not suitable for heavy loads'],
    tips: [
      'Combine walking errands into one trip to nearby areas.',
      'Use walking time as exercise — no gym needed.',
      'Download offline maps for unfamiliar areas.',
    ],
    color: 'border-green-700/30 bg-green-900/10',
    badge: 'bg-green-900/40 text-green-300',
  },
  {
    mode: 'Cycling',
    icon: '🚲',
    emission: 'Near-zero',
    emissionColor: 'text-green-300',
    bestFor: '2–10 km',
    pros: ['Near-zero emissions', 'Fast in traffic', 'Low cost', 'Health benefits'],
    cons: ['Requires cycle infrastructure', 'Not for long distances', 'Storage needed'],
    tips: [
      'Keep tyres inflated and chain oiled for efficiency.',
      'Use a helmet and reflective gear for safety.',
      'Check if your workplace has cycle parking.',
    ],
    color: 'border-teal-700/30 bg-teal-900/10',
    badge: 'bg-teal-900/40 text-teal-300',
  },
  {
    mode: 'Public Transport',
    icon: '🚌',
    emission: 'Low',
    emissionColor: 'text-blue-300',
    bestFor: 'Any distance',
    pros: ['Low per-passenger emissions', 'No parking cost', 'Can be productive', 'Affordable'],
    cons: ['Fixed routes and schedules', 'Can be crowded', 'Last-mile challenge'],
    tips: [
      'Plan journeys with Google Maps or local transit apps.',
      'Use monthly passes for frequent commuters.',
      'Combine with walking or cycling for last-mile.',
    ],
    color: 'border-blue-700/30 bg-blue-900/10',
    badge: 'bg-blue-900/40 text-blue-300',
  },
  {
    mode: 'Carpool / Shared Ride',
    icon: '🚗',
    emission: 'Medium',
    emissionColor: 'text-yellow-300',
    bestFor: 'Long distances',
    pros: ['Splits fuel cost', 'Lower per-person emissions than solo driving', 'Social', 'Reduces road congestion'],
    cons: ['Needs coordination', 'Schedule dependency', 'Still uses fossil fuel (usually)'],
    tips: [
      'Use apps like BlaBlaCar or workplace carpooling boards.',
      'Combine errands into one trip to reduce total journeys.',
      'If driving, maintain correct tyre pressure to improve fuel efficiency.',
    ],
    color: 'border-yellow-700/30 bg-yellow-900/10',
    badge: 'bg-yellow-900/40 text-yellow-300',
  },
  {
    mode: 'Private Vehicle (Solo)',
    icon: '🚙',
    emission: 'Highest',
    emissionColor: 'text-red-400',
    bestFor: 'When no alternative',
    pros: ['Door-to-door convenience', 'Flexible timing', 'Comfortable'],
    cons: ['Highest per-trip emissions', 'Fuel/running cost', 'Parking cost', 'Traffic'],
    tips: [
      'Maintain correct tyre pressure to reduce fuel consumption.',
      'Consider switching to an EV or hybrid for future purchases.',
      'Combine multiple errands in one trip.',
    ],
    color: 'border-red-700/25 bg-red-900/10',
    badge: 'bg-red-900/40 text-red-300',
  },
]

export default function TravelPage() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Eco-Friendly Travel Guide</h2>
        <p className="text-sm text-slate-400">
          Compare sustainable transport options and choose the lowest-impact mode for your journey.
        </p>
      </div>

      {/* Location inputs */}
      <div className="bg-[#0a1a1e] border border-white/8 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Starting Location</label>
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="e.g. Kurnool City Centre"
            className="w-full bg-[#060f12] border border-white/8 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-green-700/50"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Destination</label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="e.g. Office / Market / College"
            className="w-full bg-[#060f12] border border-white/8 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-green-700/50"
          />
        </div>
      </div>

      {/* Live data disclaimer */}
      <div className="flex items-start gap-3 bg-blue-900/15 border border-blue-700/25 rounded-xl p-3">
        <Info size={13} className="text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-300/80 leading-relaxed">
          <span className="font-semibold">Static infrastructure guidance:</span> Real-time GPS and live transit tracking are not active in this interface.
          Recommendations below are based on statutory urban mobility and sustainable transportation standards. For live routes, consult local municipal transit apps or mapping services.
        </p>
      </div>

      {/* Travel mode cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-300">Transport Mode Comparison</h3>
        {travelModes.map(({ mode, icon, emission, emissionColor, bestFor, pros, cons, tips, color }) => (
          <div key={mode} className={`border rounded-2xl p-5 ${color}`}>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <div>
                  <h3 className="text-base font-bold text-white">{mode}</h3>
                  <p className="text-xs text-slate-400">Best for: {bestFor}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs font-bold ${emissionColor}`}>{emission}</span>
                <p className="text-[10px] text-slate-500">emissions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-semibold text-green-400 mb-1.5">✓ Advantages</p>
                <ul className="space-y-1">
                  {pros.map((p) => (
                    <li key={p} className="text-xs text-slate-400 flex items-start gap-1">
                      <span className="text-green-500">·</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-red-400 mb-1.5">✗ Limitations</p>
                <ul className="space-y-1">
                  {cons.map((c) => (
                    <li key={c} className="text-xs text-slate-400 flex items-start gap-1">
                      <span className="text-red-500">·</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-400 mb-1.5">💡 Practical Tips</p>
                <ul className="space-y-1">
                  {tips.map((t) => (
                    <li key={t} className="text-xs text-slate-400 flex items-start gap-1">
                      <span className="text-blue-500">·</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sustainability hierarchy */}
      <div className="bg-[#0a1a1e] border border-white/8 rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-4">Sustainable Transport Hierarchy</h3>
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center">
          {['Walk', 'Cycle', 'Public Transport', 'Carpool', 'Solo EV', 'Solo Petrol/Diesel'].map((m, i) => (
            <div key={m} className="flex items-center gap-2">
              <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                i === 0 ? 'bg-green-700 text-white' :
                i === 1 ? 'bg-green-800 text-green-200' :
                i === 2 ? 'bg-teal-900 text-teal-300' :
                i === 3 ? 'bg-blue-900 text-blue-300' :
                i === 4 ? 'bg-yellow-900 text-yellow-300' :
                'bg-red-900/60 text-red-300'
              }`}>
                {m}
              </div>
              {i < 5 && <span className="text-slate-600 text-xs hidden sm:block">→</span>}
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-600 mt-3">Best → Least sustainable. Choose the lowest option that works for your journey.</p>
      </div>

      <div className="flex items-start gap-3 bg-amber-900/10 border border-amber-700/20 rounded-xl p-3">
        <AlertTriangle size={12} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="text-[10px] text-amber-300/70 leading-relaxed">
          Transport emissions data above is based on general sustainability principles, not city-specific measurements. Actual impact depends on local energy mix, vehicle type, and occupancy rate.
        </p>
      </div>
    </div>
  )
}
