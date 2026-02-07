# Example Responses

This document shows example responses for different intensity levels and scenarios.

---

## LOW INTENSITY Examples

### Example 1: Mild Stress
**User Input:**
> "I feel a bit overwhelmed with assignments"

**Chatbot Response:**
```json
{
  "emotion": "academic",
  "intensity": "low",
  "message": "Academic pressure can feel overwhelming. Want to take a small break?",
  "actions": [
    { "label": "Quick break activity", "action": "break" },
    { "label": "Study tips", "action": "study_tips" },
    { "label": "Keep chatting", "action": "chat" }
  ]
}
```

---

### Example 2: Mild Anxiety
**User Input:**
> "I'm a bit nervous about tomorrow"

**Chatbot Response:**
```json
{
  "emotion": "anxiety",
  "intensity": "low",
  "message": "I hear you. It's okay to feel nervous. Want to try something grounding?",
  "actions": [
    { "label": "Grounding exercise", "action": "grounding" },
    { "label": "Breathe", "action": "breathing" },
    { "label": "Keep chatting", "action": "chat" }
  ]
}
```

---

### Example 3: Mild Tiredness
**User Input:**
> "I'm tired"

**Chatbot Response:**
```json
{
  "emotion": "stress",
  "intensity": "low",
  "message": "That sounds really tiring. Would you like to slow down for a moment?",
  "actions": [
    { "label": "Breathe", "action": "breathing" },
    { "label": "Play a calming game", "action": "game" },
    { "label": "Keep chatting", "action": "chat" }
  ]
}
```

---

## MEDIUM INTENSITY Examples

### Example 4: Moderate Stress
**User Input:**
> "I can't focus on anything and I'm exhausted all the time"

**Chatbot Response:**
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

### Example 5: Moderate Anxiety
**User Input:**
> "I'm worried constantly and it's too much to handle"

**Chatbot Response:**
```json
{
  "emotion": "anxiety",
  "intensity": "medium",
  "message": "I can hear this feels intense. You're not alone in this moment.",
  "actions": [
    { "label": "Grounding exercise", "action": "grounding" },
    { "label": "Breathing technique", "action": "breathing" },
    { "label": "Keep chatting", "action": "chat" }
  ]
}
```

---

### Example 6: Academic Pressure
**User Input:**
> "I'm struggling with my studies and failing everything"

**Chatbot Response:**
```json
{
  "emotion": "academic",
  "intensity": "medium",
  "message": "Academic stress can feel crushing. Let's take this one step at a time.",
  "actions": [
    { "label": "Break activity", "action": "break" },
    { "label": "Talk to someone", "action": "peer_support" },
    { "label": "Keep chatting", "action": "chat" }
  ]
}
```

---

## HIGH INTENSITY (Crisis) Examples

### Example 7: Hopelessness
**User Input:**
> "Everything feels hopeless and I don't know if I can keep going"

**Chatbot Response:**
```json
{
  "emotion": "sadness",
  "intensity": "high",
  "message": "I'm really glad you reached out. You don't have to handle this alone. I can show you support options if you want.",
  "actions": [
    { "label": "Talk to a counselor", "action": "counselor" },
    { "label": "Crisis helpline", "action": "helpline" },
    { "label": "Continue chatting", "action": "chat" }
  ]
}
```

---

### Example 8: Panic
**User Input:**
> "I'm panicking and falling apart, I can't breathe"

**Chatbot Response:**
```json
{
  "emotion": "anxiety",
  "intensity": "high",
  "message": "I'm really glad you reached out. You don't have to handle this alone. I can show you support options if you want.",
  "actions": [
    { "label": "Talk to a counselor", "action": "counselor" },
    { "label": "Crisis helpline", "action": "helpline" },
    { "label": "Continue chatting", "action": "chat" }
  ]
}
```

---

### Example 9: Giving Up
**User Input:**
> "I feel like giving up on everything"

**Chatbot Response:**
```json
{
  "emotion": "sadness",
  "intensity": "high",
  "message": "I'm really glad you reached out. You don't have to handle this alone. I can show you support options if you want.",
  "actions": [
    { "label": "Talk to a counselor", "action": "counselor" },
    { "label": "Crisis helpline", "action": "helpline" },
    { "label": "Continue chatting", "action": "chat" }
  ]
}
```

---

## EDGE CASE Examples

### Example 10: Unclear Message
**User Input:**
> "asdfgh"

**Chatbot Response:**
```json
{
  "emotion": "unknown",
  "intensity": "low",
  "message": "I'm here to listen. Would you like to try something calming?",
  "actions": [
    { "label": "Breathe", "action": "breathing" },
    { "label": "Play a game", "action": "game" },
    { "label": "Keep chatting", "action": "chat" }
  ]
}
```

---

### Example 11: Anger
**User Input:**
> "This is stupid and useless"

**Chatbot Response:**
```json
{
  "emotion": "unknown",
  "intensity": "low",
  "message": "I'm here to listen. Would you like to try something calming?",
  "actions": [
    { "label": "Breathe", "action": "breathing" },
    { "label": "Play a game", "action": "game" },
    { "label": "Keep chatting", "action": "chat" }
  ]
}
```

**Note:** The chatbot responds calmly and neutrally to anger, treating it as low intensity unless combined with crisis keywords.

---

### Example 12: Loneliness
**User Input:**
> "I feel so lonely and nobody cares"

**Chatbot Response:**
```json
{
  "emotion": "loneliness",
  "intensity": "medium",
  "message": "Feeling isolated is really painful. You deserve support.",
  "actions": [
    { "label": "Peer support", "action": "peer_support" },
    { "label": "Calming activity", "action": "breathing" },
    { "label": "Keep chatting", "action": "chat" }
  ]
}
```

---

## Key Observations

### Safety Constraints (ALL responses follow these):
- ✓ No diagnosis ("you have depression")
- ✓ No medical advice
- ✓ No promises ("everything will be okay")
- ✓ No invalidation of feelings
- ✓ Brief and limited (< 200 characters)
- ✓ Calm and empathetic tone

### Response Patterns:
- **Low intensity**: Simple suggestion + 2-3 self-help actions
- **Medium intensity**: Validation + grounding/breathing + option to talk
- **High intensity**: Calm support offer + professional help options + user control

### Action Routing:
- `breathing` → Breathing exercise
- `grounding` → Grounding technique
- `game` → Calming game/activity
- `chat` → Continue conversation
- `counselor` → Connect with counselor
- `helpline` → Crisis helpline
- `peer_support` → Peer support groups
- `study_tips` → Academic resources
- `sleep_tips` → Sleep hygiene resources
