import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ChatIcon } from './Icons';

export default function ItemCard({ item, showActions = false, onEdit, onDelete, onDone }) {
    const navigate = useNavigate();
    const { currentUser, startChat } = useApp();

    const handleChat = (e) => {
        e.stopPropagation();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        const chatId = startChat(item.sellerId, item.id);
        if (chatId) {
            navigate(`/chat/${chatId}`);
        }
    };

    const isOwner = currentUser?.id === item.sellerId;
    const isSold = item.status === 'sold';

    return (
        <div className={`card ${isSold ? 'card-overlay disabled' : ''}`}>
            <img
                src={item.images?.[0] || 'https://via.placeholder.com/400'}
                alt={item.title}
                className="card-image"
            />
            <div className="card-body">
                <h3 className="card-title">{item.title}</h3>
                <p className="card-description">{item.description}</p>
                <div className="card-seller">
                    <div className="card-seller-avatar">
                        {item.sellerName?.charAt(0)}
                    </div>
                    <span>{item.sellerName}</span>
                </div>
                {item.hashtags?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                        {item.hashtags.slice(0, 3).map((tag, i) => (
                            <span key={i} style={{
                                background: 'rgba(46, 125, 50, 0.1)',
                                color: 'var(--color-primary)',
                                fontSize: '11px',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontWeight: '500'
                            }}>#{tag}</span>
                        ))}
                    </div>
                )}

                {showActions && isOwner && !isSold ? (
                    <div className="card-actions">
                        <button className="btn btn-sm btn-secondary" onClick={() => onEdit?.(item)}>
                            Edit
                        </button>
                        <button className="btn btn-sm btn-secondary" onClick={() => onDelete?.(item)}>
                            Delete
                        </button>
                        <button className="btn btn-sm btn-primary" onClick={() => onDone?.(item)}>
                            Done
                        </button>
                    </div>
                ) : isSold ? (
                    <div className="badge badge-success">Sold</div>
                ) : !isOwner && (
                    <button className="btn btn-sm btn-primary" onClick={handleChat}>
                        <ChatIcon />
                        Chat
                    </button>
                )}
            </div>
        </div>
    );
}
