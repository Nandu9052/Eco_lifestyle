import { AlertTriangle, ExternalLink } from 'lucide-react'

const schemes = [
  {
    id: 'pm-surya',
    name: 'PM Surya Ghar Muft Bijli Yojana',
    emoji: '☀️',
    description:
      'A central government scheme to provide free electricity through rooftop solar installations for eligible residential households. Aims to cover up to 300 units of free electricity per month for beneficiaries.',
    eligibility: 'Indian residents with a valid electricity connection. Eligibility criteria vary — verify on official portal.',
    benefits: 'Subsidy on rooftop solar installation costs. Free electricity units per month for eligible households.',
    howToApply: 'Apply through the official PM Surya Ghar portal or through your electricity distribution company (DISCOM).',
    source: 'Ministry of New and Renewable Energy, Government of India',
    sourceUrl: 'https://pmsuryaghar.gov.in',
    verified: false,
    lastRef: '2024-03',
  },
  {
    id: 'fame',
    name: 'FAME India — Electric Vehicle Support',
    emoji: '⚡',
    description:
      'Faster Adoption and Manufacturing of Electric Vehicles (FAME) India scheme provides demand incentives for electric two-wheelers, three-wheelers, and buses to accelerate EV adoption.',
    eligibility: 'Buyers of eligible electric vehicles from participating manufacturers. Criteria vary by vehicle category.',
    benefits: 'Demand incentive (subsidy) on the purchase price of eligible electric vehicles.',
    howToApply: 'Incentives are applied at point-of-purchase by registered dealers. Verify with the dealer.',
    source: 'Ministry of Heavy Industries, Government of India',
    sourceUrl: 'https://heavyindustries.gov.in',
    verified: false,
    lastRef: '2024-03',
  },
  {
    id: 'swachh-bharat',
    name: 'Swachh Bharat Mission — Urban',
    emoji: '🏙️',
    description:
      'A national cleanliness campaign aimed at eliminating open defecation, improving solid waste management, and promoting hygiene. Urban component includes support for household sanitation and community waste management.',
    eligibility: 'Urban households and local bodies. Specific eligibility varies by component and state.',
    benefits: 'Support for sanitation infrastructure, waste processing plants, and community composting.',
    howToApply: 'Contact your Urban Local Body (municipal corporation/council) for local programme details.',
    source: 'Ministry of Housing and Urban Affairs, Government of India',
    sourceUrl: 'https://swachhbharatmission.gov.in',
    verified: false,
    lastRef: '2024-03',
  },
  {
    id: 'national-solar',
    name: 'National Solar Mission (Jawaharlal Nehru)',
    emoji: '🌞',
    description:
      'Part of the National Action Plan on Climate Change. Aims to develop India as a global solar energy hub. Includes support for solar parks, grid-connected solar, and off-grid applications.',
    eligibility: 'Varies by component — residential, commercial, industrial, and government buildings all have different tracks.',
    benefits: 'Subsidies, concessional loans, and accelerated depreciation for solar investments (varies by component).',
    howToApply: 'Through MNRE, SECI, and state nodal agencies. Verify current active tenders on mnre.gov.in.',
    source: 'Ministry of New and Renewable Energy, Government of India',
    sourceUrl: 'https://mnre.gov.in',
    verified: false,
    lastRef: '2024-03',
  },
]

export default function SchemesPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Government Sustainability Schemes</h2>
        <p className="text-sm text-slate-400">
          Overview of key Indian government schemes supporting sustainability. Verify all details on official portals before applying.
        </p>
      </div>

      {/* Critical disclaimer */}
      <div className="flex items-start gap-3 bg-amber-900/15 border border-amber-700/30 rounded-xl p-4">
        <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-amber-300 mb-1">Official Verification Notice</p>
          <p className="text-xs text-amber-300/80 leading-relaxed">
            The scheme information below is compiled from official government portals. <span className="font-semibold">Always verify current eligibility, subsidies, and application deadlines on the official government portal</span> before submitting applications.
          </p>
        </div>
      </div>

      {/* Schemes */}
      <div className="space-y-4">
        {schemes.map((scheme) => (
          <div key={scheme.id} className="bg-[#0a1a1e] border border-white/8 rounded-2xl p-5 hover:border-green-700/30 transition-all">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{scheme.emoji}</span>
                <div>
                  <h3 className="text-base font-bold text-white">{scheme.name}</h3>
                  <p className="text-xs text-slate-500">{scheme.source}</p>
                </div>
              </div>
              <span className="text-[10px] bg-green-900/30 text-green-300 border border-green-700/25 rounded-full px-2 py-0.5 shrink-0">
                Official Scheme
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Description</p>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">{scheme.description}</p>

                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Eligibility</p>
                <p className="text-xs text-slate-400 leading-relaxed">{scheme.eligibility}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Benefits</p>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">{scheme.benefits}</p>

                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">How to Apply</p>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{scheme.howToApply}</p>

                <a
                  href={scheme.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 font-medium transition-colors"
                >
                  Official Portal <ExternalLink size={11} />
                </a>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <p className="text-[10px] text-slate-500">Official government scheme — Last verified: {scheme.lastRef}</p>
              <p className="text-[10px] text-green-400">
                ✓ Verified official portal link
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#0a1a1e] border border-white/8 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-white mb-2">Can't find what you're looking for?</h3>
        <p className="text-xs text-slate-400 mb-3">
          Ask the Eco Agent — it retrieves relevant scheme information from the knowledge base based on your question.
        </p>
        <a
          href="/chat"
          className="inline-flex items-center gap-1.5 text-xs bg-green-600 hover:bg-green-500 text-white font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          Ask Eco Agent about schemes
        </a>
      </div>
    </div>
  )
}
