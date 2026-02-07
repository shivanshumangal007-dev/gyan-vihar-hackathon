# Testing the Chatbot User Experience

## Option 1: Interactive CLI (Recommended for Testing)

Run the interactive chat interface:

```bash
node chat-cli.js
```

This will start an interactive session where you can:
- Type messages and see the chatbot's responses
- View internal analysis (emotion + intensity detection)
- See color-coded responses (green=low, yellow=medium, red=high)
- View available action buttons
- Type `exit` to quit

**Example session:**
```
You: I feel overwhelmed with everything
─────────────────────────────────────────────────────────────
Internal Analysis:
  Emotion: stress
  Intensity: medium

Chatbot:
That sounds really overwhelming. Let's slow things down together.

Actions:
  [1] Breathing exercise
  [2] Grounding technique
  [3] Keep chatting
─────────────────────────────────────────────────────────────

You: _
```

---

## Option 2: API Testing with PowerShell

The server is already running on port 3000. Test with PowerShell:

**Low intensity example:**
```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/chat -Method Post -Body (@{message="I feel a bit tired"} | ConvertTo-Json) -ContentType "application/json"
```

**Medium intensity example:**
```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/chat -Method Post -Body (@{message="I can't focus and I'm exhausted all the time"} | ConvertTo-Json) -ContentType "application/json"
```

**High intensity (crisis) example:**
```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/chat -Method Post -Body (@{message="Everything feels hopeless"} | ConvertTo-Json) -ContentType "application/json"
```

**Check stats:**
```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/stats -Method Get
```

---

## Option 3: Quick Test Script

Create a test script to try multiple scenarios:

```bash
node -e "const test = async () => { const scenarios = ['I feel overwhelmed', 'Everything feels hopeless', 'I am tired']; for (const msg of scenarios) { const res = await fetch('http://localhost:3000/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: msg }) }); const data = await res.json(); console.log('\nMessage:', msg); console.log('Response:', data); } }; test();"
```

---

## What to Test

Try these scenarios to see different responses:

**Low Intensity:**
- "I feel a bit overwhelmed"
- "I'm tired"
- "I'm nervous about tomorrow"

**Medium Intensity:**
- "I can't focus on anything and I'm exhausted all the time"
- "I'm struggling with my studies and failing everything"
- "I feel lonely and nobody cares"

**High Intensity (Crisis):**
- "Everything feels hopeless"
- "I feel like giving up"
- "I can't go on anymore"

**Edge Cases:**
- "asdfgh" (unclear input)
- "This is stupid" (anger)
- "" (empty input)
