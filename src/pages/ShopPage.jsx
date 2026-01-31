import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';

export default function ShopPage() {
    const { listings } = useApp();
    const [search, setSearch] = useState('');

    const activeListings = listings.filter(l => l.status === 'active');

    const filteredListings = activeListings.filter(item => {
        if (!search.trim()) return true;
        const query = search.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(query);
        const matchDesc = item.description?.toLowerCase().includes(query);
        const matchTags = item.hashtags?.some(tag => tag.toLowerCase().includes(query));
        const matchSeller = item.sellerName?.toLowerCase().includes(query);
        return matchTitle || matchDesc || matchTags || matchSeller;
    });

    return (
        <div className="main-content">
            <div className="container page-padding">
                {/* Hero Section */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 className="heading-1" style={{ marginBottom: '12px' }}>
                        Anyone has a...
                    </h1>
                    <p className="text-body text-muted" style={{ maxWidth: '500px', margin: '0 auto' }}>
                        Give your items a second life. Buy, sell, and trade with fellow students for karma points.
                    </p>
                </div>

                {/* Search Bar */}
                <div style={{
                    maxWidth: '500px',
                    margin: '0 auto 40px',
                    position: 'relative'
                }}>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search items, hashtags, or sellers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            paddingLeft: '48px',
                            height: '52px',
                            fontSize: '16px',
                            borderRadius: '26px',
                            border: '2px solid var(--color-gray-200)',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                    />
                    <svg
                        style={{
                            position: 'absolute',
                            left: '18px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '20px',
                            height: '20px',
                            color: 'var(--color-gray-400)'
                        }}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                </div>

                {/* Listings Grid */}
                {filteredListings.length > 0 ? (
                    <div className="shop-grid">
                        {filteredListings.map(item => (
                            <ItemCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">🔍</div>
                        <h3>{search ? 'No items found' : 'No items available'}</h3>
                        <p>{search ? `No results for "${search}"` : 'Be the first to list an item!'}</p>
                        {search && (
                            <button
                                className="btn btn-secondary mt-4"
                                onClick={() => setSearch('')}
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
