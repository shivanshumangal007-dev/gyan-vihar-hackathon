# NORMAL Mental First-Aid Chatbot

A safety-focused mental first-aid chatbot for student wellness platform.

## ⚠️ Important Disclaimer

**This chatbot is NOT:**
- Therapy
- Medical diagnosis
- Medical advice
- A replacement for professional help

**This chatbot IS:**
- A mental first-aid assistant
- A smart router to appropriate support
- A brief, empathetic listener
- A tool to slow down and ground users

---

## Features

✓ **Emotion Classification**: Detects 8 emotion categories (stress, anxiety, sadness, academic, loneliness, sleep, social, unknown)

✓ **Intensity Assessment**: Evaluates emotional intensity (low, medium, high) with crisis detection

✓ **Safe Response Generation**: Provides brief, empathetic responses with 2-3 action options

✓ **Privacy-Compliant**: Logs only anonymous metadata (emotion, intensity, timestamp) - never stores user messages or identities

✓ **Crisis Detection**: Identifies high-risk situations and gently offers professional support

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` if needed (default port is 3000).

### 3. Start Server

```bash
npm start
```

Server will run on `http://localhost:3000`

### 4. Test the API

**Health check:**
```bash
curl http://localhost:3000/health
```

**Send a message:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"I feel overwhelmed with everything\"}"
```

**Expected response:**
```json
{
  "emotion": "stress",
  "intensity": "medium",
  "message": "That sounds really overwhelming. Let's slow things down together.",
  "actions": [
    { "label": "Breathing exercise", "action": "breathing" },
    { "label": "Grounding technique", "action": "grounding" },
    { "label": "Keep chatting", "action": "chat" }
  ]
}
```

---

## API Documentation

### POST `/api/chat`

Main chatbot endpoint.

**Request:**
```json
{
  "message": "user's text input"
}
```

**Response:**
```json
{
  "emotion": "stress|anxiety|sadness|academic|loneliness|sleep|social|unknown",
  "intensity": "low|medium|high",
  "message": "Brief empathetic response",
  "actions": [
    { "label": "Action Label", "action": "action_id" }
  ]
}
```

**Action IDs:**
- `breathing` - Breathing exercise
- `grounding` - Grounding technique
- `game` - Calming game/activity
- `chat` - Continue conversation
- `counselor` - Connect with counselor
- `helpline` - Crisis helpline
- `peer_support` - Peer support groups
- `study_tips` - Academic resources
- `sleep_tips` - Sleep hygiene resources
- `break` - Quick break activity
- `sounds` - Calming sounds

---

### GET `/api/stats`

Get aggregated anonymous statistics.

**Response:**
```json
{
  "total": 42,
  "emotions": {
    "stress": 15,
    "anxiety": 10,
    "sadness": 8,
    "academic": 9
  },
  "intensities": {
    "low": 20,
    "medium": 18,
    "high": 4
  }
}
```

---

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "mental-first-aid-chatbot",
  "timestamp": "2026-02-06T16:54:11.000Z"
}
```

---

## Testing

Run the test suite:

```bash
npm test
```

Tests cover:
- Emotion classification (all 8 categories)
- Intensity assessment (low, medium, high)
- Crisis detection
- Response generation
- Safety constraints
- Edge cases

---

## Project Structure

```
.
├── server.js                    # Express server & API endpoints
├── chatbot/
│   ├── classifier.js            # Emotion classification logic
│   ├── intensityAssessor.js     # Intensity assessment & crisis detection
│   ├── responseGenerator.js     # Response generation with templates
│   └── systemPrompt.js          # System prompt & behavioral rules
├── utils/
│   └── logger.js                # Privacy-compliant logging
├── tests/
│   └── chatbot.test.js          # Test suite
├── examples/
│   └── responses.md             # Example responses
├── logs/                        # Anonymous metadata logs (auto-created)
├── package.json
├── .env.example
└── README.md
```

---

## Safety Guidelines

### Core Behavioral Rules

**The chatbot MUST:**
- Stay calm, brief, and empathetic
- Validate feelings without judgment
- Offer simple, safe next steps
- Redirect to grounding/breathing when unsure
- Gently offer human support for high distress

**The chatbot MUST NOT:**
- Try to "solve" life problems
- Diagnose (e.g., "you have depression")
- Give medical advice
- Promise outcomes ("everything will be okay")
- Argue with or invalidate feelings
- Force escalation to crisis support
- Be overly talkative or "too smart"

### Response Limits

- **Low/Medium intensity**: 1 empathetic sentence + 1 simple suggestion + 2-3 action buttons
- **High intensity (crisis)**: Calm acknowledgment + gentle support offer + professional help options

**If the chatbot ever feels "too smart" or "too talkative", it is wrong.**

---

## Privacy Policy

### What We Log
- Emotion category (e.g., "stress")
- Intensity level (e.g., "medium")
- Timestamp

### What We DO NOT Log
- User identities
- Full chat messages
- Personal information
- IP addresses
- Session data

All logs are stored locally in `logs/metadata.log` as anonymous JSON entries.

---

## Development

### Adding New Emotions

1. Add keywords to `chatbot/classifier.js` → `EMOTION_PATTERNS`
2. Add response templates to `chatbot/responseGenerator.js` → `RESPONSE_TEMPLATES`
3. Add tests to `tests/chatbot.test.js`

### Modifying Intensity Thresholds

Edit keyword lists in `chatbot/intensityAssessor.js`:
- `CRISIS_KEYWORDS` - Triggers high intensity
- `HIGH_INTENSITY_KEYWORDS` - Contributes to high/medium
- `MEDIUM_INTENSITY_KEYWORDS` - Contributes to medium/low

### Customizing Responses

Edit templates in `chatbot/responseGenerator.js` → `RESPONSE_TEMPLATES`

**Rules:**
- Keep messages under 200 characters
- Always include 2-3 action buttons
- Never diagnose, advise, or promise outcomes
- Stay empathetic but limited

---

## Integration with Frontend

The chatbot returns JSON that can be consumed by any frontend framework.

**Example React integration:**

```javascript
async function sendMessage(userMessage) {
  const response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage })
  });
  
  const data = await response.json();
  
  // Display data.message to user
  // Render data.actions as buttons
  // Route based on action.action when clicked
}
```

---

## License

ISC

---

## Support

For technical issues or questions about the chatbot implementation, please contact the development team.

**For mental health support:**
- Contact your institution's counseling services
- Call a crisis helpline in your region
- Reach out to a trusted friend, family member, or mental health professional
