import { useCallback, useEffect, useState } from 'react'
import type { UserProfile } from '../types'

const STORAGE_KEY = 'eco-agent-profile'

const defaultProfile: UserProfile = {
  location: '',
  user_type: '',
  goals: [],
  travel_preference: '',
  lifestyle_preference: '',
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? (JSON.parse(stored) as UserProfile) : defaultProfile
    } catch {
      return defaultProfile
    }
  })

  const [saved, setSaved] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  }, [profile])

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [])

  const toggleGoal = useCallback((goal: string) => {
    setProfile((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }))
  }, [])

  const resetProfile = useCallback(() => {
    setProfile(defaultProfile)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return { profile, updateProfile, toggleGoal, resetProfile, saved }
}
