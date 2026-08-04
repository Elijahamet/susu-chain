# ChainSusu — Autonomous Rotating Savings Protocol

> **"No collector holding the money. No one to run away. Just code — and now everyone can see who's reliable before they trust them with their savings."**

---

## Pitch & Protocol Narrative

### The Problem
*Susu* — "little by little" in Twi — is how roughly half of Ghana's working population saves, because formal banks were never built for them. But the whole system runs on trusting one human collector to hold everyone's money, and when that trust breaks, people lose what they saved.

### The Fix
ChainSusu replaces the human collector with a smart contract. Members contribute on a fixed schedule; the moment everyone in the group has paid, the contract automatically releases the full pot to whoever's turn it is — no person ever touches or controls the funds. Nobody can disappear with the money, because there's no one holding it.

### The Trust Layer, Made Visible
Every member has a reliability score, right there in the app — it rises when they pay on time, drops when they miss a round. New members can see who they're joining before they trust them with real money, something informal susu never offered.

### Why Ethereum, Specifically (Not Just an App)
A normal database can be quietly edited by whoever controls it. A smart contract can't — once the rules are deployed, no one, not even the team that built it, can secretly change who gets paid or rewrite the history. That's the entire point, and it's the one sentence that survives being asked *"why blockchain"* by a skeptical judge.

### What's Actually Built and Proven
- **Solidity Smart Contract**: Fully compiled & tested (`ChainSusu.sol`).
- **6 Automated Tests**: End-to-end unit tests verifying contributions, auto-disbursals, and reliability score updates (`npx hardhat test`).
- **Live Demo Frontend**: A clean, professional black-and-white interface where three members pay in and the payout fires automatically, live.

---

## Demo Quickstart Guide

Open **three terminals**:

### Terminal 1 — Start the local Hardhat network:
```bash
cd susu-chain
npx hardhat node
```

### Terminal 2 — Compile, deploy, and create the demo group:
```bash
cd susu-chain
node scripts/compile.js
npx hardhat run scripts/deploy.js --network localhost --no-compile
```

### Terminal 3 — Serve the frontend:
```bash
cd susu-chain/frontend
npx serve -p 8080
```
Open **http://localhost:8080** in your browser.

---

## 3-Minute Live Demo Script

1. **Show Initial State**: Show the three members (Ama, Kwesi, Efua), all "Pending", all reliability scores at 50. Point out Kwesi is the current payout target.
2. **Pay First Two Members**: Click "Pay GHS 500 via MoMo" as **Kwesi** and **Efua**. Show their status flip to "Paid" and watch the live activity feed.
3. **Pay the Final Member**: Click "Pay GHS 500 via MoMo" as **Ama** (the last member). 
   - Watch the payout fire **automatically** to Kwesi!
   - Point out: *Nobody clicked "release funds". The contract did it the instant the round completed.*
4. **Deliver the Closing Line**:
   > *"No collector holding the money. No one to run away. Just code — and now everyone can see who's reliable before they trust them with their savings."*