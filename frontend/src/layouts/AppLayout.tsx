import {
  Bot,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Leaf,
  LineChart,
  MapPin,
  Menu,
  Recycle,
  ShieldCheck,
  Sparkles,
  Wand2,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { label: 'Home', path: '/', icon: Leaf },
  { label: 'Eco Agent', path: '/chat', icon: Bot },
  { label: 'Sustainable Living', path: '/sustainable', icon: Sparkles },
  { label: 'Recycling Guide', path: '/recycling', icon: Recycle },
  { label: 'Eco Products', path: '/products', icon: BriefcaseBusiness },
  { label: 'Gov. Schemes', path: '/schemes', icon: Building2 },
  { label: 'Eco Travel', path: '/travel', icon: MapPin },
  { label: 'Daily Actions', path: '/actions', icon: CheckCircle2 },
  { label: 'Dashboard', path: '/dashboard', icon: LineChart },
  { label: 'Responsible AI', path: '/responsible-ai', icon: ShieldCheck },
  { label: 'Admin', path: '/admin', icon: Wand2 },
]

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#070e11] border-r border-white/8 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="p-5 border-b border-white/8">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-green-950 font-black text-base shadow-lg">
              E
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-green-400 font-semibold">
                SDG 12 · Responsible Consumption
              </p>
              <h1 className="text-sm font-bold text-white leading-tight">Eco Lifestyle Agent</h1>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-green-900/40 text-green-200 font-medium border border-green-700/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/8">
          <p className="text-xs font-semibold text-green-400">Small actions. Big impact.</p>
          <p className="text-[10px] text-slate-500 mt-1">
            RAG-powered sustainability guidance
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 px-5 py-3 bg-[#060f12]/90 backdrop-blur-sm border-b border-white/8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-slate-200 transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-green-400 font-semibold hidden sm:block">
                Sustainability Intelligence
              </p>
              <h2 className="text-sm font-semibold text-slate-200">
                Grounded guidance for everyday living
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              RAG Active
            </span>
            <Link
              to="/chat"
              className="text-xs font-semibold bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Ask Agent
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
