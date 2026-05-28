'use client'

import { useState } from 'react'
import { Awakening } from '@/lib/supabase'
import LogAwakeningModal from './LogAwakeningModal'
import CaptainsLog from './CaptainsLog'

interface ChronicleClientProps {
  legendId: string
  spiritName: string
  color: string
  awakenings: Awakening[] | null
}

export default function ChronicleClient({
  legendId,
  spiritName,
  color,
  awakenings = [],
}: ChronicleClientProps) {
  const [showLogModal, setShowLogModal] = useState(false)
  const [logEntries, setLogEntries] = useState<Awakening[]>(awakenings || [])

  const handleSaveLog = () => {
    setShowLogModal(false)
    // Refresh the page to show new entry
    window.location.reload()
  }

  return (
    <>
      {/* Captain's Log Section */}
      <hr className="divider" />
      <CaptainsLog
        awakenings={logEntries}
        color={color}
        onOpenLog={() => setShowLogModal(true)}
      />

      {/* Log Modal */}
      {showLogModal && (
        <LogAwakeningModal
          legendId={legendId}
          spiritName={spiritName}
          color={color}
          onClose={() => setShowLogModal(false)}
          onSave={handleSaveLog}
        />
      )}
    </>
  )
}
