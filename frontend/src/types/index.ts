// Shared TypeScript types for Eco Lifestyle Agent

export interface ActionItem {
  title: string
  description: string
  why: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category?: string
}

export interface SourceItem {
  title: string
  category: string
  subcategory?: string
  target_group?: string
  source: string
  source_url?: string
  organization?: string
  date?: string
  last_verified?: string
  location?: string
  summary?: string
  verification_status?: string
}

export interface ChatResult {
  answer: string
  actions: ActionItem[]
  sources: SourceItem[]
  intent: string
  confidence: 'High' | 'Medium' | 'Low' | string
  model?: string
  retrieved_topics: string[]
  reason_for_recommendation: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  result?: ChatResult
  timestamp: Date
}

export interface TravelMode {
  mode: string
  icon: string
  best_for: string
  emission: string
  tips: string[]
  color: string
}

export interface TravelResponse {
  modes: TravelMode[]
  disclaimer: string
}

export interface DailyAction {
  title: string
  description: string
  why: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  done?: boolean
}

export interface UserProfile {
  location: string
  user_type: 'Student' | 'Household' | 'Working Professional' | ''
  goals: string[]
  travel_preference: string
  lifestyle_preference: string
}

export type Intent =
  | 'SUSTAINABLE_LIVING'
  | 'ECO_PRODUCTS'
  | 'RECYCLING'
  | 'GOVERNMENT_SCHEMES'
  | 'ECO_TRAVEL'
  | 'ENERGY'
  | 'WATER'
  | 'FOOD_WASTE'
  | 'GENERAL_SUSTAINABILITY'

export const INTENT_LABELS: Record<string, string> = {
  SUSTAINABLE_LIVING: 'Sustainable Living',
  ECO_PRODUCTS: 'Eco Products',
  RECYCLING: 'Recycling',
  GOVERNMENT_SCHEMES: 'Government Schemes',
  ECO_TRAVEL: 'Eco Travel',
  ENERGY: 'Energy Saving',
  WATER: 'Water Conservation',
  FOOD_WASTE: 'Food Waste',
  GENERAL_SUSTAINABILITY: 'General Sustainability',
}

export const INTENT_COLORS: Record<string, string> = {
  SUSTAINABLE_LIVING: 'bg-green-900/50 text-green-300 border-green-700/40',
  ECO_PRODUCTS: 'bg-teal-900/50 text-teal-300 border-teal-700/40',
  RECYCLING: 'bg-blue-900/50 text-blue-300 border-blue-700/40',
  GOVERNMENT_SCHEMES: 'bg-purple-900/50 text-purple-300 border-purple-700/40',
  ECO_TRAVEL: 'bg-cyan-900/50 text-cyan-300 border-cyan-700/40',
  ENERGY: 'bg-yellow-900/50 text-yellow-300 border-yellow-700/40',
  WATER: 'bg-sky-900/50 text-sky-300 border-sky-700/40',
  FOOD_WASTE: 'bg-orange-900/50 text-orange-300 border-orange-700/40',
  GENERAL_SUSTAINABILITY: 'bg-eco-900/50 text-eco-300 border-eco-700/40',
}

export const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: 'bg-green-900/40 text-green-300',
  Medium: 'bg-yellow-900/40 text-yellow-300',
  Hard: 'bg-red-900/40 text-red-300',
}

export interface AdminStats {
  engine: string
  embedding_model: string
  collection_name: string
  total_chunks: number
  total_documents: number
  total_sources?: number
  total_schemes?: number
  total_services?: number
  categories: Record<string, number>
  subcategories?: Record<string, number>
  persist_directory: string
  granite_configured: boolean
  model_id: string
  last_indexed_time?: string
  granite_metrics?: {
    total_calls: number
    avg_latency_ms: number
    error_count: number
  }
}

export interface SourceRegistryItem {
  priority: string
  source_type: string
  title: string
  organization: string
  source_url: string
  category: string
  subcategory: string
  location: string
  verified: boolean
}

export interface SystemLogEvent {
  id: string
  timestamp: string
  event_type: 'rag_query' | 'granite_inference' | 'index_event' | 'system_alert'
  query?: string
  duration_ms?: number
  source_count?: number
  model?: string
  tokens?: number
  details?: Record<string, any>
}

export interface ReindexResult {
  status: string
  documents_indexed: number
  chunks_indexed: number
  categories: string[]
  subcategories?: string[]
}
