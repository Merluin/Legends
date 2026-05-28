// QR Chronicle System - Legend Activation Management
// Handles persistent QR code activation state
// Architecture allows easy migration from localStorage to Supabase

export interface LegendActivation {
  activated: boolean
  activatedAt: number
}

const LEGEND_PREFIX = 'legend_'

// Check if legend has been previously activated
export function isLegendActivated(id: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    const stored = localStorage.getItem(`${LEGEND_PREFIX}${id}`)
    return stored ? JSON.parse(stored).activated === true : false
  } catch {
    return false
  }
}

// Record initial activation of a legend
export function activateLegend(id: string): void {
  if (typeof window === 'undefined') return
  try {
    const activation: LegendActivation = {
      activated: true,
      activatedAt: Date.now(),
    }
    localStorage.setItem(`${LEGEND_PREFIX}${id}`, JSON.stringify(activation))
  } catch {
    console.warn(`Failed to activate legend ${id}`)
  }
}

// Get activation details (for future extensions)
export function getLegendActivation(id: string): LegendActivation | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(`${LEGEND_PREFIX}${id}`)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

// Get all activated legends (for future extensions)
export function getAllActivatedLegends(): Record<string, LegendActivation> {
  if (typeof window === 'undefined') return {}
  try {
    const result: Record<string, LegendActivation> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(LEGEND_PREFIX)) {
        const id = key.substring(LEGEND_PREFIX.length)
        const activation = localStorage.getItem(key)
        if (activation) result[id] = JSON.parse(activation)
      }
    }
    return result
  } catch {
    return {}
  }
}
