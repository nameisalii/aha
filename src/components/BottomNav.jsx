import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShopIcon, ChatIcon, PublishIcon, AccountIcon } from './Icons';

export default function BottomNav() {
    const location = useLocation();

    const items = [
        { path: '/run', label: 'run' },
        { path: '/ride', label: 'ride' },
        { path: '/reuse', label: 'reuse' },
        { path: '/rewards', label: 'rewards' },
    ];

    return (
        <nav className="bottom-nav">
            {items.map(({ path, label, icon: Icon }) => (
                <Link
                    key={path}
                    to={path}
                    className={`bottom-nav-item ${location.pathname === path ? 'active' : ''}`}
                >
                    <span className="bottom-nav-label">{label}</span>
                </Link>
            ))}
        </nav>
    );
}
