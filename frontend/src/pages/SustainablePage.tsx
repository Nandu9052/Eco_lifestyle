import { ArrowRight, Droplets, Leaf, ShoppingBag, Trash2, UtensilsCrossed, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const topics = [
  {
    icon: ShoppingBag,
    color: 'text-green-400',
    bg: 'bg-green-900/20',
    title: 'Reduce Plastic Use',
    question: 'How can I reduce plastic use at home?',
    tips: [
      'Carry reusable shopping bags — keep them in your bag or car so you never forget.',
      'Use refillable water bottles and coffee cups.',
      'Choose refillable cleaning and personal care products.',
      'Reuse food containers and lunch boxes.',
      'Avoid unnecessary single-use packaging when shopping.',
    ],
    why: 'Single-use plastic takes hundreds of years to break down and contaminates ecosystems. Each reusable swap, repeated daily, compounds into significant waste reduction.',
    difficulty: 'Easy',
  },
  {
    icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-900/20',
    title: 'Save Electricity',
    question: 'How can I save electricity at home?',
    tips: [
      'Switch to LED bulbs — they use up to 75% less energy than incandescent.',
      'Set AC to 24°C (BEE recommendation) — each degree lower increases energy use.',
      'Unplug chargers and devices when not in use (phantom load).',
      'Choose appliances with high BEE star ratings.',
      'Use natural ventilation where possible instead of AC.',
    ],
    why: 'Electricity generation is a major source of greenhouse gas emissions. Reducing household energy use lowers your carbon footprint and electricity bills.',
    difficulty: 'Easy',
  },
  {
    icon: Droplets,
    color: 'text-blue-400',
    bg: 'bg-blue-900/20',
    title: 'Save Water',
    question: 'How can I reduce water consumption at home?',
    tips: [
      'Fix dripping taps — a drip a second wastes over 30 litres a day.',
      'Take shorter showers or switch to bucket baths.',
      'Collect and reuse rinse water for mopping or plants.',
      'Run washing machines and dishwashers only when fully loaded.',
      'Water plants in the evening to reduce evaporation.',
    ],
    why: 'Freshwater is a finite resource. India faces water stress in many regions. Conservative use reduces pressure on local water bodies and treatment systems.',
    difficulty: 'Easy',
  },
  {
    icon: Trash2,
    color: 'text-blue-300',
    bg: 'bg-blue-900/20',
    title: 'Reduce Household Waste',
    question: 'How can I reduce household waste?',
    tips: [
      'Separate dry and wet waste every day.',
      'Compost organic kitchen scraps.',
      'Donate usable items instead of discarding them.',
      'Buy products with minimal or recyclable packaging.',
      'Repair items before replacing them.',
    ],
    why: 'India generates millions of tonnes of solid waste daily. Proper separation and reduction at source reduces landfill burden and enables recycling.',
    difficulty: 'Medium',
  },
  {
    icon: UtensilsCrossed,
    color: 'text-orange-400',
    bg: 'bg-orange-900/20',
    title: 'Reduce Food Waste',
    question: 'How can I reduce food waste at home?',
    tips: [
      'Plan meals weekly and buy only what you need.',
      'Use FIFO (First In, First Out) in your fridge and pantry.',
      'Cook with vegetable peels and scraps where possible.',
      'Store food correctly to extend shelf life.',
      'Compost unavoidable food waste instead of throwing it away.',
    ],
    why: 'About one-third of all food produced globally is wasted. Food waste in landfills generates methane, a potent greenhouse gas.',
    difficulty: 'Medium',
  },
  {
    icon: Leaf,
    color: 'text-green-300',
    bg: 'bg-green-900/20',
    title: 'Sustainable Daily Lifestyle',
    question: 'How can I make my daily lifestyle more sustainable?',
    tips: [
      'Start with one habit — don\'t try to change everything at once.',
      'Walk or cycle for short trips (under 3km).',
      'Choose seasonal and local produce when possible.',
      'Say no to unnecessary freebies, packets, and promotional plastic.',
      'Extend the life of your devices and clothes through repair and care.',
    ],
    why: 'Sustainable living is not about perfection — it is about consistent, small choices that collectively reduce environmental impact.',
    difficulty: 'Easy',
  },
]

export default function SustainablePage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Sustainable Living Guide</h2>
        <p className="text-sm text-slate-400">
          Practical guidance for everyday sustainability — grounded in retrieved knowledge. Ask the Eco Agent for personalised advice.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {topics.map(({ icon: Icon, color, bg, title, question, tips, why, difficulty }) => (
          <div
            key={title}
            className="bg-[#0a1a1e] border border-white/8 rounded-2xl p-5 hover:border-green-700/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon size={18} className={color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="text-base font-bold text-white">{title}</h3>
                  <span className={`text-[10px] rounded-full px-2 py-0.5 shrink-0 ${
                    difficulty === 'Easy' ? 'bg-green-900/40 text-green-300' : 'bg-yellow-900/40 text-yellow-300'
                  }`}>
                    {difficulty}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Practical Actions</p>
                  <ol className="space-y-1.5">
                    {tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-green-500 font-bold shrink-0 mt-0.5 text-xs">{i + 1}.</span>
                        {tip}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-[#060f12] border border-white/5 rounded-lg p-3 mb-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Why it matters</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{why}</p>
                </div>

                <Link
                  to={`/chat`}
                  state={{ question }}
                  className="inline-flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 font-medium transition-colors"
                >
                  Ask about this <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-900/10 border border-amber-700/20 rounded-xl p-4">
        <p className="text-xs text-amber-300/80">
          <span className="font-semibold">Note:</span> The tips above are general guidance for sustainable living. For local-specific rules or subsidies, please verify with your municipal authority or relevant government portal.
        </p>
      </div>
    </div>
  )
}
