import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, Shield, Phone, Lock, Unlock, Users, Plus, Key, 
  ArrowRight, Sparkles, CheckCircle2, AlertTriangle, Globe, Star, Eye, EyeOff
} from 'lucide-react'

export default function LandingPage({ onOpenDashboard }) {
  const [activeStep, setActiveStep] = useState(0)
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [signUpName, setSignUpName] = useState("Abena Osei")
  const [signUpPhone, setSignUpPhone] = useState("0245667788")
  const [signUpPassword, setSignUpPassword] = useState("1234")
  const [confirmPassword, setConfirmPassword] = useState("1234")
  const [showPassword, setShowPassword] = useState(false)

  // Carrier Detection
  const getCarrierBadge = (phoneStr) => {
    const clean = phoneStr.replace(/\D/g, '')
    if (clean.startsWith("024") || clean.startsWith("054") || clean.startsWith("055") || clean.startsWith("059") || clean.startsWith("23324")) {
      return { name: "MTN MoMo", color: "#F59E0B", bg: "#FEF3C7" }
    }
    if (clean.startsWith("020") || clean.startsWith("050") || clean.startsWith("23320")) {
      return { name: "Telecel Cash", color: "#EF4444", bg: "#FEE2E2" }
    }
    if (clean.startsWith("027") || clean.startsWith("057") || clean.startsWith("23327")) {
      return { name: "AT Money", color: "#3B82F6", bg: "#DBEAFE" }
    }
    return { name: "Ghana MoMo", color: "var(--indigo-primary)", bg: "#EEF2FF" }
  }

  const carrier = getCarrierBadge(signUpPhone)

  const handleSignupSubmit = () => {
    if (!signUpName.trim()) {
      alert("Please enter your Full Name")
      return
    }
    if (!signUpPhone.trim() || signUpPhone.length < 9) {
      alert("Please enter a valid Ghana Mobile Phone Number")
      return
    }
    if (signUpPassword.length < 4) {
      alert("Password/PIN must be at least 4 digits")
      return
    }
    if (signUpPassword !== confirmPassword) {
      alert("Passwords/PINs do not match!")
      return
    }

    const initials = signUpName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    const formattedPhone = signUpPhone.startsWith("+233") ? signUpPhone : `+233 ${signUpPhone.startsWith("0") ? signUpPhone.substring(1) : signUpPhone}`
    
    const userProfile = {
      name: signUpName,
      phone: formattedPhone,
      initials: initials || "AO",
      password: signUpPassword,
      carrier: carrier.name
    }

    localStorage.setItem("chainsusu_user_profile", JSON.stringify(userProfile))
    if (!localStorage.getItem("chainsusu_user_groups")) {
      localStorage.setItem("chainsusu_user_groups", JSON.stringify([0]))
    }
    setIsSignupOpen(false)
    onOpenDashboard()
  }

  const protocolSteps = [
    {
      step: "01",
      icon: Phone,
      title: "Mobile Money Deposit",
      desc: "Pay your Susu contribution sharp sharp using MTN MoMo, Telecel Cash, or AT Money. No bank story required.",
      detail: "Direct MoMo API bridge to smart contract escrow.",
      notificationTitle: "MoMo Deposit Confirmed Sharp",
      notificationBody: "Kwesi Appiah sent GHS 500 into group pot."
    },
    {
      step: "02",
      icon: Lock,
      title: "Solidity Escrow Lock",
      desc: "Your money hold tight inside smart contract on Ethereum. Zero human custody, no collector fit run away.",
      detail: "Verified smart contract: 0x5FbDB2315678afecb367f032d93F642f64180aa3.",
      notificationTitle: "Smart Contract Escrow Active",
      notificationBody: "GHS 1,000 locked safe inside zero-risk escrow."
    },
    {
      step: "03",
      icon: Star,
      title: "On-Chain Trust Score Engine",
      desc: "Every time you pay on time, your trust score upgrade on-chain (0 to 100). Everyone see say you be reliable.",
      detail: "Calculated automatically per round completion.",
      notificationTitle: "Trust Score Boosted +10",
      notificationBody: "Ama Appiah trust score upgraded to 60/100."
    },
    {
      step: "04",
      icon: Unlock,
      title: "Instant Auto-Disbursal",
      desc: "The second the last member deposit, contract release full pot send directly to beneficiary MoMo wallet.",
      detail: "Instant MoMo transfer sharp sharp without delay.",
      notificationTitle: "Pot Disbursed Automatically!",
      notificationBody: "GHS 1,500 released directly to Kwesi Appiah."
    }
  ]

  return (
    <div>
      {/* Header */}
      <header>
        <div className="nav-container">
          <motion.div 
            className="brand-logo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Zap style={{ color: "var(--indigo-primary)" }} size={24} />
            <span>ChainSusu</span>
            <span className="brand-badge">PROTOCOL</span>
          </motion.div>

          <div className="nav-links">
            <a href="#pipeline">How It Works</a>
            <a href="#comparison">Why ChainSusu</a>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button className="btn-outline" onClick={() => setIsSignupOpen(true)}>Sign Up Free</button>
            <motion.button 
              className="btn-primary" 
              onClick={onOpenDashboard}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Launch App</span>
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section" style={{ maxWidth: "1280px", margin: "0 auto", padding: "4rem 1.25rem 3rem", textAlign: "center" }}>
        <motion.div 
          className="hero-pill"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", background: "#EEF2FF", border: "1.5px solid rgba(79, 70, 229, 0.3)", padding: "0.45rem 1.2rem", borderRadius: "50px", fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--indigo-primary)", fontWeight: 800, marginBottom: "1.75rem" }}
        >
          <Sparkles size={16} />
          <span>AUTONOMOUS ROTATING SAVINGS PROTOCOL</span>
        </motion.div>

        <motion.h1 
          className="hero-headline"
          style={{ fontFamily: "var(--font-main)", fontSize: "4rem", fontWeight: 1000, lineHeight: 1.08, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: "1.5rem", maxWidth: "950px", marginLeft: "auto", marginRight: "auto" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Save together sharp sharp. Zero collector stories. Pure code.
        </motion.h1>

        <motion.p 
          style={{ fontSize: "1.2rem", color: "var(--text-secondary)", maxWidth: "780px", margin: "0 auto 2.5rem", fontWeight: 700 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Chale, no more collector wahala. ChainSusu replace informal human collectors with smart contracts. Save on schedule and get your MoMo payout sharp.
        </motion.p>

        <motion.div 
          style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <motion.button 
            className="btn-primary" 
            style={{ padding: "0.9rem 2.2rem", fontSize: "1rem" }} 
            onClick={() => setIsSignupOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Sign Up & Start Saving</span>
            <Sparkles size={18} />
          </motion.button>
          <motion.button 
            className="btn-outline" 
            style={{ padding: "0.9rem 2rem", fontSize: "1rem" }} 
            onClick={onOpenDashboard}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Open Dashboard</span>
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </section>

      {/* PIPELINE SECTION WITH RESPONSIVE GRID */}
      <section style={{ maxWidth: "1280px", margin: "2.5rem auto 5rem", padding: "0 1.25rem" }} id="pipeline">
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--indigo-primary)", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>PROTOCOL PIPELINE</div>
          <h2 style={{ fontFamily: "var(--font-main)", fontSize: "2.4rem", fontWeight: 1000, marginTop: "0.2rem" }}>How ChainSusu Dey Work</h2>
        </div>

        <div className="pipeline-grid" style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "2.5rem", alignItems: "center" }}>
          {/* Left Steps */}
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              {protocolSteps.map((st, idx) => {
                const IconComponent = st.icon
                return (
                  <motion.div
                    key={st.step}
                    onClick={() => setActiveStep(idx)}
                    style={{
                      background: activeStep === idx ? "#FFF" : "var(--bg-subtle)",
                      border: activeStep === idx ? "2px solid var(--indigo-primary)" : "1.5px solid var(--border-subtle)",
                      borderRadius: "20px",
                      padding: "1.25rem",
                      cursor: "pointer",
                      boxShadow: activeStep === idx ? "var(--shadow-md)" : "var(--shadow-sm)"
                    }}
                    whileHover={{ y: -3 }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <IconComponent size={22} style={{ color: activeStep === idx ? "var(--indigo-primary)" : "var(--text-muted)" }} />
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 800, color: activeStep === idx ? "var(--indigo-primary)" : "var(--text-muted)" }}>STEP {st.step}</span>
                    </div>
                    <h3 style={{ fontFamily: "var(--font-main)", fontSize: "1.05rem", fontWeight: 900, color: "var(--text-primary)" }}>{st.title}</h3>
                  </motion.div>
                )
              })}
            </div>

            {/* Step Detail */}
            <motion.div 
              style={{ background: "#FFF", border: "2px solid var(--border-subtle)", borderRadius: "28px", padding: "2rem", boxShadow: "var(--shadow-lg)", textAlign: "left" }}
              key={activeStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.85rem" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "var(--indigo-gradient)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {React.createElement(protocolSteps[activeStep].icon, { size: 24 })}
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--indigo-primary)", fontWeight: 800 }}>PHASE {protocolSteps[activeStep].step}</div>
                  <h3 style={{ fontFamily: "var(--font-main)", fontSize: "1.5rem", fontWeight: 1000 }}>{protocolSteps[activeStep].title}</h3>
                </div>
              </div>

              <p style={{ fontSize: "1rem", color: "var(--text-secondary)", fontWeight: 700, marginBottom: "1.25rem" }}>
                {protocolSteps[activeStep].desc}
              </p>

              <div style={{ background: "#F1F5F9", padding: "0.85rem 1rem", borderRadius: "14px", fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 700 }}>
                Protocol Detail: {protocolSteps[activeStep].detail}
              </div>
            </motion.div>
          </div>

          {/* Right Smartphone Frame */}
          <motion.div 
            style={{ display: "flex", justifyContent: "center" }}
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="phone-frame">
              <div className="phone-notch"></div>
              <div className="phone-screen">
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#0F172A", fontWeight: 800 }}>
                  <span>9:41</span>
                  <span>5G 100%</span>
                </div>

                <div style={{ marginTop: "1rem", textAlign: "left" }}>
                  <div style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "var(--indigo-primary)", fontWeight: 800, textTransform: "uppercase" }}>
                    SUSU GO MOBILE
                  </div>
                  <div style={{ fontFamily: "var(--font-main)", fontSize: "1.4rem", fontWeight: 1000, margin: "0.2rem 0" }}>
                    Makola Market Circle
                  </div>
                  <div style={{ fontSize: "1.8rem", fontWeight: 1000, color: "var(--amber-primary)", fontFamily: "var(--font-mono)" }}>
                    GHS 1,500 / 1,500
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeStep}
                    className="push-notification"
                    initial={{ opacity: 0, scale: 0.85, y: -15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: 15 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div style={{ fontSize: "0.88rem", fontWeight: 900, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <CheckCircle2 size={16} style={{ color: "var(--emerald-primary)" }} />
                      <span>{protocolSteps[activeStep].notificationTitle}</span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "0.2rem 0", fontWeight: 700 }}>
                      {protocolSteps[activeStep].notificationBody}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--indigo-primary)", fontFamily: "var(--font-mono)", fontWeight: 800 }}>
                      JUST NOW
                    </div>
                  </motion.div>
                </AnimatePresence>

                <button className="btn-primary" style={{ width: "100%", justifyContent: "center", borderRadius: "16px", marginTop: "1rem" }} onClick={onOpenDashboard}>
                  <span>Open App Dashboard</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* REALISTIC SIGN UP MODAL (PHONE NUMBER + SECURITY PASSWORD/PIN) */}
      <div className={`modal-overlay ${isSignupOpen ? "active" : ""}`}>
        <motion.div 
          className="signup-modal-card"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: isSignupOpen ? 1 : 0.8, opacity: isSignupOpen ? 1 : 0 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div>
              <h3 style={{ fontFamily: "var(--font-main)", fontSize: "1.6rem", fontWeight: 1000 }}>Create Your Account</h3>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontWeight: 700 }}>Sign up with Ghana MoMo Phone & Password</div>
            </div>
            <button onClick={() => setIsSignupOpen(false)} style={{ background: "none", border: "none", fontSize: "1.8rem", color: "var(--text-muted)", cursor: "pointer" }}>&times;</button>
          </div>

          <div style={{ textAlign: "left", marginBottom: "1.1rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, marginBottom: "0.35rem" }}>Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. Abena Osei" 
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              style={{ width: "100%", padding: "0.8rem 1rem", border: "1.5px solid var(--border-subtle)", borderRadius: "14px", fontFamily: "var(--font-main)", fontSize: "0.95rem", outline: "none", fontWeight: 700 }} 
            />
          </div>

          <div style={{ textAlign: "left", marginBottom: "1.1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 800 }}>Mobile Money Phone Number</label>
              <span style={{ background: carrier.bg, color: carrier.color, fontSize: "0.72rem", fontWeight: 800, padding: "0.15rem 0.5rem", borderRadius: "6px" }}>{carrier.name}</span>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <div style={{ background: "var(--bg-subtle)", border: "1.5px solid var(--border-subtle)", padding: "0.8rem 0.9rem", borderRadius: "14px", fontFamily: "var(--font-mono)", fontWeight: 800, color: "var(--text-primary)", fontSize: "0.9rem" }}>
                🇬🇭 +233
              </div>
              <input 
                type="text" 
                placeholder="024XXXXXXX" 
                value={signUpPhone}
                onChange={(e) => setSignUpPhone(e.target.value)}
                style={{ flex: 1, padding: "0.8rem 1rem", border: "1.5px solid var(--border-subtle)", borderRadius: "14px", fontFamily: "var(--font-main)", fontSize: "0.95rem", outline: "none", fontWeight: 700 }} 
              />
            </div>
          </div>

          <div style={{ textAlign: "left", marginBottom: "1.1rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, marginBottom: "0.35rem" }}>Create Security PIN / Password</label>
            <div style={{ position: "relative" }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter 4-digit PIN or password" 
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                style={{ width: "100%", padding: "0.8rem 2.8rem 0.8rem 1rem", border: "1.5px solid var(--border-subtle)", borderRadius: "14px", fontFamily: "var(--font-main)", fontSize: "0.95rem", outline: "none", fontWeight: 700 }} 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ textAlign: "left", marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, marginBottom: "0.35rem" }}>Confirm Security PIN / Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Re-enter PIN or password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ width: "100%", padding: "0.8rem 1rem", border: "1.5px solid var(--border-subtle)", borderRadius: "14px", fontFamily: "var(--font-main)", fontSize: "0.95rem", outline: "none", fontWeight: 700 }} 
            />
          </div>

          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "0.85rem" }} onClick={handleSignupSubmit}>
            <span>Create ChainSusu Account</span>
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border-subtle)", padding: "3rem 1.5rem 2rem", textAlign: "center", fontSize: "0.9rem", color: "var(--text-muted)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ fontFamily: "var(--font-main)", fontSize: "1.3rem", fontWeight: 1000, color: "var(--text-primary)", marginBottom: "0.5rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            <Zap size={20} style={{ color: "var(--indigo-primary)" }} />
            <span>ChainSusu Protocol</span>
          </div>
          <p>Autonomous Rotating Savings Protocol for Ghana Mobile Money.</p>
          <div style={{ marginTop: "1.5rem", fontSize: "0.85rem" }}>© 2026 ChainSusu Protocol. Built on Ethereum & Mobile Money.</div>
        </div>
      </footer>
    </div>
  )
}
