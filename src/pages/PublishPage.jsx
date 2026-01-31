import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ImageIcon, CloseIcon } from '../components/Icons';

export default function PublishPage() {
    const navigate = useNavigate();
    const { createListing } = useApp();
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({ title: '', description: '', hashtags: '' });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

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
        if (!form.title || !form.description) return;

        setLoading(true);

        const tags = form.hashtags.split(',').map(t => t.trim().replace(/^#/, '')).filter(t => t);
        const listing = createListing({
            title: form.title,
            description: form.description,
            hashtags: tags,
            images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
        });

        setTimeout(() => {
            navigate('/account');
        }, 500);
    };

    return (
        <div className="main-content">
            <div className="container page-padding" style={{ maxWidth: '600px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 className="heading-2">Publish Item</h1>
                    <p className="text-muted">Give your item a new home</p>
                </div>

                <form onSubmit={handleSubmit} className="card" style={{ padding: '32px' }}>
                    {/* Image Upload */}
                    <div className="form-group">
                        <label className="form-label">Photos</label>
                        <div
                            className="image-upload"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="image-upload-icon">
                                <ImageIcon />
                            </div>
                            <p className="image-upload-text">
                                Click to upload photos
                            </p>
                            <p className="text-small text-muted">PNG, JPG up to 10MB</p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                        />

                        {images.length > 0 && (
                            <div className="image-preview-grid">
                                {images.map((img, index) => (
                                    <div key={index} className="image-preview">
                                        <img src={img} alt={`Upload ${index + 1}`} />
                                        <button
                                            type="button"
                                            className="image-preview-remove"
                                            onClick={() => removeImage(index)}
                                        >
                                            <CloseIcon />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="What are you selling?"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-input form-textarea"
                            placeholder="Describe your item... condition, size, why you're selling, etc."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            required
                        />
                    </div>

                    {/* Hashtags */}
                    <div className="form-group">
                        <label className="form-label">Hashtags</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. clothes, electronics, books, dorm"
                            value={form.hashtags}
                            onChange={(e) => setForm({ ...form, hashtags: e.target.value })}
                        />
                        <p className="text-small text-muted" style={{ marginTop: '4px' }}>
                            Separate tags with commas
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg w-full"
                        disabled={loading || !form.title || !form.description}
                    >
                        {loading ? 'Publishing...' : '🌱 Publish Item'}
                    </button>

                    <p className="text-small text-muted text-center mt-4">
                        Earn +5 karma points when someone buys this item!
                    </p>
                </form>
            </div>
        </div>
    );
}
