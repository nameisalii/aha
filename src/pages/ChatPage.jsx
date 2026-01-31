import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SendIcon, ChatIcon } from '../components/Icons';

export default function ChatPage() {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const { currentUser, getUserChats, chats, sendMessage } = useApp();
    const messagesEndRef = useRef(null);

    const [message, setMessage] = useState('');
    const userChats = getUserChats();

    const activeChat = chatId ? chats.find(c => c.id === chatId) : null;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeChat?.messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim() || !activeChat) return;
        sendMessage(activeChat.id, message.trim());
        setMessage('');
    };

    const getOtherUser = (chat) => {
        return chat.buyerId === currentUser.id
            ? { name: chat.sellerName, id: chat.sellerId }
            : { name: chat.buyerName, id: chat.buyerId };
    };

    return (
        <div className="main-content">
            <div className="chat-layout">
                {/* Sidebar */}
                <div className="chat-sidebar">
                    <div className="chat-sidebar-header">
                        <h2 className="heading-4">Messages</h2>
                    </div>
                    <div className="chat-list">
                        {userChats.length > 0 ? (
                            userChats.map(chat => {
                                const other = getOtherUser(chat);
                                return (
                                    <div
                                        key={chat.id}
                                        className={`chat-item ${chat.id === chatId ? 'active' : ''}`}
                                        onClick={() => navigate(`/chat/${chat.id}`)}
                                    >
                                        <div className="chat-item-avatar">
                                            {other.name?.charAt(0)}
                                        </div>
                                        <div className="chat-item-content">
                                            <div className="chat-item-name">{other.name}</div>
                                            <div className="chat-item-preview">
                                                {chat.lastMessage || chat.listingTitle || 'Start a conversation'}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="empty-state" style={{ padding: '32px 16px' }}>
                                <p className="text-muted">No conversations yet</p>
                                <p className="text-small text-muted">Chat with sellers from the Shop!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Main */}
                {activeChat ? (
                    <div className="chat-main">
                        <div className="chat-main-header">
                            <div className="chat-item-avatar">
                                {getOtherUser(activeChat).name?.charAt(0)}
                            </div>
                            <div>
                                <div className="chat-item-name">{getOtherUser(activeChat).name}</div>
                                <div className="text-small text-muted">{activeChat.listingTitle}</div>
                            </div>
                        </div>

                        <div className="chat-messages">
                            {/* Listing Preview */}
                            {activeChat.listingImage && (
                                <div style={{
                                    alignSelf: 'center',
                                    background: 'var(--color-surface)',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    marginBottom: '16px'
                                }}>
                                    <img
                                        src={activeChat.listingImage}
                                        alt={activeChat.listingTitle}
                                        style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: '600' }}>{activeChat.listingTitle}</div>
                                        <div className="text-small text-muted">Discussing this item</div>
                                    </div>
                                </div>
                            )}

                            {activeChat.messages?.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`chat-message ${msg.senderId === currentUser.id ? 'sent' : ''}`}
                                >
                                    <div className="chat-message-avatar">
                                        {msg.senderName?.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="chat-message-bubble">{msg.content}</div>
                                        <div className="chat-message-time">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="chat-input-container">
                            <form className="chat-input-wrapper" onSubmit={handleSend}>
                                <input
                                    type="text"
                                    className="chat-input"
                                    placeholder="Type a message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <button type="submit" className="btn btn-primary btn-icon" disabled={!message.trim()}>
                                    <SendIcon />
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="chat-empty">
                        <div className="chat-empty-icon">
                            <ChatIcon />
                        </div>
                        <h3>Select a conversation</h3>
                        <p className="text-muted">Choose a chat from the sidebar to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
}
