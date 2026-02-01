import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';
import { Link, useNavigate } from 'react-router-dom';
import { ChatIcon } from '../components/Icons';

export default function RunPage() {
    const { listings, currentUser } = useApp();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('OFFERS');
    const [search, setSearch] = useState('');

    const runListings = listings.filter(l => l.category === 'run' && l.status === 'active');

    const filteredListings = runListings.filter(item => {
        if (activeTab === 'OFFERS' && item.type !== 'offer') return false;
        if (activeTab === 'REQUESTS' && item.type !== 'request') return false;

        const tagMatch = item.hashtags?.some(t => {
            const normalizedTag = `#${t.toLowerCase()}`;
            const normalizedSearch = search.toLowerCase();
            return normalizedTag === normalizedSearch || t.toLowerCase() === normalizedSearch;
        });

        if (!search.trim()) return true;
        return item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.location?.toLowerCase().includes(search.toLowerCase()) ||
            tagMatch;
    });

    const hashtags = ['#restaurants', '#time-sensitive', '#groceries', '#coffee', '#bakery'];

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            {/* Tabs & Chat row */}
            <div className="tabs-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '0 16px', background: 'var(--color-accent)' }}>
                <div style={{ display: 'flex', flex: 1, gap: '4px', background: 'var(--color-primary)', padding: '6px', borderRadius: '12px' }}>
                    <button
                        className={`tab-btn ${activeTab === 'OFFERS' ? 'active' : ''}`}
                        onClick={() => setActiveTab('OFFERS')}
                        style={{ flex: 1, borderRadius: '8px', fontSize: '12px', border: 'none' }}
                    >
                        OFFERS
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'REQUESTS' ? 'active' : ''}`}
                        onClick={() => setActiveTab('REQUESTS')}
                        style={{ flex: 1, borderRadius: '8px', fontSize: '12px', border: 'none' }}
                    >
                        REQUESTS
                    </button>
                </div>
                <Link to="/chat" className="btn-icon" style={{ color: 'var(--color-primary)', display: 'flex', fontSize: '24px', padding: '8px' }}>
                    <div style={{ background: '#F4DB60', borderRadius: '4px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ChatIcon />
                    </div>
                </Link>
            </div>

            {/* Filter Section */}
            <div style={{ padding: '0 16px', marginTop: '16px' }}>
                <div className="tag-filter" style={{ fontSize: '11px', fontWeight: 'bold' }}>FILTER BY:</div>
                <div className="tags-scroll" style={{ marginTop: '4px' }}>
                    {hashtags.map(tag => (
                        <span
                            key={tag}
                            className={`tag ${search.toLowerCase() === tag.toLowerCase() ? 'active' : ''}`}
                            onClick={() => setSearch(search.toLowerCase() === tag.toLowerCase() ? '' : tag)}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* List */}
            <div style={{ padding: '16px 0' }}>
                {filteredListings.length > 0 ? (
                    filteredListings.map(item => (
                        <ItemCard key={item.id} item={item} onTagClick={setSearch} />
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-primary-light)' }}>
                        <p>No {activeTab.toLowerCase()} found.</p>
                    </div>
                )}
            </div>

            {/* Float Action Button */}
            <button
                className="btn btn-primary btn-icon"
                onClick={() => navigate('/publish?category=run')}
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
