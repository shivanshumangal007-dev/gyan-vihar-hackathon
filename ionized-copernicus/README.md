# NORMAL Mental First-Aid Chatbot

A safety-focused mental first-aid chatbot for student wellness that assesses emotional state and routes to appropriate support resources.

## 🎯 What It Does

- **Listens** to student concerns (free-text input)
- **Assesses** emotional severity (low/medium/high)
- **Routes** to ONE safe next action
- **Maintains** strict safety boundaries (no diagnosis, no medical advice)

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Server
```bash
.\start-server.bat
```

Or manually:
```bash
node server.js
```

### 3. Test It
```bash
.\chat.bat
```

The server runs on `http://localhost:3000`

## 🏗️ Architecture

```
User Message
    ↓
[1] Emotion Classification (8 categories)
    ↓
[2] Intensity Assessment (low/medium/high)
    ↓
[3] Crisis Detection (keyword-based)
    ↓
    ├─→ HIGH? → Template Crisis Response
    ↓
[4] AI Conversation (if AI_MODE=true)
    ↓
[5] Safety Validation
    ↓
[6] Response + Actions
```

## 📁 Project Structure

```
ionized-copernicus/
├── chatbot/
│   ├── classifier.js           # Emotion detection (8 categories)
│   ├── intensityAssessor.js    # Crisis detection
│   ├── responseGenerator.js    # Template responses
│   ├── aiConversation.js       # OpenAI integration
│   ├── conversationMemory.js   # Session management
│   ├── safetyValidator.js      # AI response validation
│   └── systemPrompt.js         # Behavioral rules
├── utils/
│   └── logger.js               # Privacy-compliant logging
├── tests/
│   └── chatbot.test.js         # Automated tests
├── server.js                   # Express API server
├── chat-cli.js                 # Interactive testing tool
├── .env                        # Configuration
└── package.json                # Dependencies
```

## 🔧 Configuration

Edit `.env`:

```bash
# Server
PORT=3000

# AI Mode (true = OpenAI, false = templates only)
AI_MODE=false

# OpenAI API Key (only needed if AI_MODE=true)
OPENAI_API_KEY=your_key_here
```

## 🌐 API Endpoints

### POST /api/chat
Main chatbot endpoint

**Request:**
```json
{
  "message": "I feel overwhelmed with everything",
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "emotion": "stress",
  "intensity": "medium",
  "message": "That sounds really overwhelming. Let's slow things down together.",
  "actions": [
    { "label": "Breathing exercise", "action": "breathing" },
    { "label": "Grounding technique", "action": "grounding" },
    { "label": "Keep chatting", "action": "chat" }
  ],
  "mode": "template"
}
```

### GET /health
Health check

### GET /api/stats
Anonymous aggregated statistics

## 🎨 Emotion Categories

1. **stress** - Overwhelmed, burnt out, pressure
2. **anxiety** - Worried, nervous, panic
3. **sadness** - Down, hopeless, empty
4. **academic** - Study struggles, grades, exams
5. **loneliness** - Isolated, alone, disconnected
6. **sleep** - Insomnia, fatigue, exhaustion
7. **social** - Relationships, conflicts, rejection
8. **unknown** - Unclear or mixed emotions

## 🚨 Safety Features

### What the Bot NEVER Does:
- ❌ Diagnose ("you have depression")
- ❌ Give medical advice
- ❌ Promise outcomes ("everything will be okay")
- ❌ Invalidate feelings
- ❌ Store user messages (privacy-first)

### What It ALWAYS Does:
- ✅ Stays calm and brief
- ✅ Validates feelings
- ✅ Offers 2-3 safe actions
- ✅ Routes to professional help when needed
- ✅ Logs only anonymous metadata

## 🤖 AI Mode vs Template Mode

### Template Mode (AI_MODE=false)
- ✅ Works immediately
- ✅ Free
- ✅ Privacy-first (no external APIs)
- ✅ Deterministic
- ❌ Not conversational
- ❌ No context memory

### AI Mode (AI_MODE=true)
- ✅ Natural conversation
- ✅ Context-aware
- ✅ Better empathy
- ✅ Handles follow-ups
- ❌ Requires OpenAI API key
- ❌ Costs ~$0.005 per conversation
- ❌ Sends data to OpenAI (encrypted)

**Note:** Crisis detection ALWAYS uses keywords (fast, reliable) regardless of mode.

## 🧪 Testing

### Run Test Suite
```bash
npm test
```

### Interactive CLI
```bash
.\chat.bat
```

### Test Scenarios

**Low Intensity:**
- "I feel a bit tired"
- "I'm nervous about tomorrow"

**Medium Intensity:**
- "I can't focus and I'm exhausted all the time"
- "I'm struggling with everything"

**High Intensity (Crisis):**
- "Everything feels hopeless"
- "I feel like giving up"

## 🚀 Deployment

### For Hackathon/Demo

1. **Use Template Mode** (AI_MODE=false)
   - Works immediately
   - No API keys needed
   - Still routes correctly

2. **Start Server**
   ```bash
   .\start-server.bat
   ```

3. **Test Locally**
   ```bash
   .\chat.bat
   ```

### For Production

1. **Set up OpenAI** (optional)
   - Get API key: https://platform.openai.com/api-keys
   - Add billing ($5-10 credit)
   - Set `AI_MODE=true` in `.env`

2. **Use Process Manager**
   ```bash
   npm install -g pm2
   pm2 start server.js --name chatbot
   ```

3. **Add Reverse Proxy** (Nginx/Apache)
   - SSL/TLS termination
   - Rate limiting
   - Load balancing

## 📊 Privacy & Compliance

### What Gets Logged:
```json
{
  "emotion": "stress",
  "intensity": "medium",
  "timestamp": "2026-02-07T..."
}
```

### What Does NOT Get Logged:
- User messages
- User identities
- IP addresses
- Session data (cleared after 30 min)

## 💰 Cost Estimation

**Template Mode:** FREE

**AI Mode:**
- ~$0.005 per conversation
- 1000 users × 5 conversations = $25/month
- Very affordable for student platforms

## 🛠️ Tech Stack

- **Node.js** - Runtime
- **Express** - Web framework
- **OpenAI GPT-4o-mini** - AI (optional)
- **Keyword matching** - Emotion/crisis detection
- **File system** - Privacy-compliant logging

## 📚 Documentation

- [`QUICKSTART-AI.md`](QUICKSTART-AI.md) - AI setup guide
- [`TESTING.md`](TESTING.md) - Testing instructions
- [`examples/responses.md`](examples/responses.md) - Example conversations

## 🎓 For Hackathon Judges

### Key Features:
1. **Safety-First Design** - No diagnosis, no medical advice
2. **Hybrid Intelligence** - Keywords for safety + AI for empathy
3. **Privacy-Compliant** - Anonymous logging only
4. **Crisis Detection** - Keyword-based (fast, reliable)
5. **Scalable** - Stateless API, easy to deploy

### Technical Highlights:
- Clean modular architecture
- Comprehensive test suite (97% pass rate)
- REST API ready for frontend integration
- Fallback mechanisms (reliability)
- Well-documented codebase

## 📞 Support Actions

- **breathing** - Breathing exercises
- **grounding** - Grounding techniques
- **game** - Calming activities
- **chat** - Continue conversation
- **counselor** - Professional counseling
- **helpline** - Crisis helpline
- **peer_support** - Peer support groups
- **study_tips** - Academic resources
- **sleep_tips** - Sleep hygiene
- **self_care** - Self-care activities

## 🏆 Why This Approach?

**Simple technology + strict constraints = safer mental health support**

We chose keyword-based detection over pure AI because:
- Mental health requires **predictable, auditable** responses
- Privacy is **non-negotiable**
- Crisis detection must be **fast and reliable**
- Cost-effectiveness enables **wider access**

## 📝 License

Built for the NORMAL student wellness platform.

---

**Remember:** This is mental first-aid, not therapy. Always route to professional help when needed.
