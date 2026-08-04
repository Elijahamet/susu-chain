import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import confetti from 'canvas-confetti'
import { 
  Zap, Shield, Phone, Lock, Unlock, Users, Plus, Key, 
  ArrowRight, Sparkles, CheckCircle2, Activity, Globe, X, ArrowLeft, CreditCard, Clock, UserCheck, UserX, Cpu, ArrowDownCircle, Eye, EyeOff
} from 'lucide-react'

const RPC_URL = "http://127.0.0.1:8545"
const ACTUAL_DEMO_KEYS = [
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
  "0x5de4111584e49d4c6f68f69962d819388f55853118b577fdf3ac378d45650364"
]

const MEMBER_PROFILES = [
  { index: 0, phone: "+233 24 000 4567", rawPhone: "240004567", name: "Ama Appiah", initials: "AA" },
  { index: 1, phone: "+233 20 000 6543", rawPhone: "200006543", name: "Kwesi Mensah", initials: "KM" },
  { index: 2, phone: "+233 27 000 8901", rawPhone: "270008901", name: "Efua Darko", initials: "ED" }
]

const PUBLIC_MARKET_CIRCLES = [
  { id: 0, code: "1001", name: "Makola Market Women Susu Circle", potGhs: 1500, ownerName: "Kwesi Mensah", members: ["Kwesi Mensah", "Efua Darko", "Ama Appiah"] },
  { id: 1, code: "2002", name: "Kejetia Traders Union Circle", potGhs: 3000, ownerName: "Kofi Osei", members: ["Kofi Osei", "Yaa Asantewaa", "Abena Mensah"] },
  { id: 2, code: "3030", name: "Kantamanto Textile Savers", potGhs: 4500, ownerName: "Yaw Boateng", members: ["Yaw Boateng", "Akua Darko", "Kwesi Appiah"] },
  { id: 3, code: "4040", name: "Kaneshie Market Traders Fund", potGhs: 2000, ownerName: "Ama Serwaa", members: ["Ama Serwaa", "Kofi Osei", "Efua Mensah"] },
  { id: 4, code: "5050", name: "Tamale Central Market Guild", potGhs: 5000, ownerName: "Yakubu Issah", members: ["Yakubu Issah", "Fatima Al-Hassan", "Kwesi Appiah"] }
]

export default function ProtocolDashboard({ onBackToLanding }) {
  // LocalStorage User Profile
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const saved = localStorage.getItem("chainsusu_user_profile")
    if (saved) {
      try { return JSON.parse(saved) } catch (e) {}
    }
    return null
  })

  // LocalStorage User Groups
  const [userGroupIds, setUserGroupIds] = useState(() => {
    const saved = localStorage.getItem("chainsusu_user_groups")
    if (saved) {
      try { return JSON.parse(saved) } catch (e) {}
    }
    return [0]
  })

  const [activeGroupId, setActiveGroupId] = useState(() => userGroupIds[0] ?? 0)

  // Pending Join Requests Queue
  const [pendingRequests, setPendingRequests] = useState(() => {
    const saved = localStorage.getItem("chainsusu_pending_requests")
    if (saved) {
      try { return JSON.parse(saved) } catch (e) {}
    }
    return [
      { id: "req_1", circleId: 0, circleName: "Makola Market Women Susu Circle", userName: "Kofi Boateng", userPhone: "+233 24 111 2233", initials: "KB", time: "1:45 PM" }
    ]
  })

  // Modals & UI State
  const [pendingNotice, setPendingNotice] = useState(null)
  const [isAiLogicOpen, setIsAiLogicOpen] = useState(false)

  // Contract State
  const [contract, setContract] = useState(null)
  const [wallets, setWallets] = useState([])
  const [groupDetails, setGroupDetails] = useState(null)
  const [memberStates, setMemberStates] = useState([])
  const [totalPot, setTotalPot] = useState(0)
  const [activities, setActivities] = useState([])

  // Modals & MoMo Prompt State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
  const [isBrowseModalOpen, setIsBrowseModalOpen] = useState(false)
  const [celebrationData, setCelebrationData] = useState(null)

  // Mobile Money Payment Prompt Modal State
  const [payTargetMember, setPayTargetMember] = useState(null)
  const [momoPin, setMomoPin] = useState("1234")
  const [isMoMoProcessing, setIsMoMoProcessing] = useState(false)

  // Authentication Form States
  const [authMode, setAuthMode] = useState("signup") // "signup" or "login"
  const [authName, setAuthName] = useState("Abena Osei")
  const [authPhone, setAuthPhone] = useState("0245667788")
  const [authPassword, setAuthPassword] = useState("1234")
  const [authConfirmPassword, setAuthConfirmPassword] = useState("1234")
  const [showAuthPassword, setShowAuthPassword] = useState(false)

  // Forms
  const [newGroupName, setNewGroupName] = useState("Makola Traders Circle #2")
  const [newContributionGhs, setNewContributionGhs] = useState(500)
  const [selectedMembers, setSelectedMembers] = useState([0, 1, 2])
  const [joinCode, setJoinCode] = useState("")
  const [inviteCodes, setInviteCodes] = useState({ "1001": 0, "2002": 1, "3030": 2, "4040": 3, "5050": 4 })

  const addActivity = (msg) => {
    const timeStr = new Date().toTimeString().split(' ')[0]
    setActivities(prev => [{ time: timeStr, text: msg }, ...prev])
  }

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

  const carrier = getCarrierBadge(authPhone)

  // Persist User Groups
  const saveUserGroupIds = (ids) => {
    setUserGroupIds(ids)
    localStorage.setItem("chainsusu_user_groups", JSON.stringify(ids))
  }

  // Persist Pending Requests
  const savePendingRequests = (reqs) => {
    setPendingRequests(reqs)
    localStorage.setItem("chainsusu_pending_requests", JSON.stringify(reqs))
  }

  // Initialize Contract
  useEffect(() => {
    async function initContract() {
      try {
        const res = await fetch("contract-config.json")
        const cfg = await res.json()

        const p = new ethers.JsonRpcProvider(RPC_URL)
        const w = ACTUAL_DEMO_KEYS.map(k => new ethers.Wallet(k, p))
        const c = new ethers.Contract(cfg.address, cfg.abi, p)

        setWallets(w)
        setContract(c)

        c.on("ContributionMade", (groupId, member) => {
          if (Number(groupId) === activeGroupId) {
            addActivity(`MoMo deposit received sharp from ${member.slice(0, 6)}...`)
          }
        })

        c.on("PayoutReleased", (groupId, recipient, amount) => {
          const amountGhs = Number(ethers.formatEther(amount)) * 10000 || 1500
          const recipientProfile = MEMBER_PROFILES.find(dp => w[dp.index].address.toLowerCase() === recipient.toLowerCase()) || MEMBER_PROFILES[0]

          if (typeof confetti === "function") {
            confetti({ particleCount: 180, spread: 110, origin: { y: 0.5 } })
          }

          setCelebrationData({
            name: loggedInUser?.name || recipientProfile.name,
            initials: loggedInUser?.initials || recipientProfile.initials,
            phone: loggedInUser?.phone || recipientProfile.phone,
            amountGhs: amountGhs,
            roundNum: 1
          })

          addActivity(`🎉 Pot money sent directly to MoMo wallet!`)
        })
      } catch (e) {
        addActivity("Connecting to Mobile Money network...")
      }
    }
    initContract()
  }, [activeGroupId, loggedInUser])

  // Poll Active Group State
  useEffect(() => {
    if (!contract || userGroupIds.length === 0) return
    async function refresh() {
      try {
        const members = await contract.getGroupMembers(activeGroupId)
        const info = await contract.getGroupInfo(activeGroupId)
        const [amount, round, pIdx, deadline, active] = info

        let paidCount = 0
        const states = []

        const activeCircleData = PUBLIC_MARKET_CIRCLES.find(c => c.id === activeGroupId) || PUBLIC_MARKET_CIRCLES[0]

        for (let i = 0; i < members.length; i++) {
          const addr = members[i]
          const paid = await contract.hasPaid(activeGroupId, addr)
          const score = await contract.reliabilityScore(addr)
          if (paid) paidCount++

          let defaultName = activeCircleData.members[i] || MEMBER_PROFILES[i]?.name || `Member #${i+1}`
          let defaultPhone = MEMBER_PROFILES[i]?.phone || "+233 24 000 0000"
          let defaultInitials = defaultName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

          if (loggedInUser && (i === 0 || defaultName === "Ama Appiah" || defaultName === loggedInUser.name)) {
            defaultName = loggedInUser.name
            defaultPhone = loggedInUser.phone
            defaultInitials = loggedInUser.initials
          }

          states.push({
            index: i,
            address: addr,
            name: defaultName,
            phone: defaultPhone,
            initials: defaultInitials,
            paid: paid,
            score: Number(score) || 95,
            isRecipient: (i === Number(pIdx))
          })
        }

        setGroupDetails({
          round: Number(round),
          payoutIndex: Number(pIdx),
          isActive: active,
          contributionAmount: Number(ethers.formatEther(amount))
        })
        setMemberStates(states)
        setTotalPot(paidCount * 500)
      } catch (e) {
        console.error(e)
      }
    }
    refresh()
    const timer = setInterval(refresh, 3000)
    return () => clearInterval(timer)
  }, [contract, activeGroupId, userGroupIds, wallets, loggedInUser])

  // Authentication Handlers
  const handleAuthSubmit = () => {
    if (!authPhone.trim() || authPhone.length < 8) {
      alert("Please enter a valid Ghana MoMo Phone Number")
      return
    }
    if (authPassword.length < 4) {
      alert("Security PIN/Password must be at least 4 digits")
      return
    }

    if (authMode === "signup") {
      if (!authName.trim()) {
        alert("Please enter your Full Name")
        return
      }
      if (authPassword !== authConfirmPassword) {
        alert("Security PINs/Passwords do not match!")
        return
      }

      const initials = authName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      const formattedPhone = authPhone.startsWith("+233") ? authPhone : `+233 ${authPhone.startsWith("0") ? authPhone.substring(1) : authPhone}`
      
      const userProfile = {
        name: authName,
        phone: formattedPhone,
        initials: initials || "AO",
        password: authPassword,
        carrier: carrier.name
      }

      setLoggedInUser(userProfile)
      localStorage.setItem("chainsusu_user_profile", JSON.stringify(userProfile))
      addActivity(`Account created sharp as ${authName}`)
    } else {
      // Log In Mode
      const saved = localStorage.getItem("chainsusu_user_profile")
      let profileName = "Ama Appiah"
      let initials = "AA"

      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          profileName = parsed.name || profileName
          initials = parsed.initials || initials
        } catch (e) {}
      }

      const formattedPhone = authPhone.startsWith("+233") ? authPhone : `+233 ${authPhone.startsWith("0") ? authPhone.substring(1) : authPhone}`
      const userProfile = {
        name: profileName,
        phone: formattedPhone,
        initials: initials,
        carrier: carrier.name
      }

      setLoggedInUser(userProfile)
      localStorage.setItem("chainsusu_user_profile", JSON.stringify(userProfile))
      addActivity(`Logged in as ${profileName}`)
    }
  }

  const selectQuickProfile = (profile) => {
    const userProfile = { name: profile.name, phone: profile.phone, initials: profile.initials }
    setLoggedInUser(userProfile)
    localStorage.setItem("chainsusu_user_profile", JSON.stringify(userProfile))
    addActivity(`Welcome ${profile.name}!`)
  }

  // GROUP OWNER VERIFICATION & REQUEST HANDLER
  const handleRequestToJoinCircle = (circleId) => {
    const targetCircle = PUBLIC_MARKET_CIRCLES.find(c => c.id === circleId) || { name: `Circle #${circleId}`, ownerName: "Circle Admin" }
    
    if (userGroupIds.includes(circleId)) {
      setActiveGroupId(circleId)
      setIsBrowseModalOpen(false)
      setIsJoinModalOpen(false)
      return
    }

    const newReq = {
      id: "req_" + Date.now(),
      circleId: circleId,
      circleName: targetCircle.name,
      ownerName: targetCircle.ownerName,
      userName: loggedInUser?.name || "New Member",
      userPhone: loggedInUser?.phone || "+233 24 XXX XXXX",
      initials: loggedInUser?.initials || "NM",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    savePendingRequests([...pendingRequests, newReq])
    setIsBrowseModalOpen(false)
    setIsJoinModalOpen(false)

    setPendingNotice({
      circleName: targetCircle.name,
      ownerName: targetCircle.ownerName
    })

    addActivity(`Join request sent to Circle Owner (${targetCircle.ownerName})`)
  }

  // OWNER APPROVAL HANDLERS
  const handleApproveRequest = (req) => {
    const updatedReqs = pendingRequests.filter(r => r.id !== req.id)
    savePendingRequests(updatedReqs)

    if (!userGroupIds.includes(req.circleId)) {
      saveUserGroupIds([...userGroupIds, req.circleId])
    }

    addActivity(`✓ Approved ${req.userName} for ${req.circleName}`)
    alert(`✓ ${req.userName} has been approved and added to ${req.circleName}!`)
  }

  const handleRejectRequest = (reqId) => {
    const updatedReqs = pendingRequests.filter(r => r.id !== reqId)
    savePendingRequests(updatedReqs)
    addActivity("Rejected join request.")
  }

  const handleJoinByCodeSubmit = () => {
    const targetId = inviteCodes[joinCode]
    if (targetId !== undefined) {
      handleRequestToJoinCircle(targetId)
    } else {
      alert("Invalid code. Try market codes: 1001, 2002, 3030, 4040, or 5050.")
    }
  }

  // Create Group Handler
  const handleCreateGroupSubmit = async () => {
    if (!contract || !wallets[0]) return
    try {
      const selectedAddrs = selectedMembers.map(idx => wallets[idx].address)
      const amountWei = ethers.parseEther("0.05")
      const roundLength = 3600

      const cSigner = contract.connect(wallets[0])
      addActivity(`Creating new circle "${newGroupName}"...`)
      const tx = await cSigner.createGroup(selectedAddrs, amountWei, roundLength)
      await tx.wait()

      const groupCount = await contract.groupCount()
      const newId = Number(groupCount) - 1

      const randomCode = Math.floor(1000 + Math.random() * 9000).toString()
      setInviteCodes(prev => ({ ...prev, [randomCode]: newId }))

      saveUserGroupIds([...userGroupIds, newId])
      setActiveGroupId(newId)
      setIsCreateModalOpen(false)

      alert(`🎉 Circle Created Successfully!\nInvite Code: ${randomCode}`)
      addActivity(`Created Circle #${newId} [Code: ${randomCode}]`)
    } catch (e) {
      alert("Group creation error: " + e.message)
    }
  }

  // MOMO PAYMENT HANDLER
  const openMoMoPinPrompt = (memberObj) => {
    setPayTargetMember(memberObj)
    setMomoPin("1234")
  }

  const confirmMoMoPayment = async () => {
    if (!payTargetMember || !contract || !wallets[payTargetMember.index]) return
    setIsMoMoProcessing(true)

    try {
      const wallet = wallets[payTargetMember.index]
      const cSigner = contract.connect(wallet)
      addActivity(`Authorizing MoMo payment of GHS 500 for ${payTargetMember.name}...`)
      
      const info = await contract.getGroupInfo(activeGroupId)
      const requiredWei = info[0]

      const tx = await cSigner.contribute(activeGroupId, { value: requiredWei })
      await tx.wait()
      
      addActivity(`✓ MoMo Payment Approved for ${payTargetMember.name}!`)
      setIsMoMoProcessing(false)
      const paidMemberIndex = payTargetMember.index
      setPayTargetMember(null)

      // AUTO-SIMULATE OTHER 2 MEMBERS PAYING FOR INSTANT POT WITHDRAWAL!
      setTimeout(async () => {
        for (let i = 0; i < 3; i++) {
          if (i !== paidMemberIndex && wallets[i]) {
            try {
              const isPaid = await contract.hasPaid(activeGroupId, wallets[i].address)
              if (!isPaid) {
                const memberName = memberStates[i]?.name || MEMBER_PROFILES[i]?.name
                addActivity(`Processing MoMo deposit for ${memberName}...`)
                const memberSigner = contract.connect(wallets[i])
                const subTx = await memberSigner.contribute(activeGroupId, { value: requiredWei })
                await subTx.wait()
                addActivity(`✓ MoMo Deposit confirmed for ${memberName}!`)
                await new Promise(r => setTimeout(r, 1200))
              }
            } catch (err) {
              console.error(err)
            }
          }
        }
      }, 800)

    } catch (e) {
      setIsMoMoProcessing(false)
      alert("MoMo Payment Error: " + (e.reason || e.message))
    }
  }

  const paidCount = memberStates.filter(m => m.paid).length

  // AUTHENTICATION SCREEN (PHONE NUMBER & PASSWORD)
  if (!loggedInUser) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)", padding: "1.5rem" }}>
        <div style={{ background: "#FFF", border: "1.5px solid var(--border-subtle)", borderRadius: "32px", padding: "2.5rem 2rem", width: "100%", maxWidth: "460px", boxShadow: "var(--shadow-lg)", textAlign: "center" }}>
          
          <div style={{ fontFamily: "var(--font-main)", fontSize: "2rem", fontWeight: 1000, color: "var(--text-primary)", marginBottom: "0.2rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <Zap size={28} style={{ color: "var(--indigo-primary)" }} />
            <span>ChainSusu</span>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--indigo-primary)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.5rem" }}>
            Ghana Mobile Money Authentication
          </div>

          {/* Sign Up / Log In Mode Switcher Tabs */}
          <div style={{ display: "flex", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", padding: "0.3rem", borderRadius: "14px", marginBottom: "1.5rem" }}>
            <button 
              onClick={() => setAuthMode("signup")}
              style={{ flex: 1, padding: "0.55rem", border: "none", borderRadius: "10px", background: authMode === "signup" ? "#FFF" : "transparent", fontFamily: "var(--font-main)", fontSize: "0.88rem", fontWeight: 900, color: authMode === "signup" ? "var(--indigo-primary)" : "var(--text-muted)", cursor: "pointer", boxShadow: authMode === "signup" ? "var(--shadow-sm)" : "none" }}
            >
              Sign Up
            </button>
            <button 
              onClick={() => setAuthMode("login")}
              style={{ flex: 1, padding: "0.55rem", border: "none", borderRadius: "10px", background: authMode === "login" ? "#FFF" : "transparent", fontFamily: "var(--font-main)", fontSize: "0.88rem", fontWeight: 900, color: authMode === "login" ? "var(--indigo-primary)" : "var(--text-muted)", cursor: "pointer", boxShadow: authMode === "login" ? "var(--shadow-sm)" : "none" }}
            >
              Log In
            </button>
          </div>

          {authMode === "signup" && (
            <div style={{ textAlign: "left" }}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, marginBottom: "0.35rem" }}>Full Name</label>
                <input 
                  type="text" 
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="e.g. Abena Osei"
                  style={{ width: "100%", padding: "0.8rem 1rem", border: "1.5px solid var(--border-subtle)", borderRadius: "14px", fontFamily: "var(--font-main)", fontSize: "0.95rem", outline: "none", fontWeight: 700 }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
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
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    placeholder="024XXXXXXX"
                    style={{ flex: 1, padding: "0.8rem 1rem", border: "1.5px solid var(--border-subtle)", borderRadius: "14px", fontFamily: "var(--font-main)", fontSize: "0.95rem", outline: "none", fontWeight: 700 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, marginBottom: "0.35rem" }}>Create Security PIN / Password</label>
                <div style={{ position: "relative" }}>
                  <input 
                    type={showAuthPassword ? "text" : "password"} 
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="4-digit PIN or password"
                    style={{ width: "100%", padding: "0.8rem 2.8rem 0.8rem 1rem", border: "1.5px solid var(--border-subtle)", borderRadius: "14px", fontFamily: "var(--font-main)", fontSize: "0.95rem", outline: "none", fontWeight: 700 }}
                  />
                  <button type="button" onClick={() => setShowAuthPassword(!showAuthPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                    {showAuthPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, marginBottom: "0.35rem" }}>Confirm Security PIN / Password</label>
                <input 
                  type={showAuthPassword ? "text" : "password"} 
                  value={authConfirmPassword}
                  onChange={(e) => setAuthConfirmPassword(e.target.value)}
                  placeholder="Re-enter PIN or password"
                  style={{ width: "100%", padding: "0.8rem 1rem", border: "1.5px solid var(--border-subtle)", borderRadius: "14px", fontFamily: "var(--font-main)", fontSize: "0.95rem", outline: "none", fontWeight: 700 }}
                />
              </div>

              <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "0.85rem" }} onClick={handleAuthSubmit}>
                <span>Create ChainSusu Account</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {authMode === "login" && (
            <div style={{ textAlign: "left" }}>
              <div style={{ marginBottom: "1.25rem" }}>
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
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    placeholder="024XXXXXXX"
                    style={{ flex: 1, padding: "0.8rem 1rem", border: "1.5px solid var(--border-subtle)", borderRadius: "14px", fontFamily: "var(--font-main)", fontSize: "0.95rem", outline: "none", fontWeight: 700 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, marginBottom: "0.35rem" }}>Security PIN / Password</label>
                <div style={{ position: "relative" }}>
                  <input 
                    type={showAuthPassword ? "text" : "password"} 
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Enter security PIN or password"
                    style={{ width: "100%", padding: "0.8rem 2.8rem 0.8rem 1rem", border: "1.5px solid var(--border-subtle)", borderRadius: "14px", fontFamily: "var(--font-main)", fontSize: "0.95rem", outline: "none", fontWeight: 700 }}
                  />
                  <button type="button" onClick={() => setShowAuthPassword(!showAuthPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                    {showAuthPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "0.85rem", marginBottom: "1.75rem" }} onClick={handleAuthSubmit}>
                <span>Log In to My Account</span>
                <ArrowRight size={18} />
              </button>

              <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1.25rem" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-muted)", marginBottom: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>
                  Quick Member Demo Access
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {MEMBER_PROFILES.map(dp => (
                    <button 
                      key={dp.name} 
                      className="btn-outline" 
                      style={{ width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.7rem 1rem", fontSize: "0.88rem" }}
                      onClick={() => selectQuickProfile(dp)}
                    >
                      <span style={{ fontWeight: 900 }}>{dp.name}</span>
                      <span style={{ fontFamily: "var(--font-mono)", color: "var(--indigo-primary)", fontWeight: 800 }}>{dp.phone}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // MAIN DASHBOARD VIEW
  return (
    <div>
      {/* Top Header */}
      <header>
        <div className="nav-container">
          <div className="brand-logo">
            <Zap size={24} style={{ color: "var(--indigo-primary)" }} />
            <span>ChainSusu</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flexWrap: "wrap" }}>
            {/* Circle Switcher Dropdown */}
            {userGroupIds.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-secondary)" }}>Circle:</span>
                <select 
                  value={activeGroupId} 
                  onChange={(e) => setActiveGroupId(Number(e.target.value))}
                  style={{ background: "#FFF", border: "1.5px solid var(--border-subtle)", padding: "0.45rem 0.85rem", borderRadius: "12px", fontFamily: "var(--font-main)", fontSize: "0.88rem", fontWeight: 800, cursor: "pointer" }}
                >
                  {userGroupIds.map(gid => (
                    <option key={gid} value={gid}>
                      {PUBLIC_MARKET_CIRCLES.find(c => c.id === gid)?.name || `Circle #${gid}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button className="btn-outline" style={{ padding: "0.45rem 0.85rem", fontSize: "0.82rem", color: "var(--indigo-primary)", borderColor: "var(--indigo-primary)", display: "flex", alignItems: "center", gap: "0.4rem" }} onClick={() => setIsAiLogicOpen(true)}>
              <Cpu size={16} />
              <span>AI Trust Logic</span>
            </button>

            <button className="btn-primary" style={{ padding: "0.45rem 0.85rem", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.4rem" }} onClick={() => setIsCreateModalOpen(true)}>
              <Plus size={16} />
              <span>New Circle</span>
            </button>

            <button className="btn-outline" style={{ padding: "0.45rem 0.85rem", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.4rem" }} onClick={() => setIsJoinModalOpen(true)}>
              <Key size={16} />
              <span>Join Code</span>
            </button>

            <button className="btn-outline" style={{ padding: "0.45rem 0.85rem", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.4rem" }} onClick={() => setIsBrowseModalOpen(true)}>
              <Globe size={16} />
              <span>Browse Circles</span>
            </button>

            {/* User Profile Badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#EEF2FF", border: "1px solid rgba(79, 70, 229, 0.3)", padding: "0.35rem 0.85rem", borderRadius: "50px" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "var(--indigo-primary)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 1000 }}>
                {loggedInUser.initials}
              </div>
              <span style={{ fontSize: "0.82rem", fontWeight: 900, color: "var(--indigo-primary)" }}>{loggedInUser.name}</span>
            </div>

            <button className="btn-outline" style={{ fontSize: "0.8rem", padding: "0.35rem 0.75rem" }} onClick={onBackToLanding}>
              Landing Page
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "2rem 1.25rem 5rem" }}>
        
        {/* GROUP OWNER APPROVALS & PENDING REQUESTS PANEL */}
        {pendingRequests.length > 0 && (
          <div style={{ background: "#FFFBEB", border: "2px solid #F59E0B", borderRadius: "24px", padding: "1.5rem 1.75rem", marginBottom: "2rem", boxShadow: "var(--shadow-md)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
              <Clock size={22} style={{ color: "#B45309" }} />
              <h3 style={{ fontFamily: "var(--font-main)", fontSize: "1.2rem", fontWeight: 1000, color: "#78350F" }}>
                Group Owner Approval Needed ({pendingRequests.length} Pending Member Requests)
              </h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {pendingRequests.map(req => (
                <div key={req.id} style={{ background: "#FFF", border: "1.5px solid #FCD34D", borderRadius: "18px", padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-main)", fontSize: "1.05rem", fontWeight: 900, color: "var(--text-primary)" }}>
                      {req.userName} ({req.userPhone})
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontWeight: 700 }}>
                      Requested to join <strong>{req.circleName}</strong> &bull; Circle Owner: <strong>{req.ownerName}</strong>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.6rem" }}>
                    <button className="btn-primary" style={{ background: "#10B981", fontSize: "0.82rem", padding: "0.45rem 1rem", display: "flex", alignItems: "center", gap: "0.3rem" }} onClick={() => handleApproveRequest(req)}>
                      <UserCheck size={15} />
                      <span>Approve & Add to Circle</span>
                    </button>

                    <button className="btn-outline" style={{ borderColor: "#EF4444", color: "#EF4444", fontSize: "0.82rem", padding: "0.45rem 0.85rem", display: "flex", alignItems: "center", gap: "0.3rem" }} onClick={() => handleRejectRequest(req.id)}>
                      <UserX size={15} />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INDIVIDUAL MULTI-GROUP MANAGEMENT HUB */}
        {userGroupIds.length > 0 && (
          <div style={{ background: "#FFF", border: "1.5px solid var(--border-subtle)", borderRadius: "24px", padding: "1.5rem 1.75rem", marginBottom: "2rem", boxShadow: "var(--shadow-md)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Users size={20} style={{ color: "var(--indigo-primary)" }} />
                <h3 style={{ fontFamily: "var(--font-main)", fontSize: "1.2rem", fontWeight: 1000 }}>
                  My Joined Savings Circles ({userGroupIds.length} Active)
                </h3>
              </div>

              <button className="btn-primary" style={{ padding: "0.45rem 0.9rem", fontSize: "0.82rem" }} onClick={() => setIsBrowseModalOpen(true)}>
                <Globe size={15} />
                <span>＋ Join Another Circle</span>
              </button>
            </div>

            {/* Circles Cards */}
            <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
              {userGroupIds.map(gid => {
                const circleData = PUBLIC_MARKET_CIRCLES.find(c => c.id === gid) || { name: `Savings Circle #${gid}`, potGhs: 1500 }
                const isSelected = activeGroupId === gid

                return (
                  <div 
                    key={gid} 
                    onClick={() => setActiveGroupId(gid)}
                    style={{
                      minWidth: "240px",
                      background: isSelected ? "#EEF2FF" : "var(--bg-subtle)",
                      border: isSelected ? "2px solid var(--indigo-primary)" : "1.5px solid var(--border-subtle)",
                      borderRadius: "18px",
                      padding: "1rem 1.25rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: isSelected ? "var(--indigo-primary)" : "var(--text-muted)", fontWeight: 800 }}>
                      CIRCLE #{gid} {isSelected && "• ACTIVE"}
                    </div>
                    <div style={{ fontFamily: "var(--font-main)", fontSize: "1.05rem", fontWeight: 900, color: "var(--text-primary)", margin: "0.2rem 0 0.4rem" }}>
                      {circleData.name}
                    </div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--amber-primary)" }}>
                      Target Pot: GHS {circleData.potGhs.toLocaleString()}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ACTIVE DASHBOARD VIEW */}
        {userGroupIds.length > 0 && (
          <div>
            <div style={{ background: "#FFF", border: "1.5px solid var(--border-subtle)", borderRadius: "28px", padding: "2rem", marginBottom: "2rem", boxShadow: "var(--shadow-lg)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.25rem" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--indigo-primary)", fontWeight: 800, marginBottom: "0.4rem" }}>
                    SAVINGS CIRCLE #{activeGroupId}
                  </div>
                  <h1 style={{ fontFamily: "var(--font-main)", fontSize: "2.2rem", fontWeight: 1000 }}>
                    {PUBLIC_MARKET_CIRCLES.find(c => c.id === activeGroupId)?.name || `Savings Circle #${activeGroupId}`}
                  </h1>
                  <p style={{ fontSize: "1rem", color: "var(--text-secondary)", fontWeight: 700, marginTop: "0.3rem" }}>
                    Who Receives Money Today: <strong>{memberStates[groupDetails?.payoutIndex]?.name || 'Beneficiary'}</strong>
                  </p>
                </div>

                <div style={{ background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)", border: "1.5px solid #F59E0B", borderRadius: "22px", padding: "1.25rem 1.75rem", textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#B45309", fontWeight: 800 }}>TOTAL ROUND POT</div>
                  <div style={{ fontFamily: "var(--font-main)", fontSize: "2.4rem", fontWeight: 1000, color: "#78350F" }}>
                    GHS {totalPot.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#92400E" }}>TARGET POT: GHS 1,500</div>
                </div>
              </div>
            </div>

            {/* 2-COLUMN DASHBOARD GRID */}
            <div className="dashboard-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "2rem" }}>
              {/* Left Column */}
              <div>
                <div style={{ background: "#FFF", border: "1.5px solid var(--border-subtle)", borderRadius: "24px", padding: "1.75rem", boxShadow: "var(--shadow-md)" }}>
                  
                  <div style={{ fontSize: "1.05rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Users size={20} style={{ color: "var(--indigo-primary)" }} />
                    <span>Circle Members & Payments ({paidCount}/3 Deposited)</span>
                  </div>

                  {/* Member Cards Roster */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {memberStates.map((m) => {
                      const isCurrentUser = loggedInUser && (loggedInUser.name.toLowerCase().includes(m.name.toLowerCase()) || m.name.toLowerCase().includes(loggedInUser.name.toLowerCase()))
                      
                      return (
                        <div key={m.name} className={`vault-node-card ${m.paid ? "paid" : ""}`} style={{ border: isCurrentUser ? "2px solid var(--indigo-primary)" : "1.5px solid var(--border-subtle)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                            <div style={{ width: "42px", height: "42px", borderRadius: "14px", background: m.paid ? "#10B981" : "var(--indigo-gradient)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-main)", fontSize: "1.05rem", fontWeight: 1000 }}>
                              {m.initials}
                            </div>
                            <div>
                              <div style={{ fontFamily: "var(--font-main)", fontSize: "1.05rem", fontWeight: 900, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                {m.name}
                                {isCurrentUser && <span style={{ background: "#EEF2FF", border: "1px solid var(--indigo-primary)", color: "var(--indigo-primary)", fontSize: "0.68rem", padding: "0.15rem 0.4rem", borderRadius: "6px" }}>YOU</span>}
                                {m.isRecipient && <span style={{ background: "#FEF3C7", border: "1px solid #F59E0B", color: "#B45309", fontSize: "0.68rem", padding: "0.15rem 0.4rem", borderRadius: "6px" }}>BENEFICIARY</span>}
                              </div>
                              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 700 }}>
                                MoMo: {m.phone} &bull; Rating: {m.score}/100
                              </div>
                            </div>
                          </div>

                          {m.paid ? (
                            <div style={{ background: "#D1FAE5", border: "1px solid #10B981", color: "#047857", padding: "0.5rem 1rem", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 900, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <CheckCircle2 size={16} />
                              <span>Paid Sharp (GHS 500)</span>
                            </div>
                          ) : (
                            <button 
                              className="btn-primary" 
                              style={{ padding: "0.6rem 1.2rem", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
                              onClick={() => openMoMoPinPrompt(m)}
                            >
                              <CreditCard size={16} />
                              <span>{isCurrentUser ? "Pay My GHS 500 MoMo" : `Pay GHS 500 (${m.name.split(' ')[0]})`}</span>
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Activity History */}
              <div>
                <div style={{ background: "#FFF", border: "1.5px solid var(--border-subtle)", borderRadius: "24px", padding: "1.75rem", boxShadow: "var(--shadow-md)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
                    <Activity size={20} style={{ color: "var(--indigo-primary)" }} />
                    <h3 style={{ fontFamily: "var(--font-main)", fontSize: "1.2rem", fontWeight: 900 }}>
                      MoMo Activity History
                    </h3>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", maxHeight: "420px", overflowY: "auto" }}>
                    {activities.map((act, i) => (
                      <div key={i} style={{ background: "var(--bg-subtle)", borderLeft: "3.5px solid var(--indigo-primary)", padding: "0.8rem 1rem", borderRadius: "0 12px 12px 0", fontSize: "0.85rem", fontWeight: 700 }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", marginRight: "0.75rem" }}>{act.time}</span>
                        <span>{act.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI TRUST LOGIC INSPECTOR MODAL */}
      {isAiLogicOpen && (
        <div className="modal-overlay active">
          <div className="signup-modal-card" style={{ maxWidth: "580px", textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontFamily: "var(--font-main)", fontSize: "1.5rem", fontWeight: 1000, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Cpu size={24} style={{ color: "var(--indigo-primary)" }} />
                <span>AI Trust & Reliability Logic Engine</span>
              </h3>
              <button onClick={() => setIsAiLogicOpen(false)} style={{ background: "none", border: "none", fontSize: "1.8rem", color: "var(--text-muted)", cursor: "pointer" }}>&times;</button>
            </div>

            <div style={{ background: "#EEF2FF", border: "1.5px solid rgba(79, 70, 229, 0.3)", borderRadius: "16px", padding: "1.25rem", marginBottom: "1.25rem" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 800, color: "var(--indigo-primary)" }}>SCORING ALGORITHM FORMULA</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.95rem", fontWeight: 900, color: "var(--text-primary)", margin: "0.3rem 0" }}>
                Score = 50 + (OnTimeDeposits × 15) + (RoundsCompleted × 10) - (LatePenalty × 25)
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontWeight: 700 }}>
                Evaluates payment timeliness, circle completion, and on-chain verification automatically.
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "#ECFDF5", border: "1px solid #10B981", borderRadius: "14px", padding: "1rem" }}>
                <div style={{ fontWeight: 900, color: "#047857" }}>Ama Appiah &bull; AI Rating: 98/100</div>
                <div style={{ fontSize: "0.82rem", color: "#065F46" }}>Verdict: <strong>VERY LOW RISK</strong> (4 On-time deposits, 0 late). Priority Payout Beneficiary.</div>
              </div>

              <div style={{ background: "#FEF3C7", border: "1px solid #F59E0B", borderRadius: "14px", padding: "1rem" }}>
                <div style={{ fontWeight: 900, color: "#B45309" }}>Kwesi Mensah &bull; AI Rating: 92/100</div>
                <div style={{ fontSize: "0.82rem", color: "#78350F" }}>Verdict: <strong>TRUSTED TRADER</strong> (3 On-time deposits, 0 late). Standard Queue.</div>
              </div>
            </div>

            <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setIsAiLogicOpen(false)}>
              <span>Close AI Inspector</span>
            </button>
          </div>
        </div>
      )}

      {/* PENDING APPROVAL NOTICE MODAL */}
      {pendingNotice && (
        <div className="modal-overlay active">
          <div className="signup-modal-card" style={{ maxWidth: "440px" }}>
            <Clock size={48} style={{ color: "#F59E0B", marginBottom: "1rem" }} />
            <h3 style={{ fontFamily: "var(--font-main)", fontSize: "1.5rem", fontWeight: 1000, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              Pending Group Owner Approval
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", fontWeight: 700, marginBottom: "1.5rem" }}>
              Your request to join <strong>{pendingNotice.circleName}</strong> has been sent to Circle Admin <strong>{pendingNotice.ownerName}</strong> for verification. You will be added as soon as they approve!
            </p>

            <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setPendingNotice(null)}>
              <span>Got It, Thanks!</span>
            </button>
          </div>
        </div>
      )}

      {/* FAMILIAR MOBILE MONEY PIN PROMPT MODAL */}
      {payTargetMember && (
        <div className="modal-overlay active">
          <div className="signup-modal-card" style={{ maxWidth: "420px", border: "2px solid #F59E0B" }}>
            <div style={{ background: "#FEF3C7", margin: "-2.2rem -2rem 1.5rem -2rem", padding: "1.25rem 1.75rem", borderRadius: "26px 26px 0 0", borderBottom: "1px solid #F59E0B", textAlign: "left" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 800, color: "#B45309" }}>MTN MOBILE MONEY EXPRESS PAY</div>
              <div style={{ fontFamily: "var(--font-main)", fontSize: "1.3rem", fontWeight: 1000, color: "#78350F" }}>
                Authorize GHS 500.00
              </div>
            </div>

            <div style={{ textAlign: "left", marginBottom: "1.25rem" }}>
              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Paying From:</div>
              <div style={{ fontWeight: 900, fontSize: "1rem" }}>{payTargetMember.name} ({payTargetMember.phone})</div>
            </div>

            <div style={{ textAlign: "left", marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 800, marginBottom: "0.4rem" }}>Enter 4-Digit MoMo PIN</label>
              <input 
                type="password" 
                maxLength={4}
                value={momoPin}
                onChange={(e) => setMomoPin(e.target.value)}
                placeholder="* * * *"
                style={{ width: "100%", padding: "0.85rem", border: "2px solid var(--indigo-primary)", borderRadius: "14px", fontFamily: "var(--font-mono)", fontSize: "1.6rem", textAlign: "center", letterSpacing: "0.4em", outline: "none", fontWeight: 900 }}
              />
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => setPayTargetMember(null)} disabled={isMoMoProcessing}>
                Cancel
              </button>
              <button className="btn-primary" style={{ flex: 2, justifyContent: "center" }} onClick={confirmMoMoPayment} disabled={isMoMoProcessing}>
                {isMoMoProcessing ? "Authorizing..." : "Confirm Payment (GHS 500)"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BROWSE MARKET CIRCLES MODAL */}
      {isBrowseModalOpen && (
        <div className="modal-overlay active">
          <div className="signup-modal-card" style={{ maxWidth: "620px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontFamily: "var(--font-main)", fontSize: "1.5rem", fontWeight: 1000, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Globe size={24} style={{ color: "var(--indigo-primary)" }} />
                <span>Ghanaian Market Savings Circles</span>
              </h3>
              <button onClick={() => setIsBrowseModalOpen(false)} style={{ background: "none", border: "none", fontSize: "1.8rem", color: "var(--text-muted)", cursor: "pointer" }}>&times;</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left", marginBottom: "1.5rem" }}>
              {PUBLIC_MARKET_CIRCLES.map(c => (
                <div key={c.id} style={{ background: "var(--bg-subtle)", border: "1.5px solid var(--border-subtle)", borderRadius: "20px", padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-main)", fontSize: "1.1rem", fontWeight: 900, color: "var(--text-primary)" }}>{c.name}</div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontWeight: 700, margin: "0.2rem 0" }}>
                      Pot: <strong>GHS {c.potGhs.toLocaleString()}</strong> &bull; Members: {c.members.join(", ")}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--indigo-primary)", fontWeight: 800 }}>
                      Invite Code: {c.code}
                    </div>
                  </div>

                  <button className="btn-primary" style={{ padding: "0.55rem 1.1rem", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }} onClick={() => handleRequestToJoinCircle(c.id)}>
                    <span>Request to Join</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CREATE GROUP MODAL */}
      {isCreateModalOpen && (
        <div className="modal-overlay active">
          <div className="signup-modal-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontFamily: "var(--font-main)", fontSize: "1.5rem", fontWeight: 1000, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Plus size={24} style={{ color: "var(--indigo-primary)" }} />
                <span>Create New Savings Circle</span>
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} style={{ background: "none", border: "none", fontSize: "1.8rem", color: "var(--text-muted)", cursor: "pointer" }}>&times;</button>
            </div>

            <div style={{ textAlign: "left", marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 800, marginBottom: "0.4rem" }}>Group Name</label>
              <input 
                type="text" 
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                style={{ width: "100%", padding: "0.85rem 1rem", border: "1.5px solid var(--border-subtle)", borderRadius: "14px", fontFamily: "var(--font-main)", fontSize: "1rem", outline: "none", fontWeight: 700 }}
              />
            </div>

            <div style={{ textAlign: "left", marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 800, marginBottom: "0.4rem" }}>Contribution Amount per Round (GHS)</label>
              <input 
                type="number" 
                value={newContributionGhs}
                onChange={(e) => setNewContributionGhs(Number(e.target.value))}
                style={{ width: "100%", padding: "0.85rem 1rem", border: "1.5px solid var(--border-subtle)", borderRadius: "14px", fontFamily: "var(--font-main)", fontSize: "1rem", outline: "none", fontWeight: 700 }}
              />
            </div>

            <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleCreateGroupSubmit}>
              <span>Deploy Circle</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* JOIN GROUP MODAL */}
      {isJoinModalOpen && (
        <div className="modal-overlay active">
          <div className="signup-modal-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontFamily: "var(--font-main)", fontSize: "1.5rem", fontWeight: 1000, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Key size={24} style={{ color: "var(--indigo-primary)" }} />
                <span>Join Circle by Invite Code</span>
              </h3>
              <button onClick={() => setIsJoinModalOpen(false)} style={{ background: "none", border: "none", fontSize: "1.8rem", color: "var(--text-muted)", cursor: "pointer" }}>&times;</button>
            </div>

            <div style={{ textAlign: "left", marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 800, marginBottom: "0.4rem" }}>4-Digit Invite Code</label>
              <input 
                type="text" 
                maxLength={4}
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="1001"
                style={{ width: "100%", padding: "1rem", border: "2px solid var(--indigo-primary)", borderRadius: "16px", fontFamily: "var(--font-mono)", fontSize: "1.6rem", textAlign: "center", letterSpacing: "0.3em", outline: "none", fontWeight: 900 }}
              />
            </div>

            <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleJoinByCodeSubmit}>
              <span>Request to Join</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* PAYOUT CELEBRATION & INSTANT MOMO WITHDRAWAL OVERLAY */}
      {celebrationData && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#0F172A", zIndex: 2000, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#FFF", padding: "2rem", textAlign: "center" }}>
          <div style={{ width: "110px", height: "110px", borderRadius: "50%", background: "var(--emerald-gradient)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", fontWeight: 1000, boxShadow: "0 0 50px rgba(16, 185, 129, 0.6)", marginBottom: "1.5rem" }}>
            {celebrationData.initials}
          </div>

          <div style={{ background: "rgba(16, 185, 129, 0.2)", border: "1px solid #10B981", padding: "0.45rem 1.25rem", borderRadius: "50px", fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "#10B981", fontWeight: 800, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <ArrowDownCircle size={18} />
            <span>MOMO POT WITHDRAWAL COMPLETE</span>
          </div>

          <h1 style={{ fontFamily: "var(--font-main)", fontSize: "2.8rem", fontWeight: 1000, marginBottom: "0.5rem" }}>
            🎉 GHS {celebrationData.amountGhs.toLocaleString()} Disbursed Sharp!
          </h1>

          <p style={{ fontSize: "1.15rem", color: "#94A3B8", maxWidth: "600px", margin: "0 auto 2rem", fontWeight: 700 }}>
            Smart contract has transferred the full round pot directly into <strong>{celebrationData.name}</strong>'s Mobile Money account ({celebrationData.phone})!
          </p>

          <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "20px", padding: "1.25rem 2rem", maxWidth: "440px", width: "100%", marginBottom: "2rem", textAlign: "left", fontSize: "0.88rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <span style={{ color: "#94A3B8" }}>Disbursed Amount:</span>
              <strong style={{ color: "#10B981", fontFamily: "var(--font-mono)" }}>GHS {celebrationData.amountGhs.toLocaleString()}.00</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <span style={{ color: "#94A3B8" }}>Destination:</span>
              <strong style={{ color: "#FFF" }}>{celebrationData.phone} (MoMo)</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#94A3B8" }}>Status:</span>
              <strong style={{ color: "#10B981" }}>✓ APPROVED & SENT SHARP</strong>
            </div>
          </div>

          <button className="btn-primary" style={{ padding: "0.95rem 2.5rem", fontSize: "1.1rem", borderRadius: "16px" }} onClick={() => setCelebrationData(null)}>
            <span>Back to Dashboard</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
