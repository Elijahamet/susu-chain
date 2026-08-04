import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, Shield, Phone, Lock, Unlock, Users, Plus, Key, 
  ArrowRight, Sparkles, CheckCircle2, AlertTriangle, Globe, Star, Eye, EyeOff, TrendingUp, ShieldCheck, ChevronDown, Award, DollarSign
} from 'lucide-react'

export default function LandingPage({ onOpenDashboard }) {
  const [activeStep, setActiveStep] = useState(0)
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [signUpName, setSignUpName] = useState("Abena Osei")
  const [signUpPhone, setSignUpPhone] = useState("0245667788")
  const [signUpPassword, setSignUpPassword] = useState("1234")
  const [confirmPassword, setConfirmPassword] = useState("1234")
  const [showPassword, setShowPassword] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

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

  const liveStats = [
    { label: "Total Volume Disbursed", value: "GHS 2,850,000+", icon: TrendingUp },
    { label: "Active Market Circles", value: "540+ Circles", icon: Users },
    { label: "Human Collector Risk", value: "0% (Zero Risk)", icon: ShieldCheck },
    { label: "MoMo Disbursal Speed", value: "< 1 Sec Instant", icon: Zap }
  ]

  const featuredMarketCircles = [
    { name: "Makola Market Women Susu Circle", pot: "GHS 1,500", members: "3 Traders", code: "1001", status: "Active Round #1", badgeColor: "#10B981" },
    { name: "Kejetia Traders Union Circle", pot: "GHS 3,000", members: "3 Traders", code: "2002", status: "Filling Pot", badgeColor: "#F59E0B" },
    { name: "Kantamanto Textile Savers", pot: "GHS 4,500", members: "3 Traders", code: "3030", status: "Active Round #2", badgeColor: "#6366F1" }
  ]

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
      detail: "Verified smart contract: 0xcB2Ac979eCf770f0C3f7E19D78249Abb2501c40F.",
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
      notificationBody: "Ama Appiah trust score upgraded to 98/100."
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

  const marketVoices = [
    {
      name: "Ama Appiah",
      market: "Makola Market, Accra",
      trade: "Cloth & Lace Trader",
      quote: "Before before, collector fit take our money travel. Now with ChainSusu, as soon as we all pay, the GHS 1,500 drop enter my MTN MoMo wallet sharp!",
      rating: 5
    },
    {
      name: "Kwesi Mensah",
      market: "Kejetia Market, Kumasi",
      trade: "Footwear Merchant",
      quote: "Pure code, zero stories. My trust rating is 92/100 now. Kejetia traders union save GHS 3,000 every single month with zero fear.",
      rating: 5
    },
    {
      name: "Yaa Asantewaa",
      market: "Kantamanto Market, Accra",
      trade: "Textile Exporter",
      quote: "Very simple for phone. You enter your 4-digit MoMo PIN, and the smart contract handles everything automatically!",
      rating: 5
    }
  ]

  const faqs = [
    {
      q: "What is ChainSusu?",
      a: "ChainSusu is an autonomous rotating savings protocol designed specifically for Ghanaian market traders. It replaces traditional human Susu collectors with immutable Ethereum smart contracts, guaranteeing 100% security for your money."
    },
    {
      q: "How does the Mobile Money payment work?",
      a: "You simply authorize your contribution using your MTN MoMo, Telecel Cash, or AT Money 4-digit PIN. Funds land directly into the smart contract escrow. The second all members deposit, the full pot transfers instantly to that round's beneficiary."
    },
    {
      q: "Can the collector run away with our money?",
      a: "No! There is zero human collector custody. No single person (not even the admin) can touch or withdraw funds. Only the smart contract can release money when all members contribute."
    }
  ]

  return (
    <div>
      {/* Top Glass Header */}
      <header>
        <div className="nav-container">
          <motion.div 
            className="brand-logo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Zap style={{ color: "var(--indigo-primary)" }} size={26} />
            <span>ChainSusu</span>
            <span className="brand-badge">SOLICITY ESCROW</span>
          </motion.div>

          <div className="nav-links">
            <a href="#stats">Live Volume</a>
            <a href="#circles">Market Circles</a>
            <a href="#pipeline">How It Works</a>
            <a href="#voices">Market Voices</a>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
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

      {/* BREATHTAKING HERO SECTION */}
      <section className="hero-section" style={{ maxWidth: "1280px", margin: "0 auto", padding: "4.5rem 1.25rem 3.5rem", textAlign: "center" }}>
        
        <motion.div 
          className="hero-pill"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "0.6rem", 
            background: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)", 
            border: "1.5px solid rgba(79, 70, 229, 0.35)", 
            padding: "0.5rem 1.35rem", 
            borderRadius: "50px", 
            fontFamily: "var(--font-mono)", 
            fontSize: "0.82rem", 
            color: "var(--indigo-primary)", 
            fontWeight: 800, 
            marginBottom: "2rem",
            boxShadow: "0 8px 20px rgba(79, 70, 229, 0.12)" 
          }}
        >
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981", boxShadow: "0 0 10px #10B981" }}></span>
          <Sparkles size={16} />
          <span>AUTONOMOUS ROTATING SAVINGS PROTOCOL &bull; GHANA MOMO</span>
        </motion.div>

        <motion.h1 
          className="hero-headline"
          style={{ 
            fontFamily: "var(--font-main)", 
            fontSize: "4.2rem", 
            fontWeight: 1000, 
            lineHeight: 1.08, 
            letterSpacing: "-0.03em", 
            marginBottom: "1.5rem", 
            maxWidth: "1000px", 
            marginLeft: "auto", 
            marginRight: "auto"
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Save together sharp sharp.{' '}
          <span style={{ 
            background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)", 
            WebkitBackgroundClip: "text", 
            WebkitTextFillColor: "transparent" 
          }}>
            Zero collector stories.
          </span>{' '}
          Pure code.
        </motion.h1>

        <motion.p 
          style={{ fontSize: "1.25rem", color: "var(--text-secondary)", maxWidth: "800px", margin: "0 auto 2.75rem", fontWeight: 700, lineHeight: 1.6 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Chale, no more collector wahala. ChainSusu replace informal human collectors with smart contracts. Save on schedule and receive your pot money directly into your Mobile Money wallet sharp!
        </motion.p>

        <motion.div 
          style={{ display: "flex", gap: "1.1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "4rem" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <motion.button 
            className="btn-primary" 
            style={{ padding: "1rem 2.4rem", fontSize: "1.05rem", borderRadius: "18px" }} 
            onClick={() => setIsSignupOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Sign Up & Start Saving</span>
            <Sparkles size={18} />
          </motion.button>
          <motion.button 
            className="btn-outline" 
            style={{ padding: "1rem 2.2rem", fontSize: "1.05rem", borderRadius: "18px" }} 
            onClick={onOpenDashboard}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Open Protocol Dashboard</span>
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>

        {/* LIVE METRICS DASHBOARD BANNER */}
        <div id="stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", maxWidth: "1150px", margin: "0 auto 4.5rem" }}>
          {liveStats.map((st, i) => {
            const IconComp = st.icon
            return (
              <motion.div 
                key={st.label}
                style={{ 
                  background: "#FFF", 
                  border: "1.5px solid var(--border-subtle)", 
                  borderRadius: "24px", 
                  padding: "1.4rem", 
                  boxShadow: "var(--shadow-glass)",
                  textAlign: "left"
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--indigo-primary)", marginBottom: "0.5rem" }}>
                  <IconComp size={20} />
                  <span style={{ fontSize: "0.78rem", fontFamily: "var(--font-mono)", fontWeight: 800, textTransform: "uppercase" }}>{st.label}</span>
                </div>
                <div style={{ fontFamily: "var(--font-main)", fontSize: "1.7rem", fontWeight: 1000, color: "var(--text-primary)" }}>
                  {st.value}
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* FEATURED GHANAIAN MARKET CIRCLES SHOWCASE */}
      <section id="circles" style={{ maxWidth: "1280px", margin: "0 auto 5rem", padding: "0 1.25rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--indigo-primary)", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>COMMUNITY VAULTS</div>
          <h2 style={{ fontFamily: "var(--font-main)", fontSize: "2.5rem", fontWeight: 1000, marginTop: "0.2rem" }}>Active Ghanaian Market Circles</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {featuredMarketCircles.map((mc, idx) => (
            <motion.div 
              key={mc.name}
              style={{ 
                background: "#FFF", 
                border: "1.5px solid var(--border-subtle)", 
                borderRadius: "26px", 
                padding: "1.75rem", 
                boxShadow: "var(--shadow-glass)",
                position: "relative",
                textAlign: "left"
              }}
              whileHover={{ y: -5 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <span style={{ background: `${mc.badgeColor}15`, color: mc.badgeColor, border: `1px solid ${mc.badgeColor}`, fontSize: "0.75rem", fontFamily: "var(--font-mono)", fontWeight: 800, padding: "0.25rem 0.65rem", borderRadius: "8px" }}>
                  {mc.status}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--indigo-primary)", fontWeight: 800 }}>CODE: {mc.code}</span>
              </div>

              <h3 style={{ fontFamily: "var(--font-main)", fontSize: "1.25rem", fontWeight: 1000, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
                {mc.name}
              </h3>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "1.25rem 0 1.5rem", background: "var(--bg-subtle)", padding: "0.9rem 1.1rem", borderRadius: "16px" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 800, textTransform: "uppercase" }}>Target Pot</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 1000, color: "var(--amber-primary)", fontFamily: "var(--font-mono)" }}>{mc.pot}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 800, textTransform: "uppercase" }}>Roster Size</div>
                  <div style={{ fontSize: "1.05rem", fontWeight: 900, color: "var(--text-primary)" }}>{mc.members}</div>
                </div>
              </div>

              <button className="btn-primary" style={{ width: "100%", justifyContent: "center", borderRadius: "14px" }} onClick={onOpenDashboard}>
                <span>Join Market Circle</span>
                <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PIPELINE SECTION WITH RESPONSIVE GRID */}
      <section style={{ maxWidth: "1280px", margin: "0 auto 6rem", padding: "0 1.25rem" }} id="pipeline">
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--indigo-primary)", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>PROTOCOL PIPELINE</div>
          <h2 style={{ fontFamily: "var(--font-main)", fontSize: "2.5rem", fontWeight: 1000, marginTop: "0.2rem" }}>How ChainSusu Works Sharp</h2>
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
                      borderRadius: "22px",
                      padding: "1.25rem",
                      cursor: "pointer",
                      boxShadow: activeStep === idx ? "var(--shadow-glass)" : "var(--shadow-sm)"
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
              style={{ background: "#FFF", border: "2px solid var(--border-subtle)", borderRadius: "28px", padding: "2rem", boxShadow: "var(--shadow-glass)", textAlign: "left" }}
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

              <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", fontWeight: 700, marginBottom: "1.25rem" }}>
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

      {/* MARKET VOICES / TRADER REVIEWS SECTION */}
      <section id="voices" style={{ background: "#EEF2FF", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)", padding: "5rem 1.25rem" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--indigo-primary)", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>MARKET VOICES</div>
            <h2 style={{ fontFamily: "var(--font-main)", fontSize: "2.5rem", fontWeight: 1000, marginTop: "0.2rem" }}>Loved by Ghanaian Market Traders</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.75rem" }}>
            {marketVoices.map((mv, i) => (
              <motion.div 
                key={mv.name}
                style={{ 
                  background: "#FFF", 
                  border: "1.5px solid var(--border-subtle)", 
                  borderRadius: "26px", 
                  padding: "1.75rem", 
                  boxShadow: "var(--shadow-glass)",
                  textAlign: "left"
                }}
                whileHover={{ y: -4 }}
              >
                <div style={{ display: "flex", gap: "0.2rem", color: "#F59E0B", marginBottom: "1rem" }}>
                  {[...Array(mv.rating)].map((_, idx) => (
                    <Star key={idx} size={18} fill="#F59E0B" />
                  ))}
                </div>

                <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", fontWeight: 700, fontStyle: "italic", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                  "{mv.quote}"
                </p>

                <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-main)", fontSize: "1.1rem", fontWeight: 1000, color: "var(--text-primary)" }}>{mv.name}</div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 700 }}>{mv.trade}</div>
                  </div>
                  <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--indigo-primary)", fontWeight: 800, background: "#EEF2FF", padding: "0.25rem 0.6rem", borderRadius: "8px" }}>
                    {mv.market}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section style={{ maxWidth: "860px", margin: "5rem auto", padding: "0 1.25rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--indigo-primary)", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>FREQUENTLY ASKED QUESTIONS</div>
          <h2 style={{ fontFamily: "var(--font-main)", fontSize: "2.4rem", fontWeight: 1000, marginTop: "0.2rem" }}>Got Questions? We Get Answers.</h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" }}>
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              style={{ background: "#FFF", border: "1.5px solid var(--border-subtle)", borderRadius: "20px", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}
            >
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{ width: "100%", padding: "1.25rem 1.5rem", background: "none", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-main)", fontSize: "1.1rem", fontWeight: 900, color: "var(--text-primary)", cursor: "pointer", textAlign: "left" }}
              >
                <span>{faq.q}</span>
                <ChevronDown size={20} style={{ transform: openFaq === idx ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease", color: "var(--indigo-primary)" }} />
              </button>
              {openFaq === idx && (
                <div style={{ padding: "0 1.5rem 1.25rem", color: "var(--text-secondary)", fontWeight: 700, fontSize: "0.98rem", borderTop: "1px solid var(--bg-subtle)" }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* REALISTIC SIGN UP MODAL */}
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
      <footer style={{ borderTop: "1px solid var(--border-subtle)", padding: "3rem 1.5rem 2rem", textAlign: "center", fontSize: "0.9rem", color: "var(--text-muted)", background: "#FFF" }}>
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
