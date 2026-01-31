import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function SignupPage() {
    const navigate = useNavigate();
    const { signup } = useApp();
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!form.name || !form.email || !form.phone || !form.password) {
            setError('All fields are required');
            setLoading(false);
            return;
        }

        const result = signup(form);

        if (result.success) {
            navigate('/shop');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <img src="/logo.png" alt="AHA!" style={{ height: '50px', marginBottom: '8px' }} />
                    </div>
                    <p className="auth-subtitle">Join the Sustainable Community</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <h2 className="heading-3 mb-6">Create Account</h2>

                    {error && (
                        <div className="form-error mb-4" style={{ padding: '12px', background: 'rgba(229, 57, 53, 0.1)', borderRadius: '8px' }}>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Your full name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="your.email@duke.edu"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                            type="tel"
                            className="form-input"
                            placeholder="555-123-4567"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Create a password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>

                    <p className="text-small text-muted mt-4 text-center">
                        By signing up, you agree to help make Duke more sustainable! 🌱
                    </p>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
}
