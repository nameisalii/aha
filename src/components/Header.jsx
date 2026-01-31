import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShopIcon, ChatIcon, PublishIcon, AccountIcon } from './Icons';

export default function Header() {
    const location = useLocation();
    const { currentUser, getUserChats } = useApp();

    const unreadChats = getUserChats().filter(c => c.messages?.length > 0).length;

    const navItems = [
        { path: '/shop', label: 'Trade', icon: ShopIcon },
        { path: '/chat', label: 'Chat', icon: ChatIcon, badge: unreadChats },
        { path: '/publish', label: 'Publish', icon: PublishIcon },
        { path: '/account', label: 'Account', icon: AccountIcon },
    ];

    if (!currentUser) return null;

    return (
        <header className="header">
            <div className="header-inner">
                <Link to="/shop" className="header-logo">
                    <img
                        src="/logo.png"
                        alt="AHA!"
                        style={{ height: '40px', width: 'auto' }}
                    />
                </Link>

                <nav className="header-nav">
                    {navItems.map(({ path, label, icon: Icon, badge }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`nav-link ${location.pathname === path ? 'active' : ''}`}
                        >
                            <Icon />
                            <span>{label}</span>
                            {badge > 0 && <span className="nav-badge">{badge}</span>}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
