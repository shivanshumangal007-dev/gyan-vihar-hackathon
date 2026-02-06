# Anonymous Support Chat - Full-Stack Application

A calm, minimal, judge-safe AI-guided support chat interface built with React (Vite) frontend and Express backend.

## 🎯 Features

- **Anonymous & Private** - No login required, conversations are anonymous
- **Calm Design** - Dark neutral theme with soft gradients, professional and trustworthy
- **AI-Powered** - Reflective, non-judgmental responses (AI model integration required)
- **Real-time Chat** - Smooth typing indicators and message animations
- **Responsive** - Works on desktop and mobile devices

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v18 or higher) - [Download from nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js)

Verify installation:
```bash
node --version
npm --version
```

## 🚀 Quick Start

### 1. Install Dependencies

**Frontend:**
```bash
cd client
npm install
```

**Backend:**
```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` and add your AI API key (see AI Integration section below).

### 3. Start Development Servers

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```
Server will start on `http://localhost:5000`

**Terminal 2 - Frontend Dev Server:**
```bash
cd client
npm run dev
```
Frontend will start on `http://localhost:5173`

### 4. Open in Browser

Navigate to `http://localhost:5173` to see the application.

## 🤖 AI Model Integration

**IMPORTANT:** The backend includes a placeholder for your AI model. You need to integrate your own AI service.

### Integration Steps:

1. **Choose your AI service** (OpenAI, Anthropic, Google Gemini, etc.)

2. **Install the SDK:**
   ```bash
   cd server
   npm install openai  # or @anthropic-ai/sdk or @google/generative-ai
   ```

3. **Add API key to `.env`:**
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. **Update `server/config/ai.js`:**
   - The file contains detailed examples for OpenAI, Anthropic, and Google Gemini
   - Replace the `getAIResponse()` function with your implementation
   - Use the suggested system prompt for appropriate responses

### Example AI Integration (OpenAI):

```javascript
// server/config/ai.js
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getAIResponse(userMessage, conversationHistory) {
  const messages = conversationHistory.map(msg => ({
    role: msg.role === 'assistant' ? 'assistant' : 'user',
    content: msg.content
  }));

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a supportive, reflective listener. Respond with empathy and without giving advice or diagnosis."
      },
      ...messages
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}
```

## 📁 Project Structure

```
Cybrathon/
├── client/                      # Frontend (Vite + React)
│   ├── src/
│   │   ├── components/
│   │   │   └── SupportChat.jsx  # Main chat component
│   │   ├── App.jsx              # App wrapper
│   │   ├── App.css              # Global styles
│   │   └── main.jsx             # Entry point
│   ├── index.html
│   ├── vite.config.js           # Vite config with proxy
│   └── package.json
│
├── server/                      # Backend (Express)
│   ├── routes/
│   │   └── chat.js              # Chat API routes
│   ├── config/
│   │   └── ai.js                # AI model integration (CUSTOMIZE THIS)
│   ├── server.js                # Express server
│   └── package.json
│
├── .env.example                 # Environment variables template
└── README.md
```

## 🔌 API Endpoints

### POST `/api/chat`
Send a message and receive AI response.

**Request:**
```json
{
  "message": "I'm feeling overwhelmed",
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "response": "I hear what you're sharing. Would you like to tell me more about how that makes you feel?",
  "sessionId": "session-id"
}
```

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## 🎨 Design Philosophy

- **No medical claims** - Avoids therapy/diagnosis language
- **Reflective responses** - AI listens and asks open-ended questions
- **Emotionally safe** - Non-judgmental, calm tone
- **Professional aesthetic** - Suitable for college-admin demos
- **Clear disclaimers** - "This is not a medical service"

## 🛠️ Development

### Frontend Development
```bash
cd client
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend Development
```bash
cd server
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start without auto-reload
```

## 📦 Production Build

### Build Frontend
```bash
cd client
npm run build
```

The build output will be in `client/dist/`. You can serve this with any static file server or integrate it with your backend.

### Deploy Backend
```bash
cd server
npm start
```

Set `NODE_ENV=production` in your environment variables.

## 🔒 Security & Privacy

- No user authentication or data storage (currently in-memory)
- Conversations are anonymous
- For production, consider:
  - Adding rate limiting
  - Implementing proper session management
  - Using a database for conversation history
  - Adding HTTPS
  - Implementing content moderation

## ⚠️ Important Notes

1. **AI Integration Required** - The app uses placeholder responses until you integrate your AI model
2. **Not Medical Service** - Include appropriate disclaimers
3. **Emergency Handling** - Consider adding crisis hotline information
4. **Content Moderation** - Implement safeguards for harmful content

## 🤝 Language Guidelines

**Use:** share, express, feel, reflect, notice, experience  
**Avoid:** therapy, diagnosis, cure, treatment, fix, solve, should

## 📝 License

MIT

## 🆘 Support

For emergencies, contact local support services:
- National Suicide Prevention Lifeline: 988 (US)
- Crisis Text Line: Text HOME to 741741 (US)
- International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/

---

**Built for Cybrathon Hackathon**
