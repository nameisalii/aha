import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';
import { Link, useNavigate } from 'react-router-dom';
import { ChatIcon } from '../components/Icons';

export default function RidePage() {
    const { listings } = useApp();
    const navigate = useNavigate();
    const [view, setView] = useState('LIST'); // 'LIST' or 'MAP'
    const [activeTab, setActiveTab] = useState('OFFERS');
    const [search, setSearch] = useState('');

    const rideListings = listings.filter(l => l.category === 'ride' && l.status === 'active');

    const filteredListings = rideListings.filter(item => {
        if (view === 'LIST') {
            if (activeTab === 'OFFERS' && item.type !== 'offer') return false;
            if (activeTab === 'REQUESTS' && item.type !== 'request') return false;
        }

        if (!search.trim()) return true;
        const tagMatch = item.hashtags?.some(t => {
            const normalizedTag = `#${t.toLowerCase()}`;
            const normalizedSearch = search.toLowerCase();
            return normalizedTag === normalizedSearch || t.toLowerCase() === normalizedSearch;
        });
        return item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.destination?.toLowerCase().includes(search.toLowerCase()) ||
            tagMatch;
    });

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            {/* View Switch & Chat */}
            <div className="tabs-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '0 16px', background: 'var(--color-accent)' }}>
                <div style={{ display: 'flex', flex: 1, gap: '4px', background: 'var(--color-primary)', padding: '6px', borderRadius: '12px' }}>
                    <button
                        className={`tab-btn ${view === 'LIST' && activeTab === 'OFFERS' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('OFFERS'); setView('LIST'); }}
                        style={{ flex: 1, borderRadius: '8px', fontSize: '11px', padding: '8px 4px', border: 'none' }}
                    >
                        OFFERS
                    </button>
                    <button
                        className={`tab-btn ${view === 'MAP' ? 'active' : ''}`}
                        onClick={() => setView('MAP')}
                        style={{ flex: 1, borderRadius: '8px', fontSize: '11px', padding: '8px 4px', border: 'none' }}
                    >
                        MAP
                    </button>
                    <button
                        className={`tab-btn ${view === 'LIST' && activeTab === 'REQUESTS' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('REQUESTS'); setView('LIST'); }}
                        style={{ flex: 1, borderRadius: '8px', fontSize: '11px', padding: '8px 4px', border: 'none' }}
                    >
                        REQUESTS
                    </button>
                </div>
                <Link to="/chat" className="btn-icon" style={{ color: 'var(--color-primary)', display: 'flex', fontSize: '24px', padding: '8px' }}>
                    <ChatIcon />
                </Link>
            </div>

            <div className="tag-filter" style={{ fontSize: '11px', fontWeight: 'bold' }}>FILTER BY:</div>
            <div className="tags-scroll" style={{ marginTop: '4px' }}>
                {['#university-event', '#airport', '#groceries', '#mall', '#hospital'].map(tag => (
                    <span
                        key={tag}
                        className={`tag ${search.toLowerCase() === tag.toLowerCase() ? 'active' : ''}`}
                        onClick={() => setSearch(search.toLowerCase() === tag.toLowerCase() ? '' : tag)}
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {view === 'LIST' ? (
                <div style={{ padding: '16px 0' }}>
                    {filteredListings.length > 0 ? (
                        filteredListings.map(item => (
                            <ItemCard key={item.id} item={item} onTagClick={setSearch} />
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-primary-light)' }}>
                            <p>No content found.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div style={{ padding: '16px', margin: '16px', height: '50vh', background: '#E0E7D1', borderRadius: '12px', position: 'relative', overflow: 'hidden', border: '2px solid var(--color-primary)' }}>
                    {/* Mock Map Background */}
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.2, background: 'repeating-linear-gradient(45deg, #2A422D 0, #2A422D 1px, transparent 0, transparent 50%)', backgroundSize: '30px 30px' }}></div>

                    {/* Map Pins */}
                    {filteredListings.map((item, i) => (
                        <div
                            key={item.id}
                            style={{
                                position: 'absolute',
                                left: `${30 + (i * 20)}%`,
                                top: `${40 + (i * 10)}%`,
                                cursor: 'pointer',
                                textAlign: 'center'
                            }}
                            onClick={() => {
                                alert(`Ride to ${item.location || item.title} by ${item.sellerName}`);
                            }}
                        >
                            <div style={{
                                background: 'var(--color-primary)',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                whiteSpace: 'nowrap',
                                marginBottom: '2px'
                            }}>
                                {item.sellerName}
                            </div>
                            <div style={{ fontSize: '24px' }}>📍</div>
                        </div>
                    ))}
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', background: 'rgba(255,255,255,0.9)', padding: '10px', borderRadius: '8px', fontSize: '11px', color: 'var(--color-primary)', fontWeight: '500' }}>
                        Showing ride requests and offers near you.
                    </div>
                </div>
            )}

            {/* Float Action Button */}
            <button
                className="btn btn-primary btn-icon"
                onClick={() => navigate('/publish?category=ride')}
                style={{
                    position: 'fixed',
                    bottom: '100px',
                    right: '20px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'var(--color-accent)',
                    color: 'var(--color-primary)',
                    fontSize: '24px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                +
            </button>
        </div>
    );
}
