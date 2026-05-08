import React from 'react';


const ConfirmDialog = ({
    isOpen,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmLabel = 'Delete',
    onConfirm,
    onCancel,
    isDangerous = true,
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="alertdialog"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Dialog panel */}
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-150">
                {/* Icon */}
                <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${isDangerous ? 'bg-red-500/10 border border-red-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 ${isDangerous ? 'text-red-400' : 'text-amber-400'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>

                {/* Title */}
                <h3 className="text-center text-base font-semibold text-white mb-1">{title}</h3>

                {/* Message */}
                <p className="text-center text-sm text-zinc-400 mb-6">{message}</p>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 px-4 rounded-md border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-800 transition-colors active:scale-[0.98]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors active:scale-[0.98] ${isDangerous
                                ? 'bg-red-500/90 hover:bg-red-500 text-white border border-red-500/50'
                                : 'bg-white hover:bg-zinc-200 text-black'
                            }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
