import { Link } from 'react-router-dom';
import AhaLogo from './AhaLogo';
import { ChatIcon } from './Icons';

export default function Header() {
    return (
        <header className="header">
            <div className="header-inner">
                <Link to="/run" className="header-logo">
                    <AhaLogo style={{ height: '80px', width: 'auto' }} />
                </Link>
            </div>
        </header>
    );
}
