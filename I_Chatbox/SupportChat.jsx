import React, { useState, useRef, useEffect } from 'react';
import './SupportChat.css';

const SupportChat = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'ai',
            text: `Hello. This is a safe space for you to express what you're feeling.Take your time.`,
      timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = () => {
        if (inputValue.trim() === '') return;

        const userMessage = {
            id: messages.length + 1,
            sender: 'user',
            text: inputValue,
            timestamp: new Date()
        };

        setMessages([...messages, userMessage]);
        setInputValue('');

        // Simulate AI typing and response
        setIsTyping(true);
        setTimeout(() => {
            const aiMessage = {
                id: messages.length + 2,
                sender: 'ai',
                text: `I hear what you're sharing.Would you like to tell me more about how that makes you feel?`,
        timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
        }, 2000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="support-chat-container">
            <div className="chat-wrapper">
                <header className="chat-header">
                    <h1 className="header-title">Anonymous Support Chat</h1>
                    <p className="header-subtitle">You are not logged in. This conversation is anonymous.</p>
                </header>

                <div className="chat-messages">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`message-wrapper ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
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
                        disabled={inputValue.trim() === ''}
                    >
                        Send
                    </button>
                </div>

                <footer className="chat-footer">
                    <p className="disclaimer-text">
                        This is not a medical service. For emergencies, contact local support.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default SupportChat;
