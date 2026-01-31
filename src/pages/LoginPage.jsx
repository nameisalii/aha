import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LeafIcon } from '../components/Icons';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useApp();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = login(form.email, form.password);

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
                    <p className="auth-subtitle">Anyone Has A... Sustainable Student Marketplace</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <h2 className="heading-3 mb-6">Welcome Back</h2>

                    {error && (
                        <div className="form-error mb-4" style={{ padding: '12px', background: 'rgba(229, 57, 53, 0.1)', borderRadius: '8px' }}>
                            {error}
                        </div>
                    )}

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
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <p className="text-small text-muted mt-4 text-center">
                        Demo: sarah.chen@duke.edu / demo123
                    </p>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </div>
            </div>
        </div>
    );
}
