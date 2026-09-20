import { Award, CheckCircle2, Flame, MapPin, Save, Target, User, Zap } from 'lucide-react'
import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useProfile } from '../hooks/useProfile'

const mockActivityData = [
  { day: 'Mon', queries: 2, actions: 1 },
  { day: 'Tue', queries: 4, actions: 2 },
  { day: 'Wed', queries: 3, actions: 3 },
  { day: 'Thu', queries: 5, actions: 2 },
  { day: 'Fri', queries: 6, actions: 4 },
  { day: 'Sat', queries: 4, actions: 3 },
  { day: 'Sun', queries: 7, actions: 5 },
]

const availableGoals = [
  { id: 'reduce_plastic', label: 'Reduce Single-Use Plastic', icon: '🛍️' },
  { id: 'save_energy', label: 'Cut Household Electricity', icon: '⚡' },
  { id: 'save_water', label: 'Conserve Freshwater', icon: '💧' },
  { id: 'sustainable_commute', label: 'Use Active / Public Transit', icon: '🚲' },
  { id: 'zero_food_waste', label: 'Minimize Food Waste', icon: '🥗' },
  { id: 'proper_recycling', label: 'Segregate All Household Waste', icon: '♻️' },
]

export default function DashboardPage() {
  const { profile, updateProfile, toggleGoal, saved } = useProfile()
  const [locationInput, setLocationInput] = useState(profile.location)
  const [userType, setUserType] = useState(profile.user_type)
  const [travelPref, setTravelPref] = useState(profile.travel_preference)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({
      location: locationInput,
      user_type: userType as any,
      travel_preference: travelPref,
    })
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Personal Sustainability Dashboard</h2>
        <p className="text-sm text-slate-400">
          Track your sustainability journey, set personalized goals, and configure local preferences.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0a1a1e] border border-white/8 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Active Goals</span>
            <Target size={16} className="text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{profile.goals.length} / {availableGoals.length}</div>
          <p className="text-[11px] text-green-400/80 mt-1">Target areas focused</p>
        </div>

        <div className="bg-[#0a1a1e] border border-white/8 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Actions Completed</span>
            <CheckCircle2 size={16} className="text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white">20</div>
          <p className="text-[11px] text-green-400/80 mt-1">Tracked habit completions</p>
        </div>

        <div className="bg-[#0a1a1e] border border-white/8 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Daily Streak</span>
            <Flame size={16} className="text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-white">5 Days</div>
          <p className="text-[11px] text-orange-400/80 mt-1">Eco habit formation</p>
        </div>

        <div className="bg-[#0a1a1e] border border-white/8 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Primary SDG</span>
            <Award size={16} className="text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-green-400">SDG 12</div>
          <p className="text-[11px] text-slate-400 mt-1">Responsible Consumption</p>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-[#0a1a1e] border border-white/8 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Weekly Activity Trend</h3>
            <p className="text-xs text-slate-500">Eco Agent inquiries & completed daily actions</p>
          </div>
          <span className="text-[10px] bg-green-900/30 text-green-300 border border-green-700/25 rounded-full px-2.5 py-1">
            Activity Analytics
          </span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockActivityData}>
              <defs>
                <linearGradient id="colorActions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0a1a1e', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="actions" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorActions)" name="Actions Done" />
              <Area type="monotone" dataKey="queries" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorQueries)" name="RAG Inquiries" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sustainability Goals Selector */}
        <div className="bg-[#0a1a1e] border border-white/8 rounded-2xl p-5">
          <h3 className="text-base font-semibold text-white mb-2">My Sustainability Goals</h3>
          <p className="text-xs text-slate-400 mb-4">
            Select the areas you want to prioritize. The Eco Agent customizes suggested actions to your focus.
          </p>
          <div className="space-y-2.5">
            {availableGoals.map((goal) => {
              const active = profile.goals.includes(goal.id)
              return (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  type="button"
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    active
                      ? 'bg-green-950/40 border-green-600/50 text-white'
                      : 'bg-[#060f12] border-white/5 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <span className="flex items-center gap-3 text-sm">
                    <span>{goal.icon}</span>
                    <span className={active ? 'font-medium text-green-200' : ''}>{goal.label}</span>
                  </span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    active ? 'bg-green-600 border-green-500 text-white' : 'border-slate-700'
                  }`}>
                    {active && <CheckCircle2 size={12} />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Optional User Profile */}
        <div className="bg-[#0a1a1e] border border-white/8 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-white">Optional Profile</h3>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Privacy First</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Personalization is strictly optional. All data is saved locally in your browser storage and never sent to third parties.
          </p>

          <form onSubmit={handleSaveProfile} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin size={12} className="text-green-400" />
                Default City / Region
              </label>
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="e.g. Kurnool, Andhra Pradesh"
                className="w-full bg-[#060f12] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-green-600"
              />
              <p className="text-[10px] text-slate-500 mt-1">Helps RAG prioritize local recycling rules and municipal schemes.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <User size={12} className="text-green-400" />
                User Persona
              </label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value as any)}
                className="w-full bg-[#060f12] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-green-600"
              >
                <option value="">Select Persona (Optional)</option>
                <option value="Student">Student (Budget conscious, shared living)</option>
                <option value="Household">Household / Family (Waste sorting, energy bills)</option>
                <option value="Working Professional">Working Professional (Commute, convenience)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Zap size={12} className="text-green-400" />
                Primary Commute Mode
              </label>
              <input
                type="text"
                value={travelPref}
                onChange={(e) => setTravelPref(e.target.value)}
                placeholder="e.g. Bus, Bicycle, Walking, Metro"
                className="w-full bg-[#060f12] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-green-600"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-medium px-4 py-2 rounded-xl transition-colors text-xs"
              >
                <Save size={13} />
                Save Preferences
              </button>
              {saved && <span className="text-xs text-green-400">Preferences updated!</span>}
            </div>
          </form>
        </div>
      </div>

      {/* Relevant Government Programmes */}
      <div className="bg-[#0a1a1e] border border-white/8 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-white">Relevant Government Programmes & Portals</h3>
            <p className="text-xs text-slate-400">
              Verified public initiatives for students, youth, households, farmers, and clean energy adoption.
            </p>
          </div>
          <span className="text-[10px] bg-green-900/40 text-green-300 border border-green-700/30 rounded-full px-2.5 py-1 font-medium">
            100% Official Portals
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Prime Minister Internship Scheme',
              org: 'Ministry of Corporate Affairs',
              target: 'Students & Youth (21-24 yrs)',
              summary: '12-month internships in top 500 companies with ₹5,000 monthly stipend and ₹6,000 one-time incidentals.',
              url: 'https://pminternship.mca.gov.in/login/',
            },
            {
              title: 'PM Surya Ghar: Muft Bijli Yojana',
              org: 'Ministry of New & Renewable Energy',
              target: 'Residential Households',
              summary: 'Direct capital subsidies up to ₹78,000 for rooftop solar installation, yielding up to 300 free units monthly.',
              url: 'https://pmsuryaghar.gov.in/',
            },
            {
              title: 'AICTE Internship & Scholarships',
              org: 'All India Council for Technical Education',
              target: 'Technical Students',
              summary: 'Pragati (girls), Saksham (specially-abled), and Swanath scholarships plus curated industry internships.',
              url: 'https://internship.aicte-india.org/',
            },
            {
              title: 'PM-KISAN & Farmer Initiatives',
              org: 'Ministry of Agriculture & Farmers Welfare',
              target: 'Farmers & Agritech',
              summary: 'Direct income support of ₹6,000/yr, subsidized solar irrigation (PM-KUSUM), and micro-irrigation grants.',
              url: 'https://pmkisan.gov.in/',
            },
            {
              title: 'National Career Service (NCS)',
              org: 'Ministry of Labour & Employment',
              target: 'Jobseekers & Youth',
              summary: 'Free job matching, career counselling, apprenticeships, and local employment exchange registration.',
              url: 'https://www.ncs.gov.in/',
            },
            {
              title: 'MyScheme Citizen Gateway',
              org: 'National e-Governance Division (NeGD)',
              target: 'All Citizens',
              summary: 'Single-window discovery platform to check eligibility and apply for over 700+ Central and State schemes.',
              url: 'https://www.myscheme.gov.in/',
            },
          ].map((prog, idx) => (
            <div key={idx} className="bg-[#060f12] border border-white/5 rounded-xl p-4 flex flex-col justify-between hover:border-green-600/40 transition-all">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[9px] bg-green-950 text-green-300 border border-green-800/40 rounded px-1.5 py-0.5 font-medium">
                    Verified
                  </span>
                  <span className="text-[10px] bg-blue-950/60 text-blue-300 border border-blue-700/30 rounded-full px-2 py-0.5 truncate">
                    {prog.target}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white leading-snug">{prog.title}</h4>
                <p className="text-xs text-green-200/80 font-medium mt-0.5">{prog.org}</p>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{prog.summary}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5">
                <a
                  href={prog.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-green-400 hover:text-green-300 bg-green-950/40 hover:bg-green-900/40 border border-green-700/40 py-2 rounded-lg transition-colors"
                >
                  <span>Visit Official Portal</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

