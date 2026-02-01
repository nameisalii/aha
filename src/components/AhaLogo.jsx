import React from 'react';

export default function AhaLogo({ style, className }) {
    return (
        <img
            src="/aha_logo_yellow.jpg"
            alt="AHA!"
            style={{
                ...style,
                objectFit: 'contain',
                mixBlendMode: 'multiply',
                filter: 'contrast(1.1)'
            }}
            className={className}
        />
    );
}
