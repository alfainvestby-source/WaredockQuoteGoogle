import React, { useEffect, useState } from 'react';
import { QuoteRequest } from '../types';

interface ToastNotificationProps {
    quote: QuoteRequest;
    onView: (quote: QuoteRequest) => void;
    onClose: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ quote, onView, onClose }) => {
    const [visible, setVisible] = useState(false);

    // Animate in and set auto-close timer
    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
            handleClose();
        }, 8000); // Auto-close after 8 seconds

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setVisible(false);
        // Wait for animation to finish before calling parent's onClose
        setTimeout(onClose, 300); 
    };

    const handleViewClick = () => {
        onView(quote);
    };

    return (
        <div
            className={`fixed top-5 right-5 w-full max-w-sm bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 transition-transform duration-300 ease-in-out ${
                visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
            role="alert"
            aria-live="assertive"
        >
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                    <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                        </svg>
                    </div>
                </div>
                <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-bold text-brand-primary">New Quote Request</p>
                    <p className="mt-1 text-sm text-gray-600">
                        Received from <span className="font-semibold">{quote.formData.input_company || 'a new client'}</span>.
                    </p>
                    <div className="mt-3 flex gap-3">
                        <button
                            onClick={handleViewClick}
                            className="bg-brand-secondary text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
                        >
                            View
                        </button>
                        <button
                            onClick={handleClose}
                            className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button
                        onClick={handleClose}
                        className="inline-flex text-gray-400 rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary"
                        aria-label="Close"
                    >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};