import { AlertOctagon, CheckCircle, Eye, Lock, Scale, Shield, Users } from 'lucide-react'

const principles = [
  {
    icon: Scale,
    title: 'FAIRNESS & ACCESSIBILITY',
    color: 'text-teal-400',
    borderColor: 'border-teal-700/30',
    summary: 'Recommendations should not assume identical income, resources, infrastructure, or lifestyle.',
    details: [
      'Sustainability advice must be practical for diverse socio-economic backgrounds, including students, rural households, and urban renters.',
      'We do not advocate expensive commercial "eco-gadgets" when simple behavioural changes (e.g. bucket baths, reusable bags, turning off appliances) produce greater impact.',
      'We recognize infrastructure disparities—such as the absence of dedicated cycling lanes or municipal composting facilities in specific towns.',
    ],
  },
  {
    icon: Eye,
    title: 'TRANSPARENCY & SOURCE TRACEABILITY',
    color: 'text-green-400',
    borderColor: 'border-green-700/30',
    summary: 'Responses are grounded in verified government and environmental source documents.',
    details: [
      'Every answer clearly cites the underlying official government portal or authoritative document, complete with direct portal links.',
      'Information is presented clearly and honestly so citizens can easily verify eligibility and benefits on official websites.',
      'When an inquiry falls outside verified official documents, the agent honestly clarifies limits rather than generating speculative claims.',
    ],
  },
  {
    icon: Lock,
    title: 'PRIVACY & DATA MINIMIZATION',
    color: 'text-blue-400',
    borderColor: 'border-blue-700/30',
    summary: 'Collect only information strictly necessary for optional personalization.',
    details: [
      'Personalization (city, lifestyle persona, goals) is 100% optional and stored locally in your browser storage.',
      'No account registration, passwords, phone numbers, or personally identifiable information (PII) are required.',
      'User questions are never sold or leveraged for advertising profiling.',
    ],
  },
  {
    icon: Shield,
    title: 'SOURCE RELIABILITY & GROUNDING',
    color: 'text-purple-400',
    borderColor: 'border-purple-700/30',
    summary: 'Prioritize authoritative government, academic, and multilateral environmental sources.',
    details: [
      'Knowledge documents are prioritized from official ministries: MCA, MNRE, MoAFW, MoLE, MoE, MoHUA, MoEFCC, and State portals.',
      'Commercial brand endorsements and unverified claims are strictly excluded from recommendations.',
      'All guidance is linked directly to authoritative public services and verified government portals.',
    ],
  },
  {
    icon: AlertOctagon,
    title: 'HALLUCINATION PREVENTION',
    color: 'text-amber-400',
    borderColor: 'border-amber-700/30',
    summary: 'Ground answers in verified context and explicitly declare uncertainty.',
    details: [
      'The semantic retrieval pipeline prioritizes official Central and State government documents and verified environmental standards.',
      'If an inquiry is outside the scope of verified documents, the system directs the user to national citizen portals like MyScheme or India.gov.in.',
      'We never fabricate government scheme eligibility, stipend amounts, subsidy percentages, or local recycling regulations.',
    ],
  },
  {
    icon: Users,
    title: 'HUMAN OVERSIGHT & VALIDATION',
    color: 'text-rose-400',
    borderColor: 'border-rose-700/30',
    summary: 'Important government, legal, or hazardous waste rules must be verified with relevant authorities.',
    details: [
      'The agent provides disclaimers on all government subsidy summaries and hazardous waste guidelines.',
      'Users are directed to official portals (e.g. pmsuryaghar.gov.in, swachhbharatmission.gov.in) to complete official filings.',
      'AI acts as an educational navigator, not a legal or municipal authority.',
    ],
  },
]

export default function ResponsibleAIPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Shield size={20} className="text-green-400" />
          <h2 className="text-2xl font-bold text-white">Responsible AI Framework</h2>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          At Eco Lifestyle Agent, we believe that AI applied to sustainability must adhere to rigorous standards of transparency, fairness, and scientific accuracy. Here is how our system enforces Responsible AI principles.
        </p>
      </div>

      {/* Overview Banner */}
      <div className="bg-[#0a1a1e] border border-white/8 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-start gap-3">
          <CheckCircle size={18} className="text-green-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-white">Grounded via RAG</h4>
            <p className="text-xs text-slate-400 mt-1">Answers derive from vetted documents rather than ungrounded parametric memory.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle size={18} className="text-green-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-white">Data Honesty</h4>
            <p className="text-xs text-slate-400 mt-1">We never fabricate subsidies, impact metrics, or local municipal waste laws.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle size={18} className="text-green-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-white">Full Transparency</h4>
            <p className="text-xs text-slate-400 mt-1">Inspect retrieved topics, document sources, and model status on every query.</p>
          </div>
        </div>
      </div>

      {/* Six Pillars Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">The Six Responsible AI Pillars</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {principles.map((p) => {
            const Icon = p.icon
            return (
              <div
                key={p.title}
                className={`bg-[#0a1a1e] border ${p.borderColor} rounded-2xl p-5 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <Icon size={18} className={p.color} />
                    <h4 className="text-xs font-bold tracking-wider text-white uppercase">{p.title}</h4>
                  </div>
                  <p className="text-xs font-medium text-slate-300 mb-3">{p.summary}</p>
                  <ul className="space-y-2 border-t border-white/5 pt-3">
                    {p.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
                        <span className="text-green-500 font-bold shrink-0 mt-0.5">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Ethical AI Footer */}
      <div className="bg-gradient-to-br from-green-950/40 to-slate-900 border border-green-800/30 rounded-2xl p-5">
        <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-1">
          Ethical AI Framework · SDG 12 Alignment
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          This system addresses UN Sustainable Development Goal 12 (Responsible Consumption and Production). By embedding Responsible AI safeguards directly into the software architecture, the Eco Lifestyle Agent demonstrates how artificial intelligence can be safely and transparently mobilized for environmental stewardship.
        </p>
      </div>
    </div>
  )
}
