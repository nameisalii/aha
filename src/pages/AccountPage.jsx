import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';
import Modal from '../components/Modal';
import { LogoutIcon, PointsIcon } from '../components/Icons';

export default function AccountPage() {
    const navigate = useNavigate();
    const { currentUser, listings, transactions, logout, deleteListing, completeSale, updateListing, convertPoints, getUserStats } = useApp();

    const [activeTab, setActiveTab] = useState('listings');
    const [doneModal, setDoneModal] = useState({ open: false, item: null });
    const [editModal, setEditModal] = useState({ open: false, item: null });
    const [pointsModal, setPointsModal] = useState(false);
    const [buyerName, setBuyerName] = useState('');
    const [editForm, setEditForm] = useState({ title: '', description: '' });
    const [pointsAmount, setPointsAmount] = useState(10);
    const [error, setError] = useState('');

    const stats = getUserStats();

    const myListings = listings.filter(l => l.sellerId === currentUser?.id);
    const soldItems = transactions.filter(t => t.sellerId === currentUser?.id);
    const boughtItems = transactions.filter(t => t.buyerId === currentUser?.id);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleEdit = (item) => {
        setEditForm({ title: item.title, description: item.description });
        setEditModal({ open: true, item });
    };

    const handleEditSubmit = () => {
        if (editModal.item) {
            updateListing(editModal.item.id, editForm);
            setEditModal({ open: false, item: null });
        }
    };

    const handleDelete = (item) => {
        if (confirm('Are you sure you want to delete this listing?')) {
            deleteListing(item.id);
        }
    };

    const handleDone = (item) => {
        setBuyerName('');
        setError('');
        setDoneModal({ open: true, item });
    };

    const handleDoneSubmit = () => {
        if (!buyerName.trim()) {
            setError('Please enter the buyer\'s name');
            return;
        }
        const result = completeSale(doneModal.item.id, buyerName);
        if (result.success) {
            setDoneModal({ open: false, item: null });
            setBuyerName('');
        } else {
            setError(result.error);
        }
    };

    const handleConvertPoints = () => {
        const result = convertPoints(pointsAmount);
        if (result.success) {
            setPointsModal(false);
        }
    };

    const tabs = [
        { id: 'listings', label: 'My Listings', count: myListings.filter(l => l.status === 'active').length },
        { id: 'sold', label: 'Sold', count: soldItems.length },
        { id: 'bought', label: 'Bought', count: boughtItems.length },
    ];

    return (
        <div className="main-content">
            {/* Header */}
            <div className="account-header">
                <div className="account-header-inner">
                    <div className="account-avatar">
                        {currentUser?.name?.charAt(0)}
                    </div>
                    <div className="account-info">
                        <h1>{currentUser?.name}</h1>
                        <p className="account-email">{currentUser?.email}</p>
                        <div className="account-stats">
                            <div className="account-stat">
                                <div className="account-stat-value">{stats.active}</div>
                                <div className="account-stat-label">Active</div>
                            </div>
                            <div className="account-stat">
                                <div className="account-stat-value">{stats.sold}</div>
                                <div className="account-stat-label">Sold</div>
                            </div>
                            <div className="account-stat">
                                <div className="account-stat-value">{stats.bought}</div>
                                <div className="account-stat-label">Bought</div>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-ghost" onClick={handleLogout} style={{ marginLeft: 'auto' }}>
                        <LogoutIcon />
                        Logout
                    </button>
                </div>
            </div>

            <div className="container">
                {/* Points Card */}
                <div className="account-points-card">
                    <div className="points-display">
                        <div className="points-icon">🌟</div>
                        <div className="points-info">
                            <h3>Karma Points</h3>
                            <div className="points-value">{currentUser?.points || 0}</div>
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={() => setPointsModal(true)}>
                        <PointsIcon />
                        Trade Points
                    </button>
                </div>

                {/* Tabs */}
                <div className="account-tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`account-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'listings' && (
                    <div className="shop-grid">
                        {myListings.filter(l => l.status === 'active').map(item => (
                            <ItemCard
                                key={item.id}
                                item={item}
                                showActions
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onDone={handleDone}
                            />
                        ))}
                        {myListings.filter(l => l.status === 'active').length === 0 && (
                            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                                <h3>No active listings</h3>
                                <p className="text-muted">Publish an item to get started!</p>
                                <button className="btn btn-primary mt-4" onClick={() => navigate('/publish')}>
                                    Publish Item
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'sold' && (
                    <div className="shop-grid">
                        {soldItems.map(t => (
                            <div key={t.id} className="card">
                                <img src={t.listingImage || 'https://via.placeholder.com/400'} alt={t.listingTitle} className="card-image" />
                                <div className="card-body">
                                    <h3 className="card-title">{t.listingTitle}</h3>
                                    <p className="text-small text-muted">Sold to {t.buyerName}</p>
                                    <div className="badge badge-success mt-4">+5 points earned</div>
                                </div>
                            </div>
                        ))}
                        {soldItems.length === 0 && (
                            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                                <h3>No items sold yet</h3>
                                <p className="text-muted">Your sold items will appear here</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'bought' && (
                    <div className="shop-grid">
                        {boughtItems.map(t => (
                            <div key={t.id} className="card">
                                <img src={t.listingImage || 'https://via.placeholder.com/400'} alt={t.listingTitle} className="card-image" />
                                <div className="card-body">
                                    <h3 className="card-title">{t.listingTitle}</h3>
                                    <p className="text-small text-muted">From {t.sellerName}</p>
                                    <div className="badge badge-success mt-4">+3 points earned</div>
                                </div>
                            </div>
                        ))}
                        {boughtItems.length === 0 && (
                            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                                <h3>No items bought yet</h3>
                                <p className="text-muted">Check out the Shop to find great items!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Done Modal */}
            <Modal
                isOpen={doneModal.open}
                onClose={() => setDoneModal({ open: false, item: null })}
                title="Complete Sale"
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={() => setDoneModal({ open: false, item: null })}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={handleDoneSubmit}>
                            Confirm Sale
                        </button>
                    </>
                }
            >
                <p className="mb-4">Who bought <strong>{doneModal.item?.title}</strong>?</p>
                {error && <p className="form-error mb-4">{error}</p>}
                <input
                    type="text"
                    className="form-input"
                    placeholder="Enter buyer's name"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                />
                <p className="text-small text-muted mt-4">
                    You'll earn +5 points and the buyer will earn +3 points!
                </p>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={editModal.open}
                onClose={() => setEditModal({ open: false, item: null })}
                title="Edit Listing"
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={() => setEditModal({ open: false, item: null })}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={handleEditSubmit}>
                            Save Changes
                        </button>
                    </>
                }
            >
                <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-input"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-input form-textarea"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    />
                </div>
            </Modal>

            {/* Points Modal */}
            <Modal
                isOpen={pointsModal}
                onClose={() => setPointsModal(false)}
                title="Trade Points for Food Points"
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={() => setPointsModal(false)}>
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleConvertPoints}
                            disabled={pointsAmount > (currentUser?.points || 0)}
                        >
                            Convert Points
                        </button>
                    </>
                }
            >
                <p className="mb-4">Convert your sustainability points to Duke food points!</p>
                <div className="form-group">
                    <label className="form-label">Points to convert</label>
                    <input
                        type="number"
                        className="form-input"
                        min="1"
                        max={currentUser?.points || 0}
                        value={pointsAmount}
                        onChange={(e) => setPointsAmount(parseInt(e.target.value) || 0)}
                    />
                    <p className="text-small text-muted mt-2">
                        Available: {currentUser?.points || 0} points
                    </p>
                </div>
                <div className="form-group">
                    <label className="form-label">Duke Card Number</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Enter your Duke card number"
                    />
                </div>
                <div style={{
                    background: 'rgba(46, 125, 50, 0.1)',
                    padding: '16px',
                    borderRadius: '12px',
                    marginTop: '16px'
                }}>
                    <p style={{ fontWeight: '600', color: 'var(--color-primary)' }}>
                        🍕 You'll receive ${(pointsAmount * 0.5).toFixed(2)} in food points!
                    </p>
                </div>
            </Modal>
        </div>
    );
}
