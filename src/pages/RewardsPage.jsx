import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';

export default function RewardsPage() {
    const { currentUser, listings, updateUser, logout } = useApp();
    const [activeTab, setActiveTab] = useState('REWARDS');
    const [editForm, setEditForm] = useState({
        name: currentUser?.name || '',
        phone: currentUser?.phone || ''
    });

    const rewardListings = listings.filter(l => l.category === 'reuse' && l.status === 'active');

    const handleUpdate = (e) => {
        e.preventDefault();
        updateUser(editForm);
    };

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            {/* Top Navigation for Rewards/Account */}
            <div className="tabs-container" style={{ margin: '0', display: 'flex', gap: '8px', padding: '16px' }}>
                <button
                    className={`tab-btn ${activeTab === 'REWARDS' ? 'active' : ''}`}
                    onClick={() => setActiveTab('REWARDS')}
                    style={{ flex: 1 }}
                >
                    MY REWARDS
                </button>
                <button
                    className={`tab-btn ${activeTab === 'ACCOUNT' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ACCOUNT')}
                    style={{ flex: 1 }}
                >
                    ACCOUNT
                </button>
            </div>

            {activeTab === 'REWARDS' ? (
                <>
                    {/* Top Points & Stars - Match Image 4 */}
                    <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-accent)', margin: '0 0 16px 0' }}>
                        <div style={{ background: 'var(--color-primary)', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                            5,000 points
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <span key={i} style={{ fontSize: '18px', color: '#FBC02D' }}>★</span>
                            ))}
                        </div>
                    </div>

                    {/* Filter Section */}
                    <div style={{ padding: '0 16px', marginBottom: '16px' }}>
                        <div className="tag-filter" style={{ fontSize: '11px', fontWeight: 'bold' }}>FILTER BY:</div>
                        <div className="tags-scroll" style={{ marginTop: '4px' }}>
                            {['#food', '#coffee', '#dessert', '#clothing', '#services'].map(tag => (
                                <span
                                    key={tag}
                                    className={`tag active`}
                                    style={{ background: '#FBC02D', color: 'var(--color-primary)' }}
                                    onClick={() => { }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* List */}
                    <div style={{ padding: '0 16px' }}>
                        {rewardListings.map(item => (
                            <ItemCard key={item.id} item={item} />
                        ))}
                    </div>

                    {/* Float Action Button */}
                    <div style={{ position: 'fixed', bottom: '100px', right: '20px', zIndex: 10 }}>
                        <button
                            className="btn btn-primary"
                            style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '12px',
                                background: 'var(--color-accent)',
                                color: 'var(--color-primary)',
                                fontSize: '24px',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            +
                        </button>
                    </div>
                </>
            ) : (
                <div style={{ padding: '16px' }}>
                    <form onSubmit={handleUpdate} className="card" style={{ padding: '24px', background: 'var(--color-surface)' }}>
                        <h3 style={{ marginBottom: '20px', color: 'var(--color-primary)' }}>Edit Personal Details</h3>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={editForm.name}
                                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="text"
                                className="form-input"
                                value={editForm.phone}
                                onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-full mt-4">Save Changes</button>
                    </form>

                    <button
                        className="btn btn-outline w-full mt-8"
                        onClick={logout}
                        style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                    >
                        Log Out
                    </button>
                </div>
            )}
        </div>
    );
}
