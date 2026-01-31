import { useApp } from '../context/AppContext';
import { CheckIcon, CloseIcon } from './Icons';

export default function Toast() {
    const { toasts } = useApp();

    if (toasts.length === 0) return null;

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <div key={toast.id} className={`toast toast-${toast.type}`}>
                    <span className="toast-icon">
                        {toast.type === 'success' ? <CheckIcon /> : <CloseIcon />}
                    </span>
                    <span>{toast.message}</span>
                </div>
            ))}
        </div>
    );
}
