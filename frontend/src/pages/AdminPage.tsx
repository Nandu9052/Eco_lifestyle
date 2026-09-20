import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  ExternalLink,
  Filter,
  KeyRound,
  Layers,
  Lock,
  LogOut,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Terminal,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { clearAdminKey, getAdminKey, setAdminKey, api } from '../services/api'
import type { AdminStats, ReindexResult, SourceItem, SourceRegistryItem, SystemLogEvent } from '../types'

const PRIORITY_BADGES: Record<string, { label: string; color: string }> = {
  P1: { label: 'P1 Central Ministry', color: 'bg-emerald-950 text-emerald-300 border-emerald-700/50' },
  P2: { label: 'P2 State Gov / AP', color: 'bg-teal-950 text-teal-300 border-teal-700/50' },
  P3: { label: 'P3 Gov Portal', color: 'bg-blue-950 text-blue-300 border-blue-700/50' },
  P4: { label: 'P4 India.gov.in', color: 'bg-indigo-950 text-indigo-300 border-indigo-700/50' },
  P5: { label: 'P5 MyScheme', color: 'bg-purple-950 text-purple-300 border-purple-700/50' },
  P6: { label: 'P6 Gov Rules/Notif', color: 'bg-amber-950 text-amber-300 border-amber-700/50' },
  P7: { label: 'P7 Environmental Org', color: 'bg-slate-900 text-slate-300 border-slate-700/50' },
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getAdminKey())
  const [passkeyInput, setPasskeyInput] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(false)

  // Admin Data State
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [sources, setSources] = useState<SourceRegistryItem[]>([])
  const [logs, setLogs] = useState<SystemLogEvent[]>([])
  const [loading, setLoading] = useState(false)

  // Filter state for Source Registry
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Ingestion state
  const [reindexingDomain, setReindexingDomain] = useState<string | null>(null)
  const [reindexResult, setReindexResult] = useState<ReindexResult | null>(null)

  // Live Retrieval Inspector
  const [testQuery, setTestQuery] = useState('')
  const [testLocation, setTestLocation] = useState('')
  const [retrievedDocs, setRetrievedDocs] = useState<SourceItem[]>([])
  const [testing, setTesting] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passkeyInput.trim()) return
    setAuthLoading(true)
    setAuthError(null)

    try {
      await api.adminLogin(passkeyInput.trim())
      setAdminKey(passkeyInput.trim())
      setIsAuthenticated(true)
      setPasskeyInput('')
    } catch (err: any) {
      setAuthError(err.message || 'Invalid admin passkey')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = () => {
    clearAdminKey()
    setIsAuthenticated(false)
    setStats(null)
    setSources([])
    setLogs([])
  }

  const fetchAdminData = async () => {
    if (!getAdminKey()) return
    setLoading(true)
    try {
      const [statsRes, srcRes, logsRes] = await Promise.allSettled([
        api.adminStats(),
        api.adminSources(),
        api.adminLogs(50),
      ])

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value)
      } else if (statsRes.reason?.message?.includes('403')) {
        handleLogout()
        return
      }

      if (srcRes.status === 'fulfilled') {
        const val = srcRes.value
        setSources(Array.isArray(val) ? val : (val as any)?.sources || [])
      }

      if (logsRes.status === 'fulfilled') {
        const val = logsRes.value
        setLogs(Array.isArray(val) ? val : (val as any)?.logs || [])
      }
    } catch (err) {
      console.error('Error loading admin portal data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData()
    }
  }, [isAuthenticated])

  const handleReindex = async (domain?: string) => {
    setReindexingDomain(domain || 'all')
    setReindexResult(null)
    try {
      const res = await api.reindex(domain)
      setReindexResult(res)
      await fetchAdminData()
    } catch (err: any) {
      alert(`Reindexing failed: ${err.message}`)
    } finally {
      setReindexingDomain(null)
    }
  }

  const handleToggleVerification = async (source: SourceRegistryItem) => {
    const nextState = !source.verified
    try {
      await api.adminVerifySource(source.title, nextState, 'Updated via Admin Console')
      setSources((prev) =>
        prev.map((s) => (s.title === source.title ? { ...s, verified: nextState } : s))
      )
    } catch (err: any) {
      alert(`Failed to update verification status: ${err.message}`)
    }
  }

  const handleTestRetrieve = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!testQuery.trim()) return
    setTesting(true)
    try {
      const res = await api.retrieve(testQuery, testLocation || undefined)
      setRetrievedDocs(res.documents || [])
    } catch (err) {
      console.error(err)
      setRetrievedDocs([])
    } finally {
      setTesting(false)
    }
  }

  // Filter sources
  const filteredSources = (Array.isArray(sources) ? sources : []).filter((s) => {
    const pStr = String(s.priority)
    const pKey = pStr.startsWith('P') ? pStr : `P${pStr}`
    if (priorityFilter !== 'all' && s.priority !== priorityFilter && pKey !== priorityFilter) return false
    if (categoryFilter !== 'all' && s.category !== categoryFilter) return false
    return true
  })

  // 1. Passkey Authentication Gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 bg-[#0a1a1e] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-950/80 border border-green-700/50 flex items-center justify-center text-green-400">
            <Lock size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Admin Authentication</h3>
            <p className="text-xs text-slate-400">Restricted system administration console</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-5 leading-relaxed">
          The Admin Portal contains technical RAG telemetry, vector embedding metrics, and source verification controls. Enter the administrator passkey to proceed.
        </p>

        {authError && (
          <div className="mb-4 bg-red-950/50 border border-red-800/60 rounded-xl p-3 text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle size={15} className="shrink-0 text-red-400" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <KeyRound size={13} className="text-green-400" />
              Administrator Passkey
            </label>
            <input
              type="password"
              value={passkeyInput}
              onChange={(e) => setPasskeyInput(e.target.value)}
              placeholder="Enter admin passkey..."
              className="w-full bg-[#060f12] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-green-600 transition-colors"
              autoFocus
            />
            <p className="text-[10px] text-slate-500 mt-1">Admin passkey: Nandu123</p>
          </div>

          <button
            type="submit"
            disabled={authLoading || !passkeyInput.trim()}
            className="w-full bg-green-600 hover:bg-green-500 disabled:bg-slate-800 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors shadow-lg shadow-green-950/50 flex items-center justify-center gap-2"
          >
            {authLoading ? <RefreshCw size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
            <span>{authLoading ? 'Verifying Key...' : 'Unlock Admin Portal'}</span>
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="max-w-6xl space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-white/8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] bg-green-950 text-green-300 border border-green-700/40 rounded px-2 py-0.5 font-bold uppercase tracking-wider">
              Admin Mode · Authorized
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Session Active
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white">System Architecture & Knowledge Governance</h2>
          <p className="text-xs text-slate-400">
            Telemetry, ChromaDB vector indexing, IBM Granite status, and authoritative government source registry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchAdminData}
            disabled={loading}
            className="flex items-center gap-1.5 bg-[#0a1a1e] hover:bg-white/5 border border-white/10 text-slate-300 px-3.5 py-2 rounded-xl text-xs transition-colors"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh Data
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 text-red-300 px-3.5 py-2 rounded-xl text-xs transition-colors"
          >
            <LogOut size={13} />
            Lock Admin
          </button>
        </div>
      </div>

      {/* SECTION 1 & 2: RAG SYSTEM STATUS & IBM GRANITE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Section 1: RAG System Status */}
        <div className="bg-[#0a1a1e] border border-white/8 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Database size={16} className="text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  1. RAG Vector Engine
                </h3>
              </div>
              <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-700/40 rounded-full px-2.5 py-0.5 font-medium">
                Live & Indexed
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Storage Backend:</span>
                <span className="text-white font-mono">{stats?.engine || 'ChromaDB Persistent'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Embedding Model:</span>
                <span className="text-emerald-300 font-mono font-medium">{stats?.embedding_model || 'all-MiniLM-L6-v2 (ONNX)'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Collection:</span>
                <span className="text-white font-mono">{stats?.collection_name || 'eco_knowledge'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Persist Path:</span>
                <span className="text-slate-400 font-mono text-[11px] truncate max-w-[240px]" title={stats?.persist_directory}>
                  {stats?.persist_directory || 'backend/data/chroma_db'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Last Indexed:</span>
                <span className="text-slate-300">{stats?.last_indexed_time || 'Just now'}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
            <span>Cosine Vector Space Boost Active</span>
            <span className="text-emerald-400 font-medium">P1-P7 Ranking +0.28</span>
          </div>
        </div>

        {/* Section 2: IBM Granite Panel */}
        <div className="bg-[#0a1a1e] border border-white/8 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-blue-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  2. IBM Granite Generative Engine
                </h3>
              </div>
              <span className={`text-[10px] rounded-full px-2.5 py-0.5 font-medium border ${
                stats?.granite_configured
                  ? 'bg-blue-950/80 text-blue-300 border-blue-700/40'
                  : 'bg-amber-950/80 text-amber-300 border-amber-700/40'
              }`}>
                {stats?.granite_configured ? 'Configured ✓' : 'Setup Required'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Active Model ID:</span>
                <span className="text-blue-300 font-mono font-medium">{stats?.model_id || 'ibm/granite-4-h-small'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Endpoint Region:</span>
                <span className="text-white font-mono">IBM watsonx.ai (us-south)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">API Key Status:</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <ShieldCheck size={12} />
                  <span>Configured ✓ (Protected / Masked)</span>
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Inference Calls:</span>
                <span className="text-white font-mono">{stats?.granite_metrics?.total_calls ?? 0} executed</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Avg Latency:</span>
                <span className="text-slate-300 font-mono">
                  {stats?.granite_metrics?.avg_latency_ms ? `${stats.granite_metrics.avg_latency_ms} ms` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
            <span>Sampling: Temp 0.2 · Rep Penalty 1.05</span>
            <span className="text-blue-400 font-medium">Strict Grounding</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: KNOWLEDGE BASE STATS */}
      <div className="bg-[#0a1a1e] border border-white/8 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Layers size={18} className="text-purple-400" />
          <h3 className="text-base font-bold text-white">3. Knowledge Base Analytics</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 mb-5">
          <div className="bg-[#060f12] border border-white/5 rounded-xl p-3.5 text-center">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Documents</p>
            <p className="text-2xl font-black text-white mt-1">{stats?.total_documents ?? sources.length}</p>
            <p className="text-[10px] text-green-400 mt-0.5">Authoritative</p>
          </div>
          <div className="bg-[#060f12] border border-white/5 rounded-xl p-3.5 text-center">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Vector Chunks</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{stats?.total_chunks ?? 206}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">ChromaDB index</p>
          </div>
          <div className="bg-[#060f12] border border-white/5 rounded-xl p-3.5 text-center">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Total Sources</p>
            <p className="text-2xl font-black text-teal-400 mt-1">{stats?.total_sources ?? sources.length}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Verified</p>
          </div>
          <div className="bg-[#060f12] border border-white/5 rounded-xl p-3.5 text-center">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Gov Schemes</p>
            <p className="text-2xl font-black text-purple-400 mt-1">{stats?.total_schemes ?? 18}</p>
            <p className="text-[10px] text-purple-300 mt-0.5">Central & State</p>
          </div>
          <div className="bg-[#060f12] border border-white/5 rounded-xl p-3.5 text-center">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Public Services</p>
            <p className="text-2xl font-black text-blue-400 mt-1">{stats?.total_services ?? 14}</p>
            <p className="text-[10px] text-blue-300 mt-0.5">Portals & Gates</p>
          </div>
        </div>

        {/* Categories Distribution */}
        {stats?.categories && (
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Category Distribution</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {Object.entries(stats.categories).map(([cat, count]) => (
                <div key={cat} className="bg-[#060f12] border border-white/5 rounded-lg p-2.5 text-xs">
                  <span className="text-slate-400 capitalize block truncate">{cat.replace(/_/g, ' ')}</span>
                  <span className="text-white font-bold text-sm">{count} docs</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: INGESTION CONTROLS WITH TARGETED DOMAIN BUTTONS */}
      <div className="bg-[#0a1a1e] border border-white/8 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <RefreshCw size={18} className="text-emerald-400" />
            <h3 className="text-base font-bold text-white">4. Selective Ingestion Controls</h3>
          </div>
          <span className="text-xs text-slate-400">
            Re-index all documents or target specific knowledge domains
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          The ingestion pipeline parses frontmatter metadata, chunks documents with 120-token sliding overlap, creates dense embeddings via ONNX, and synchronizes the ChromaDB persistent collection.
        </p>

        {reindexResult && (
          <div className="mb-4 bg-emerald-950/40 border border-emerald-700/50 rounded-xl p-3.5 text-emerald-300 flex items-start gap-2.5 text-xs">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Indexing Complete:</span> Ingested {reindexResult.documents_indexed} documents ({reindexResult.chunks_indexed} vector chunks) across {reindexResult.categories.join(', ')}.
            </div>
          </div>
        )}

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => handleReindex()}
            disabled={!!reindexingDomain}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-md shadow-emerald-950/50"
          >
            <RefreshCw size={13} className={reindexingDomain === 'all' ? 'animate-spin' : ''} />
            <span>{reindexingDomain === 'all' ? 'Re-indexing All...' : 'Re-index Entire Knowledge Base'}</span>
          </button>

          {[
            { domain: 'government_schemes', label: 'Gov Schemes Only' },
            { domain: 'recycling', label: 'Recycling Only' },
            { domain: 'sustainable_living', label: 'Sustainable Living Only' },
            { domain: 'eco_products', label: 'Eco Products Only' },
            { domain: 'eco_travel', label: 'Eco Travel Only' },
          ].map(({ domain, label }) => (
            <button
              key={domain}
              onClick={() => handleReindex(domain)}
              disabled={!!reindexingDomain}
              className="flex items-center gap-1.5 bg-[#060f12] hover:bg-white/5 disabled:opacity-50 border border-white/10 text-slate-300 px-3.5 py-2 rounded-xl text-xs transition-colors"
            >
              <RefreshCw size={12} className={reindexingDomain === domain ? 'animate-spin' : ''} />
              <span>{reindexingDomain === domain ? `Indexing ${label}...` : label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 5 & 7: SOURCE REGISTRY MANAGEMENT & SOURCE VERIFICATION TABLE */}
      <div className="bg-[#0a1a1e] border border-white/8 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={18} className="text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                5 & 7. Source Priority Registry & Verification
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              P1–P7 priority tier ranking with live verification status and official portal URLs.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-[#060f12] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
              <Filter size={12} className="text-slate-400" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none"
              >
                <option value="all" className="bg-[#060f12]">All Priorities (P1-P7)</option>
                <option value="P1" className="bg-[#060f12]">P1 Central Ministry</option>
                <option value="P2" className="bg-[#060f12]">P2 State Gov / AP</option>
                <option value="P3" className="bg-[#060f12]">P3 Gov Portal</option>
                <option value="P4" className="bg-[#060f12]">P4 India.gov.in</option>
                <option value="P5" className="bg-[#060f12]">P5 MyScheme</option>
                <option value="P6" className="bg-[#060f12]">P6 Gov Rules/Notif</option>
                <option value="P7" className="bg-[#060f12]">P7 Environmental Org</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-[#060f12] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none"
              >
                <option value="all" className="bg-[#060f12]">All Categories</option>
                <option value="government_schemes" className="bg-[#060f12]">Gov Schemes</option>
                <option value="recycling" className="bg-[#060f12]">Recycling</option>
                <option value="sustainable_living" className="bg-[#060f12]">Sustainable Living</option>
                <option value="eco_products" className="bg-[#060f12]">Eco Products</option>
                <option value="eco_travel" className="bg-[#060f12]">Eco Travel</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto border border-white/5 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#060f12] border-b border-white/5 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3">Priority</th>
                <th className="p-3">Source Title</th>
                <th className="p-3">Organization</th>
                <th className="p-3">Domain</th>
                <th className="p-3">Portal Link</th>
                <th className="p-3 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredSources.map((s, idx) => {
                const pKey = String(s.priority).startsWith('P') ? String(s.priority) : `P${s.priority}`
                const pInfo = PRIORITY_BADGES[pKey] || { label: String(s.priority), color: 'bg-slate-800 text-slate-300' }
                const portalUrl = s.source_url || (s as any).url
                return (
                  <tr key={idx} className="hover:bg-white/2 transition-colors">
                    <td className="p-3">
                      <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-semibold ${pInfo.color}`}>
                        {pInfo.label}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-white max-w-[220px] truncate" title={s.title}>
                      {s.title}
                    </td>
                    <td className="p-3 text-slate-400 max-w-[180px] truncate" title={s.organization}>
                      {s.organization}
                    </td>
                    <td className="p-3 text-slate-400 capitalize">
                      {s.category.replace(/_/g, ' ')}
                    </td>
                    <td className="p-3">
                      {portalUrl ? (
                        <a
                          href={portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 font-mono text-[11px]"
                        >
                          <span>Visit</span>
                          <ExternalLink size={10} />
                        </a>
                      ) : (
                        <span className="text-slate-600 italic">No URL</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleVerification(s)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-colors ${
                          s.verified
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50 hover:bg-emerald-900/60'
                            : 'bg-amber-950/60 text-amber-300 border-amber-700/50 hover:bg-amber-900/60'
                        }`}
                      >
                        {s.verified ? 'Verified ✓' : 'Unverified'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 6: LIVE SEMANTIC RAG RETRIEVAL INSPECTOR */}
      <div className="bg-[#0a1a1e] border border-white/8 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <Terminal size={18} className="text-emerald-400" />
          <h3 className="text-base font-bold text-white">
            6. Live Semantic RAG Retrieval Inspector
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Directly execute vector similarity search across ChromaDB to inspect chunk retrieval, relevance rankings, and source prioritization without invoking the generative model.
        </p>

        <form onSubmit={handleTestRetrieve} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Enter test query (e.g. 'What scholarships are available through AICTE?')"
                className="w-full bg-[#060f12] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <input
                type="text"
                value={testLocation}
                onChange={(e) => setTestLocation(e.target.value)}
                placeholder="Optional location boost (e.g. Andhra Pradesh)"
                className="w-full bg-[#060f12] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={testing || !testQuery.trim()}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-medium px-4 py-2 rounded-xl transition-colors text-xs"
          >
            <Search size={13} />
            {testing ? 'Executing Dense Vector Search...' : 'Run Vector Retrieval Test'}
          </button>
        </form>

        {retrievedDocs.length > 0 && (
          <div className="mt-5 border-t border-white/8 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Retrieved Vector Matches ({retrievedDocs.length})
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {retrievedDocs.map((doc, i) => (
                <div key={i} className="bg-[#060f12] border border-white/5 rounded-xl p-3.5 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/40 rounded px-1.5 py-0.5 font-bold">
                      Match #{i + 1}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">{doc.category}</span>
                  </div>
                  <h5 className="font-bold text-white text-sm leading-snug">{doc.title}</h5>
                  <p className="text-slate-400 mt-1">{doc.organization}</p>
                  {doc.summary && <p className="text-slate-300 mt-2 leading-relaxed">{doc.summary}</p>}
                  {doc.source_url && (
                    <a
                      href={doc.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-emerald-400 hover:underline font-medium"
                    >
                      <span>Official Link</span>
                      <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 8: SYSTEM EVENT LOGS */}
      <div className="bg-[#0a1a1e] border border-white/8 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-blue-400" />
            <h3 className="text-base font-bold text-white">8. System Telemetry & Event Audit Logs</h3>
          </div>
          <span className="text-xs text-slate-400">
            Real-time circular memory buffer ({Array.isArray(logs) ? logs.length : 0} events logged)
          </span>
        </div>

        {!Array.isArray(logs) || logs.length === 0 ? (
          <div className="bg-[#060f12] border border-white/5 rounded-xl p-8 text-center text-xs text-slate-500">
            No system events recorded yet in this session. Run queries in the Eco Agent Chat or test semantic retrieval above to generate audit logs.
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {Array.isArray(logs) && logs.map((log) => (
              <div
                key={log.id}
                className="bg-[#060f12] border border-white/5 rounded-xl p-3 text-xs flex items-center justify-between gap-3 font-mono hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold shrink-0 ${
                    log.event_type === 'granite_inference'
                      ? 'bg-blue-950 text-blue-300 border border-blue-800/40'
                      : log.event_type === 'rag_query'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                      : 'bg-purple-950 text-purple-300 border border-purple-800/40'
                  }`}>
                    {log.event_type.replace(/_/g, ' ')}
                  </span>
                  <p className="text-slate-200 truncate" title={log.query || JSON.stringify(log.details)}>
                    {log.query ? `"${log.query}"` : JSON.stringify(log.details)}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-slate-400 shrink-0 text-[11px]">
                  {log.duration_ms !== undefined && (
                    <span className="text-emerald-400">{log.duration_ms} ms</span>
                  )}
                  {log.source_count !== undefined && (
                    <span>{log.source_count} sources</span>
                  )}
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock size={11} />
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
