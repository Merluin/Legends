import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type LegendTipo = 'primo' | 'colore' | 'gioco' | 'coppia'

export interface Legend {
  id: string
  nome: string
  tipo: LegendTipo
  creato: string
  creatore: string
  luogo_creazione: string
  possessore_attuale: string
  uid_nfc?: string
  autenticato: boolean
}

export interface Awakening {
  id: string
  legend_id: string
  tipo: 'creazione' | 'passaggio'
  da?: string
  a: string
  gioco?: string
  num_giocatori?: number
  luogo: string
  note?: string
  created_at: string
}

export const PRIVILEGI = {
  primo:  { nome: 'Legend of the First',  label: 'FIRST',  color: '#D4A843', desc: 'The Keeper decides who opens the game — but only if the Legend is brought into play.' },
  colore: { nome: 'Legend of the Colour', label: 'COLOUR', color: '#9B7FD4', desc: 'The Keeper chooses their colour or faction — but only if the Legend is brought into play.' },
  gioco:  { nome: 'Legend of the Game',   label: 'GAME',   color: '#6BB89B', desc: 'The Keeper chooses the game of the evening — but only if the Legend is brought into play.' },
  coppia: { nome: 'Legend of the Bond',   label: 'BOND',   color: '#D48B9B', desc: 'The Keeper chooses their partner — but only if the Legend is brought into play.' },
}
