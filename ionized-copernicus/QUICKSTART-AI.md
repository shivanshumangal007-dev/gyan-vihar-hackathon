# QUICK START - Hybrid AI Chatbot

## 1. Get OpenAI API Key (2 minutes)

1. Go to: https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)

## 2. Configure Environment

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and add your API key:
```
OPENAI_API_KEY=sk-your-actual-key-here
AI_MODE=true
```

## 3. Restart Server

Stop the current server (Ctrl+C) and restart:
```bash
.\start-server.bat
```

You should see:
```
============================================================
Mental First-Aid Chatbot v2.0 (HYBRID AI)
============================================================
AI Mode: ENABLED ✓
```

## 4. Test It!

Run the interactive chat:
```bash
.\chat.bat
```

Try these:
- "I'm feeling really nervous about my exam tomorrow"
- "None of those options work for me, what else can I do?"
- "Everything feels hopeless" (should use template, not AI)

## Done! 🎉

The hybrid system is now running:
- ✅ AI for natural conversation
- ✅ Keyword crisis detection (safety)
- ✅ Template fallbacks (reliability)
