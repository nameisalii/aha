import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ItemCard({ item, showActions = false, onEdit, onDelete, onDone, onTagClick }) {
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
        <div
            className={`item-bubble ${isSold ? 'disabled' : ''}`}
            onClick={!isOwner ? handleChat : undefined}
            style={{
                margin: '0 16px 16px',
                background: '#FFF9C4',
                borderRadius: '24px',
                padding: '24px',
                display: 'flex',
                gap: '16px',
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}
        >
            <div className="item-bubble-avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#D9D9D9', flexShrink: 0 }}>
                {/* Empty grey circle as in mockup */}
            </div>
            <div className="item-bubble-content" style={{ flex: 1 }}>
                <div className="item-bubble-text" style={{ fontSize: '15px', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', lineHeight: '1.2' }}>
                    <span className="item-bubble-name" style={{
                        fontWeight: '600',
                        background: 'var(--color-primary)',
                        color: 'white',
                        padding: '4px 16px',
                        borderRadius: '24px',
                        fontSize: '13px'
                    }}>
                        {item.sellerName || 'Someone'}
                    </span>
                    <span style={{ fontWeight: '500', color: 'var(--color-primary)' }}>
                        {item.category === 'run'
                            ? (item.type === 'request' ? 'is anybody going to' : 'is going to')
                            : (item.category === 'ride'
                                ? (item.type === 'offer' ? 'is offering a ride share to' : 'is requesting a ride share to')
                                : 'is offering')
                        }
                    </span>
                    <span className="item-bubble-target" style={{
                        fontWeight: '600',
                        background: 'var(--color-primary)',
                        color: 'white',
                        padding: '4px 16px',
                        borderRadius: '24px',
                        fontSize: '13px'
                    }}>
                        {item.category === 'reuse' ? item.title : (item.location || item.title)}
                    </span>
                </div>

                {item.category === 'reuse' && (
                    <div style={{ fontSize: '14px', color: 'var(--color-primary)', fontWeight: '500', marginTop: '2px', paddingLeft: '4px' }}>
                        at {item.location}
                    </div>
                )}

                <div className="item-bubble-time" style={{ fontSize: '14px', color: 'var(--color-primary)', fontWeight: '500', margin: '4px 0 16px', paddingLeft: '4px' }}>
                    {item.timeInfo || 'Recently'}
                </div>

                {item.description && item.category !== 'run' && (
                    <div style={{ fontSize: '13px', color: 'var(--color-primary)', marginBottom: '16px', opacity: 0.8, paddingLeft: '4px' }}>
                        {item.description}
                    </div>
                )}

                <div className="tags-scroll" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {item.hashtags?.map((tag, i) => (
                        <span
                            key={i}
                            className="tag active"
                            onClick={(e) => {
                                e.stopPropagation();
                                onTagClick?.(`#${tag}`);
                            }}
                            style={{
                                background: '#D4B860',
                                color: 'white',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                border: 'none'
                            }}
                        >
                            #{tag}
                        </span>
                    ))}
                </div>

                {showActions && isOwner && !isSold && (
                    <div className="card-actions" style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                        <button className="btn btn-sm btn-secondary" onClick={(e) => { e.stopPropagation(); onEdit?.(item); }}>Edit</button>
                        <button className="btn btn-sm btn-secondary" onClick={(e) => { e.stopPropagation(); onDelete?.(item); }}>Delete</button>
                        <button className="btn btn-sm btn-primary" onClick={(e) => { e.stopPropagation(); onDone?.(item); }}>Done</button>
                    </div>
                )}
            </div>
        </div>
    );
}
