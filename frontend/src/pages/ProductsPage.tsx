import { AlertTriangle, CheckCircle2, Leaf, Package, Star, XCircle } from 'lucide-react'

const criteria = [
  { icon: '⏳', label: 'Durability', desc: 'How long does it last? A product that lasts 5 years creates less waste than 5 cheap products.' },
  { icon: '🔄', label: 'Reusability', desc: 'Can it be used many times? Reusable products reduce the need for disposables.' },
  { icon: '🔧', label: 'Repairability', desc: 'Can it be fixed when broken? Products designed for repair last longer.' },
  { icon: '🪨', label: 'Material', desc: 'What is it made of? Prefer natural, recycled, or recyclable materials.' },
  { icon: '⚡', label: 'Energy Efficiency', desc: 'For appliances — check the BEE star rating. Higher stars = less electricity.' },
  { icon: '📦', label: 'Packaging', desc: 'Is it over-packaged? Choose products with minimal or recyclable packaging.' },
  { icon: '♻️', label: 'End-of-Life', desc: 'What happens when it\'s done? Can it be recycled, composted, or taken back?' },
  { icon: '🌍', label: 'Origin', desc: 'Local and seasonal products often have lower transport footprints.' },
]

const commonSwaps = [
  { single: 'Plastic shopping bags', reusable: 'Cloth/jute bags', tip: 'Keep in your bag at all times.' },
  { single: 'Plastic water bottle', reusable: 'Stainless steel or glass bottle', tip: 'Choose one that\'s easy to clean.' },
  { single: 'Disposable coffee cups', reusable: 'Reusable travel mug', tip: 'Many cafés offer discounts for bringing your own.' },
  { single: 'Cling film / plastic wrap', reusable: 'Beeswax wraps or silicone lids', tip: 'Plate over a bowl works too!' },
  { single: 'Disposable razors', reusable: 'Safety razor with replaceable blade', tip: 'More cost-effective long-term.' },
  { single: 'Cotton pads (disposable)', reusable: 'Washable cotton rounds', tip: 'Lasts years with proper care.' },
  { single: 'Paper towels', reusable: 'Cloth towels / old T-shirts', tip: 'Cut old clothes into cleaning rags.' },
  { single: 'Plastic straws', reusable: 'Bamboo or steel straws', tip: 'Or simply skip the straw.' },
]

const greenwashingWarnings = [
  '"100% Natural" — does not mean sustainable. Includes oil-derived materials.',
  '"Eco-friendly" without certification — requires independent verification.',
  '"Carbon neutral" — check whether this is based on offsets or actual reduction.',
  '"Biodegradable" — many bioplastics only degrade under specific industrial conditions.',
]

export default function ProductsPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Eco Product Guide</h2>
        <p className="text-sm text-slate-400">
          How to choose more sustainable products — not an e-commerce store, but a guide to making better purchasing decisions.
        </p>
      </div>

      {/* 8 Criteria */}
      <div className="bg-[#0a1a1e] border border-white/8 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Star size={16} className="text-yellow-400" />
          <h3 className="text-base font-bold text-white">8 Criteria for Evaluating Eco-Friendly Products</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {criteria.map(({ icon, label, desc }) => (
            <div key={label} className="bg-[#060f12] border border-white/5 rounded-xl p-3">
              <div className="text-xl mb-2">{icon}</div>
              <h4 className="text-sm font-semibold text-white mb-1">{label}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lifecycle thinking */}
      <div className="bg-[#0a1a1e] border border-white/8 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Leaf size={15} className="text-green-400" />
          <h3 className="text-sm font-bold text-white">Think in Lifecycles, Not Just Purchase Price</h3>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {['Raw Materials & Manufacturing', 'Use Phase', 'End of Life'].map((stage, i) => (
            <div key={stage} className="text-center">
              <div className="w-8 h-8 rounded-full bg-green-900/40 border border-green-700/30 text-green-400 text-xs font-bold flex items-center justify-center mx-auto mb-1">
                {i + 1}
              </div>
              <p className="text-xs text-slate-300 font-medium">{stage}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          The most sustainable product is often the one you already own and maintain well. Before buying new, consider repair, refill, borrow, or second-hand options.
        </p>
      </div>

      {/* Common Swaps */}
      <div className="bg-[#0a1a1e] border border-white/8 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Package size={15} className="text-teal-400" />
          <h3 className="text-sm font-bold text-white">Common Single-Use → Reusable Swaps</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left text-slate-400 pb-2 font-medium">Single-Use</th>
                <th className="text-left text-slate-400 pb-2 font-medium pl-4">Reusable Alternative</th>
                <th className="text-left text-slate-400 pb-2 font-medium pl-4 hidden sm:table-cell">Tip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {commonSwaps.map(({ single, reusable, tip }) => (
                <tr key={single}>
                  <td className="py-2.5 text-slate-400">{single}</td>
                  <td className="py-2.5 pl-4 text-green-300 font-medium">{reusable}</td>
                  <td className="py-2.5 pl-4 text-slate-500 hidden sm:table-cell">{tip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Greenwashing */}
      <div className="bg-[#0a1a1e] border border-amber-700/25 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={15} className="text-amber-400" />
          <h3 className="text-sm font-bold text-amber-300">Watch Out for Greenwashing</h3>
        </div>
        <div className="space-y-2">
          {greenwashingWarnings.map((w, i) => (
            <div key={i} className="flex items-start gap-2">
              <XCircle size={12} className="text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed">{w}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-600 mt-3">
          Look for independent certifications (e.g. BEE Star Rating, ISO 14001, Fair Trade) rather than self-declared claims.
        </p>
      </div>

      {/* Balanced guidance */}
      <div className="bg-green-950/30 border border-green-800/30 rounded-xl p-4 flex items-start gap-3">
        <CheckCircle2 size={15} className="text-green-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-green-300 mb-1">Balanced Guidance</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            No single product is universally the greenest option. The right choice depends on your local infrastructure, budget, and usage pattern.
            This guide provides criteria-based reasoning, not brand endorsements.
          </p>
        </div>
      </div>
    </div>
  )
}
