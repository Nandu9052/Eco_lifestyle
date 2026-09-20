import { ArrowRight, Bot, BriefcaseBusiness, Building2, Leaf, MapPin, Recycle, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const features = [
  { icon: Sparkles, label: 'Sustainable Living', desc: 'Reduce waste, save energy & water, build greener habits.', path: '/sustainable', color: 'text-green-400' },
  { icon: Recycle, label: 'Recycling Guide', desc: 'Dispose of plastics, batteries, and e-waste responsibly.', path: '/recycling', color: 'text-blue-400' },
  { icon: BriefcaseBusiness, label: 'Eco Product Guide', desc: 'Choose durable, efficient, and lower-impact products.', path: '/products', color: 'text-teal-400' },
  { icon: Building2, label: 'Government Schemes', desc: 'Explore sustainability incentives and verified programmes.', path: '/schemes', color: 'text-purple-400' },
  { icon: MapPin, label: 'Eco Travel', desc: 'Plan greener journeys with sustainable transport options.', path: '/travel', color: 'text-cyan-400' },
  { icon: Bot, label: 'AI Recommendations', desc: 'Ask natural language questions, get grounded guidance.', path: '/chat', color: 'text-orange-400' },
]

const howItWorks = [
  { step: '01', label: 'Ask', desc: 'Type your sustainability question in plain language.' },
  { step: '02', label: 'Retrieve', desc: 'RAG system retrieves relevant knowledge documents.' },
  { step: '03', label: 'Understand', desc: 'Intent detection maps your question to the right topic.' },
  { step: '04', label: 'Recommend', desc: 'AI generates a grounded, source-backed answer.' },
  { step: '05', label: 'Act', desc: 'You receive practical, honest next steps.' },
]

export default function HomePage() {
  return (
    <div className="space-y-8 max-w-5xl">
      {/* Hero */}
      <section className="bg-[#0a1a1e] border border-white/8 rounded-2xl p-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-green-400 bg-green-900/30 border border-green-700/20 rounded-full px-3 py-1 mb-4">
            <Leaf size={11} />
            SDG 12 · Responsible Consumption & Production
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
            Small actions.<br />
            <span className="text-green-400">Big impact.</span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed mb-6">
            Your AI-powered sustainability companion for practical, trustworthy, and personalised everyday environmental guidance — powered by RAG and IBM Granite.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-green-950 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              Ask Eco Agent
              <ArrowRight size={15} />
            </Link>
            <Link
              to="/sustainable"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-medium px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              Explore Sustainability
            </Link>
          </div>
        </div>

        {/* Why RAG panel */}
        <div className="lg:col-span-2 bg-[#060f12] border border-white/8 rounded-xl p-5">
          <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-4">
            Why RAG?
          </p>
          <div className="space-y-3">
            {[
              'Questions are mapped to sustainability topics via intent detection.',
              'Relevant local knowledge is retrieved before any answer is generated.',
              'Responses are grounded in trusted documents — not hallucinated.',
              'Every answer shows the sources and retrieval reasoning.',
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-green-900/60 text-green-400 text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  {i + 1}
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section>
        <h3 className="text-lg font-bold text-white mb-4">Core Sustainability Areas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, label, desc, path, color }) => (
            <Link
              key={path}
              to={path}
              className="group bg-[#0a1a1e] border border-white/8 rounded-xl p-5 hover:border-green-700/40 transition-all hover:bg-[#0d2228]"
            >
              <Icon size={20} className={`${color} mb-3`} />
              <h4 className="text-sm font-semibold text-white mb-1">{label}</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">{desc}</p>
              <span className="text-xs text-green-400 font-medium group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                Explore <ArrowRight size={11} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#0a1a1e] border border-white/8 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">How It Works</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {howItWorks.map(({ step, label, desc }, i) => (
            <div key={step} className="relative">
              {i < howItWorks.length - 1 && (
                <div className="hidden lg:block absolute top-4 left-full w-full h-px bg-green-900/50 z-0" />
              )}
              <div className="relative z-10">
                <div className="w-8 h-8 rounded-full bg-green-900/50 border border-green-700/40 flex items-center justify-center text-xs font-bold text-green-400 mb-2">
                  {step}
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">{label}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SDG Badge */}
      <section className="bg-gradient-to-br from-green-950/50 to-emerald-950/30 border border-green-800/30 rounded-2xl p-6 flex items-center gap-6">
        <div className="w-16 h-16 rounded-xl bg-green-600/20 border border-green-600/30 flex items-center justify-center text-2xl font-black text-green-400 shrink-0">
          12
        </div>
        <div>
          <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-1">
            UN Sustainable Development Goal
          </p>
          <h3 className="text-base font-bold text-white mb-1">
            SDG 12 — Responsible Consumption and Production
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            This project supports SDG 12 by helping users make more informed, responsible choices about consumption, waste, energy, and transportation through AI-powered, evidence-grounded guidance.
          </p>
        </div>
      </section>
    </div>
  )
}
