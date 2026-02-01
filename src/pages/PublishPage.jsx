import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ImageIcon, CloseIcon } from '../components/Icons';

export default function PublishPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { createListing } = useApp();
    const fileInputRef = useRef(null);

    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category') || 'run';

    const [form, setForm] = useState({
        title: '',
        description: '',
        hashtags: '',
        type: category === 'reuse' ? 'give' : 'offer',
        location: ''
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setForm(prev => ({
            ...prev,
            type: category === 'reuse' ? 'give' : (category === 'ride' ? 'request' : 'offer')
        }));
    }, [category]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImages(prev => [...prev, event.target.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title) return;

        setLoading(true);

        const tags = form.hashtags.split(',').map(t => t.trim().replace(/^#/, '')).filter(t => t);

        createListing({
            category,
            type: form.type,
            title: form.title,
            description: form.description,
            location: form.location,
            hashtags: tags,
            images: images.length > 0 ? images : undefined,
        });

        setTimeout(() => {
            navigate(`/${category}`);
        }, 500);
    };

    const getTitle = () => {
        switch (category) {
            case 'run': return 'New Run Request';
            case 'ride': return 'Request a Ride';
            case 'reuse': return 'Share / Lend Item';
            default: return 'Publish Item';
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '100px' }}>
            {/* Tabs */}
            <div className="tabs-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px 16px 0' }}>
                <div style={{ display: 'flex', flex: 1, gap: '8px', background: 'var(--color-primary)', padding: '4px', borderRadius: '8px', maxWidth: '300px' }}>
                    <button
                        type="button"
                        className={`tab-btn ${form.type === 'offer' || form.type === 'give' ? 'active' : ''}`}
                        onClick={() => setForm({ ...form, type: category === 'reuse' ? 'give' : 'offer' })}
                        style={{ flex: 1, borderRadius: '6px', fontSize: '12px' }}
                    >
                        OFFERS
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${form.type === 'request' || form.type === 'lend' ? 'active' : ''}`}
                        onClick={() => setForm({ ...form, type: category === 'reuse' ? 'lend' : 'request' })}
                        style={{ flex: 1, borderRadius: '6px', fontSize: '12px' }}
                    >
                        REQUESTS
                    </button>
                </div>
            </div>

            <div style={{ textAlign: 'center', margin: '24px 0' }}>
                <h1 style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.05em', color: 'var(--color-primary)' }}>CREATE POST</h1>
                {/* Image 5 shows "CREATE POST" twice, maybe one is a title and one is content? Actually I'll just put it once centered */}
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '0 16px' }}>
                <div className="card" style={{ padding: '24px', background: 'var(--color-surface-soft)', border: '1px solid rgba(0,0,0,0.05)' }}>
                    {/* Title */}
                    <div className="form-group">
                        <label className="form-label">Title / Destination</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder={category === 'run' ? 'e.g. 5k at Duke Forest' : 'e.g. Ride to Target'}
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                        />
                    </div>

                    {/* Location */}
                    <div className="form-group">
                        <label className="form-label">Meetup Location</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. Bryan Center, East Campus"
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label className="form-label">Notes (Optional)</label>
                        <textarea
                            className="form-input form-textarea"
                            style={{ height: '80px' }}
                            placeholder="Any additional details..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                    </div>

                    {/* Hashtags */}
                    <div className="form-group">
                        <label className="form-label">Hashtags</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. fitness, restaurants"
                            value={form.hashtags}
                            onChange={(e) => setForm({ ...form, hashtags: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg w-full mt-4"
                        disabled={loading || !form.title}
                    >
                        {loading ? 'Posting...' : '🚀 Post to Community'}
                    </button>
                </div>
            </form>
        </div>
    );
}
