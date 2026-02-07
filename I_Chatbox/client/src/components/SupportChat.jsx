import React, { useState, useRef, useEffect } from 'react';

const SupportChat = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'ai',
            text: 'Hello. This is a safe space for you to express what you\'re feeling. Take your time.',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [actions, setActions] = useState([]);
    const [error, setError] = useState(null);
    const chatEndRef = useRef(null);

    // Get API URL from environment variable or fallback to same-origin
    const API_BASE_URL = import.meta.env.VITE_API_URL || '';

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, actions]);

    const handleSend = async (messageText = inputValue) => {
        const textToSend = messageText.trim();
        if (textToSend === '') return;

        const userMessage = {
            id: Date.now(),
            sender: 'user',
            text: textToSend,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setActions([]); // Clear previous actions
        setError(null);
        setIsTyping(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: textToSend,
                    sessionId: 'anonymous_session'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response from server');
            }

            const data = await response.json();

            const aiMessage = {
                id: Date.now() + 1,
                sender: 'ai',
                text: data.response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
            setActions(data.actions || []);
        } catch (err) {
            console.error('Error:', err);
            setError('Unable to connect to the support service. Please try again.');

            const errorMessage = {
                id: Date.now() + 2,
                sender: 'ai',
                text: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleActionClick = (action) => {
        // Log action click for analytics if needed
        console.log(`Action clicked: ${action}`);

        // Some actions might just trigger a new message
        if (action === 'chat') {
            handleSend("I'd like to keep talking.");
        } else {
            // Placeholder for other actions like "breathing", "grounding", etc.
            // In a full app, these would navigate to actual exercise pages
            const feedbackMessage = {
                id: Date.now() + 3,
                sender: 'ai',
                text: `You selected: ${action}. This feature is coming soon to help you even more! For now, we can continue chatting if you'd like.`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, feedbackMessage]);
        }
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

                    {actions.length > 0 && (
                        <div className="actions-container">
                            <p className="actions-label">Suggested for you:</p>
                            <div className="actions-buttons">
                                {actions.map((item, index) => (
                                    <button
                                        key={index}
                                        className="action-button"
                                        onClick={() => handleActionClick(item.action)}
                                    >
                                        {item.label}
                                    </button>
                                ))}
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
                        onClick={() => handleSend()}
                        disabled={inputValue.trim() === '' || isTyping}
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
