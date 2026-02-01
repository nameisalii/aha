import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';
import { Link, useNavigate } from 'react-router-dom';
import { ChatIcon } from '../components/Icons';

export default function ReusePage() {
    const { listings } = useApp();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('GIVE'); // 'GIVE' or 'LEND'
    const [search, setSearch] = useState('');

    const reuseListings = listings.filter(l => l.category === 'reuse' && l.status === 'active');

    const filteredListings = reuseListings.filter(item => {
        if (activeTab === 'GIVE' && item.type !== 'give') return false;
        if (activeTab === 'LEND' && item.type !== 'lend') return false;

        const tagMatch = item.hashtags?.some(t => {
            const normalizedTag = `#${t.toLowerCase()}`;
            const normalizedSearch = search.toLowerCase();
            return normalizedTag === normalizedSearch || t.toLowerCase() === normalizedSearch;
        });

        if (!search.trim()) return true;
        return item.title.toLowerCase().includes(search.toLowerCase()) || tagMatch;
    });

    const categories = ['#university-event', '#food', '#furniture', '#clothing', '#electronics', '#books'];

    return (
        <div className="container">
            {/* Tabs & Chat */}
            <div className="tabs-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '0 16px', background: 'var(--color-accent)' }}>
                <div style={{ display: 'flex', flex: 1, gap: '8px', background: 'var(--color-primary)', padding: '6px', borderRadius: '12px' }}>
                    <button
                        className={`tab-btn ${activeTab === 'GIVE' ? 'active' : ''}`}
                        onClick={() => setActiveTab('GIVE')}
                        style={{ flex: 1, borderRadius: '8px', fontSize: '12px', border: 'none' }}
                    >
                        FREE / GIVE
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'LEND' ? 'active' : ''}`}
                        onClick={() => setActiveTab('LEND')}
                        style={{ flex: 1, borderRadius: '8px', fontSize: '12px', border: 'none' }}
                    >
                        BORROW / LEND
                    </button>
                </div>
                <Link to="/chat" className="btn-icon" style={{ color: 'var(--color-primary)', display: 'flex', fontSize: '24px', padding: '8px' }}>
                    <ChatIcon />
                </Link>
            </div>

            {/* Filter Section */}
            <div style={{ padding: '0 16px', margin: '8px 0' }}>
                <div className="tag-filter">FIND BY TYPE:</div>
                <div className="tags-scroll">
                    {categories.map(tag => (
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
            <div style={{ padding: '0 16px' }}>
                {filteredListings.length > 0 ? (
                    filteredListings.map(item => (
                        <ItemCard key={item.id} item={item} onTagClick={setSearch} />
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-primary-light)' }}>
                        <p>No {activeTab === 'GIVE' ? 'items to give' : 'items to lend'} found.</p>
                    </div>
                )}
            </div>

            {/* Float Action Button */}
            <button
                className="btn btn-primary btn-icon"
                onClick={() => navigate('/publish?category=reuse')}
                style={{
                    position: 'fixed',
                    bottom: '100px',
                    right: '24px',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'var(--color-accent)',
                    color: 'var(--color-primary)',
                    fontSize: '24px',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 10
                }}
            >
                +
            </button>
        </div>
    );
}
