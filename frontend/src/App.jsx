import React, { useState } from 'react'
import LandingPage from './components/LandingPage.jsx'
import ProtocolDashboard from './components/ProtocolDashboard.jsx'

export default function App() {
  const [currentView, setCurrentView] = useState('landing') // 'landing' | 'dashboard'

  return (
    <div>
      {currentView === 'landing' ? (
        <LandingPage onOpenDashboard={() => setCurrentView('dashboard')} />
      ) : (
        <ProtocolDashboard onBackToLanding={() => setCurrentView('landing')} />
      )}
    </div>
  )
}
