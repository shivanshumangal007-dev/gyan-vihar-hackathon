import { useState, useRef, useEffect } from "react";

const SupportChat = () => {
  const [actions, setActions] = useState([]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: `Hello. This is a safe space for you to express what you're feeling.Take your time.`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (inputValue.trim() === "") return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/chat`,
        // `https://normal-chatbot-backend.onrender.com/api/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage.text,
            sessionId: "anonymous_session",
          }),
        },
      );

      const data = await res.json();

      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setActions(data.actions || []);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: "ai",
          text: "I'm here with you. Something went wrong, but we can continue.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };
  const handleActionClick = (action) => {
    switch (action) {
      case "breathing":
        window.location.href = "/games/breathing";
        break;

      case "game":
        window.location.href = "/games";
        break;

      case "chat":
        break;

      case "peer_support":
        window.location.href = "/forum";
        break;

      case "counselor":
        window.location.href = "/support/counselor";
        break;

      case "helpline":
        window.location.href = "/support/helpline";
        break;

      default:
        console.log("Unhandled action:", action);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="support-chat-container">
      <div className="chat-wrapper">
        <header className="chat-header">
          <h1 className="header-title">Anonymous Support Chat</h1>
          <p className="header-subtitle">
            You are not logged in. This conversation is anonymous.
          </p>
        </header>

        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-wrapper ${message.sender === "user" ? "user-message" : "ai-message"}`}
            >
              <div className="message-bubble">
                <p className="message-text">{message.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message-wrapper ai-message">
              <div className="message-bubble typing-indicator">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
        {console.log(actions)}
        {actions.length > 0 && (
          <div className="ai-actions">
            {actions.map((item, index) => (
              <button
                key={index}
                className="ai-action-btn"
                onClick={() => handleActionClick(item.action)}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        <div className="chat-input-container">
          <textarea
            className="chat-input"
            placeholder="You can share what's on your mind…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            rows="1"
          />
          <button
            className="send-button"
            onClick={handleSend}
            disabled={inputValue.trim() === ""}
          >
            Send
          </button>
        </div>

        <footer className="chat-footer">
          <p className="disclaimer-text">
            This is not a medical service. For emergencies, contact local
            support.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SupportChat;
