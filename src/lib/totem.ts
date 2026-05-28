// QR Chronicle System - Totem Activation Management
// Handles persistent QR code activation state
// Architecture allows easy migration from localStorage to Supabase

export interface TotemActivation {
  activated: boolean
  activatedAt: number
}

const TOTEM_PREFIX = 'totem_'

// Check if totem has been previously activated
export function isTotemActivated(id: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    const stored = localStorage.getItem(`${TOTEM_PREFIX}${id}`)
    return stored ? JSON.parse(stored).activated === true : false
  } catch {
    return false
  }
}

// Record initial activation of a totem
export function activateTotem(id: string): void {
  if (typeof window === 'undefined') return
  try {
    const activation: TotemActivation = {
      activated: true,
      activatedAt: Date.now(),
    }
    localStorage.setItem(`${TOTEM_PREFIX}${id}`, JSON.stringify(activation))
  } catch {
    console.warn(`Failed to activate totem ${id}`)
  }
}

// Get activation details (for future extensions)
export function getTotemActivation(id: string): TotemActivation | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(`${TOTEM_PREFIX}${id}`)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

// Get all activated totems (for future extensions)
export function getAllActivatedTotems(): Record<string, TotemActivation> {
  if (typeof window === 'undefined') return {}
  try {
    const result: Record<string, TotemActivation> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(TOTEM_PREFIX)) {
        const id = key.substring(TOTEM_PREFIX.length)
        const activation = localStorage.getItem(key)
        if (activation) result[id] = JSON.parse(activation)
      }
    }
    return result
  } catch {
    return {}
  }
}
