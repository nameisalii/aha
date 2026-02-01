import React from 'react';

export default function AhaLogo({ style, className }) {
    return (
        <img
            src={`${import.meta.env.BASE_URL}aha-logo.png`}
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
