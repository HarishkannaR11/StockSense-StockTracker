import { useEffect } from 'react';

const Toast = ({ toast, onClose }) => {
    useEffect(() => {
        if (!toast?.message) return;
        const timer = setTimeout(() => onClose(), 3000);
        return () => clearTimeout(timer);
    }, [toast, onClose]);

    if (!toast?.message) return null;

    const typeStyles = toast.type === 'success'
        ? 'border-green-200 bg-green-50 text-green-700'
        : 'border-red-200 bg-red-50 text-red-700';

    return (
        <div className="fixed right-4 top-20 z-[60]">
            <div className={`min-w-[260px] rounded-lg border px-4 py-3 shadow-sm ${typeStyles}`}>
                <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium">{toast.message}</p>
                    <button type="button" onClick={onClose} className="text-xs underline">Close</button>
                </div>
            </div>
        </div>
    );
};

export default Toast;
