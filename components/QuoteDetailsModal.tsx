import React from 'react';
import { QuoteRequest } from '../types';

interface QuoteDetailsModalProps {
    quote: QuoteRequest | null;
    onClose: () => void;
    onCreateQuote: (quote: QuoteRequest) => void;
}

const DetailItem: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => {
    if (!value && value !== 0) return null;
    return (
        <div className="bg-brand-light/50 p-3 rounded-md">
            <p className="text-xs font-semibold text-brand-secondary uppercase">{label}</p>
            <p className="text-md text-brand-text font-medium break-words">{String(value)}</p>
        </div>
    );
};

export const QuoteDetailsModal: React.FC<QuoteDetailsModalProps> = ({ quote, onClose, onCreateQuote }) => {
    if (!quote) return null;

    const { formData } = quote;
    const fullName = `${formData.first_name || ''} ${formData.last_name || ''}`.trim();

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-details-title"
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center z-10">
                    <h2 id="quote-details-title" className="text-xl sm:text-2xl font-bold text-brand-primary">{formData.input_company}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close modal">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <div className="p-4 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
                    <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold text-brand-secondary mb-4 border-b pb-2">Contact Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <DetailItem label="Full Name" value={fullName} />
                            <DetailItem label="Email Address" value={formData.email} />
                            <DetailItem label="Company Website" value={formData.url} />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-brand-secondary mb-4 border-b pb-2">Business Details</h3>
                        <div className="space-y-4">
                           <DetailItem label="eCommerce Platform" value={formData.ecommerce_platform_OTHER || formData.ecommerce_platform} />
                           <DetailItem label="Product Category" value={formData.product_category_OTHER || formData.product_category} />
                           <DetailItem label="Fulfillment Location" value={formData.warehouse_location_OTHER || formData.warehouse_location} />
                        </div>
                    </div>

                     <div>
                        <h3 className="text-lg font-semibold text-brand-secondary mb-4 border-b pb-2">Operational Volume</h3>
                        <div className="space-y-4">
                            <DetailItem label="B2C Orders / Month" value={formData.B2C_orders} />
                            <DetailItem label="Unique Products (SKUs)" value={formData.SKUcount} />
                            <DetailItem label="Avg. Items / Order" value={formData.pick_count} />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sticky bottom-0">
                    <button onClick={onClose} className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-200 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                        Close
                    </button>
                    <button 
                        onClick={() => onCreateQuote(quote)}
                        className="w-full sm:w-auto px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-secondary transition-colors shadow-lg"
                    >
                        Create Quote
                    </button>
                </div>
            </div>
        </div>
    );
};