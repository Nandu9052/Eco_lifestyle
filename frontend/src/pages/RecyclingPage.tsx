import { AlertTriangle, Battery, MapPin, Monitor, Package, Smartphone } from 'lucide-react'
import { useState } from 'react'

const wasteCategories = [
  {
    icon: Battery,
    color: 'text-red-400',
    bg: 'bg-red-900/20',
    label: 'Batteries',
    type: 'Hazardous Waste',
    action: 'Deposit at authorised battery collection points — many electronics retailers and municipal collection drives accept them.',
    doNot: 'Never put batteries in regular household bins. Never burn or puncture batteries.',
    why: 'Batteries contain heavy metals (lead, cadmium, mercury) that leach into soil and water if landfilled.',
    localNote: 'Check with your local municipality or branded electronics stores for collection drives.',
  },
  {
    icon: Smartphone,
    color: 'text-blue-400',
    bg: 'bg-blue-900/20',
    label: 'Old Mobile Phones',
    type: 'E-Waste',
    action: 'Wipe all personal data first. Then deposit at manufacturer take-back programmes, authorised e-waste recyclers, or municipal e-waste drives.',
    doNot: 'Never throw in regular bins, never sell to unverified scrap dealers who may burn e-waste.',
    why: 'Phones contain recoverable gold, silver, copper, and rare earth metals. Improper disposal releases toxic substances.',
    localNote: 'Regulated under CPCB E-Waste (Management) Rules 2022. Hand over only to State Pollution Control Board registered dismantlers or producer take-back drives.',
  },
  {
    icon: Monitor,
    color: 'text-purple-400',
    bg: 'bg-purple-900/20',
    label: 'Computers & TVs',
    type: 'E-Waste',
    action: 'Contact the manufacturer or authorised recycler. Some brands offer exchange programmes when buying new.',
    doNot: 'Do not dismantle yourself — screens contain hazardous substances. Do not place in regular trash.',
    why: 'Large electronics contain both recoverable materials and hazardous components requiring specialised processing.',
    localNote: 'Verify authorised e-waste recyclers with your Pollution Control Board.',
  },
  {
    icon: Package,
    color: 'text-green-400',
    bg: 'bg-green-900/20',
    label: 'Plastic Waste',
    type: 'Recyclable (some types)',
    action: 'Clean and dry plastic before recycling. Hard plastics (PET, HDPE) are widely recyclable. Soft plastic bags often require separate collection.',
    doNot: 'Do not recycle greasy or food-contaminated plastic without washing. Do not burn plastic.',
    why: 'Recycling rates in India are still developing. Contaminated plastic reduces the value of recycling batches.',
    localNote: 'Check your local SWM (Solid Waste Management) rules — dry waste pickup days vary by city.',
  },
]

const plasticTypes = [
  { code: '1', name: 'PET', examples: 'Water bottles, food jars', recyclable: true },
  { code: '2', name: 'HDPE', examples: 'Milk jugs, detergent bottles', recyclable: true },
  { code: '3', name: 'PVC', examples: 'Pipes, some food wraps', recyclable: false },
  { code: '4', name: 'LDPE', examples: 'Plastic bags, squeeze bottles', recyclable: false },
  { code: '5', name: 'PP', examples: 'Yogurt containers, straws', recyclable: true },
  { code: '6', name: 'PS', examples: 'Styrofoam cups, takeaway boxes', recyclable: false },
  { code: '7', name: 'Other', examples: 'Multi-layer, mixed plastics', recyclable: false },
]

export default function RecyclingPage() {
  const [location, setLocation] = useState('')

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Recycling & Disposal Guide</h2>
        <p className="text-sm text-slate-400">
          Learn how to responsibly dispose of batteries, e-waste, plastics, and household waste.
        </p>
      </div>

      {/* Location Input */}
      <div className="bg-[#0a1a1e] border border-white/8 rounded-xl p-4 flex items-center gap-3">
        <MapPin size={16} className="text-green-400 shrink-0" />
        <div className="flex-1">
          <label className="text-xs text-slate-400 block mb-1">Your location (optional — for local guidance)</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Kurnool, Andhra Pradesh"
            className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Important disclaimer */}
      <div className="flex items-start gap-3 bg-amber-900/15 border border-amber-700/25 rounded-xl p-4">
        <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-300/90 leading-relaxed">
          <span className="font-semibold">Important:</span> Local disposal rules may vary. Please verify with your{' '}
          {location ? <span className="font-semibold">{location}</span> : 'local'} municipal authority or urban local body (ULB).
        </p>
      </div>

      {/* Waste Categories */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Disposal by Waste Type</h3>
        {wasteCategories.map(({ icon: Icon, color, bg, label, type, action, doNot, why, localNote }) => (
          <div key={label} className="bg-[#0a1a1e] border border-white/8 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon size={18} className={color} />
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-bold text-white">{label}</h4>
                    <span className="text-[10px] bg-slate-800 text-slate-400 rounded-full px-2 py-0.5">{type}</span>
                  </div>
                  <p className="text-xs font-semibold text-green-400 mb-1">✓ Recommended Action</p>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">{action}</p>
                  <p className="text-xs font-semibold text-red-400 mb-1">✗ What NOT to Do</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{doNot}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-1">Why it matters</p>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{why}</p>
                  <p className="text-xs font-semibold text-blue-400 mb-1">🗺 Local Guidance</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{localNote}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plastic Codes */}
      <div className="bg-[#0a1a1e] border border-white/8 rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-3">Plastic Resin Codes — What Can Be Recycled?</h3>
        <p className="text-xs text-slate-500 mb-4">
          Look for the recycling triangle with a number on plastic products. Recyclability varies by local infrastructure.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {plasticTypes.map(({ code, name, examples, recyclable }) => (
            <div
              key={code}
              className={`rounded-lg p-2.5 text-center border ${
                recyclable
                  ? 'bg-green-900/20 border-green-700/30'
                  : 'bg-red-900/15 border-red-700/20'
              }`}
            >
              <div className={`text-base font-black mb-0.5 ${recyclable ? 'text-green-400' : 'text-red-400'}`}>
                [{code}]
              </div>
              <p className="text-[10px] font-bold text-slate-300">{name}</p>
              <p className="text-[9px] text-slate-500 leading-tight mt-0.5">{examples}</p>
              <p className={`text-[9px] font-semibold mt-1 ${recyclable ? 'text-green-400' : 'text-red-400'}`}>
                {recyclable ? '✓ Often recyclable' : '✗ Not commonly'}
              </p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-500 mt-3">Standard Resin Identification Codes (RIC 1–7) per BIS and CPCB guidelines. Recyclability depends on local Material Recovery Facilities (MRFs).</p>
      </div>

      {/* Waste Separation */}
      <div className="bg-[#0a1a1e] border border-white/8 rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-4">Household Waste Separation (India)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
            <h4 className="text-sm font-bold text-green-300 mb-2">🟢 Wet / Organic Waste</h4>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Food scraps and peels</li>
              <li>• Cooked food remains</li>
              <li>• Garden waste / leaves</li>
              <li>• Tea bags, coffee grounds</li>
            </ul>
            <p className="text-[10px] text-green-400 mt-2">→ Composting / biogas</p>
          </div>
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
            <h4 className="text-sm font-bold text-blue-300 mb-2">🔵 Dry Waste</h4>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Paper, cardboard</li>
              <li>• Hard plastics (clean)</li>
              <li>• Glass bottles</li>
              <li>• Metal cans and tins</li>
            </ul>
            <p className="text-[10px] text-blue-400 mt-2">→ Recycling / material recovery</p>
          </div>
          <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
            <h4 className="text-sm font-bold text-red-300 mb-2">🔴 Hazardous Waste</h4>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Batteries</li>
              <li>• Medicines / chemicals</li>
              <li>• Paint, solvents</li>
              <li>• Electronic waste</li>
            </ul>
            <p className="text-[10px] text-red-400 mt-2">→ Separate collection only</p>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 mt-3">Mandated under Solid Waste Management (SWM) Rules 2016 by Ministry of Environment, Forest & Climate Change (MoEFCC).</p>
      </div>
    </div>
  )
}
