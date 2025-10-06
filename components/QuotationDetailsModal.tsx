
import React from 'react';
import { Quotation, User } from '../types';

const DetailItem: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => {
    if (!value && value !== 0) return null;
    return (
        <div className="bg-brand-light/50 p-3 rounded-md">
            <p className="text-xs font-semibold text-brand-secondary uppercase">{label}</p>
            <p className="text-md text-brand-text font-medium break-words">{String(value)}</p>
        </div>
    );
};

const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return 'N/A';
    return `$${value.toFixed(2)}`;
}

const getStatusStyles = (status: Quotation['status']) => {
    switch (status) {
        case 'Accepted': return 'bg-green-100 text-green-800';
        case 'Declined': return 'bg-red-100 text-red-800';
        default: return 'bg-yellow-100 text-yellow-800';
    }
};


interface QuotationDetailsModalProps {
    quotation: Quotation | null;
    quotedBy: User | null;
    onClose: () => void;
    onAccept: (quotationId: string) => void;
}

export const QuotationDetailsModal: React.FC<QuotationDetailsModalProps> = ({ quotation, quotedBy, onClose, onAccept }) => {
    if (!quotation) return null;

    const { pricing, status } = quotation;
    
    const handleAccept = () => {
        onAccept(quotation.id);
        onClose(); // Close modal after accepting
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex justify-center items-center p-4 transition-opacity animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quotation-details-title"
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center z-10">
                    <div>
                        <h2 id="quotation-details-title" className="text-xl sm:text-2xl font-bold text-brand-primary">Quotation Details</h2>
                        <p className="text-sm text-gray-500">For Request ID: {quotation.quoteRequestId}</p>
                    </div>
                     <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusStyles(status)}`}>
                        {status}
                    </span>
                </div>
                
                <div className="p-4 sm:p-6 md:p-8 space-y-8 flex-grow">
                    <div>
                        <h3 className="text-lg font-semibold text-brand-secondary mb-4 border-b pb-2">General Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <DetailItem label="Quotation ID" value={quotation.id} />
                            <DetailItem label="Submitted By (3PL)" value={quotedBy?.name || quotedBy?.email} />
                            <DetailItem label="Submitted On" value={quotation.submittedAt.toLocaleString()} />
                            <DetailItem label="Quote Valid Until" value={new Date(quotation.quoteExpiry).toLocaleDateString()} />
                        </div>
                    </div>
                
                    <div>
                        <h3 className="text-lg font-semibold text-brand-secondary mb-4 border-b pb-2">Pricing Breakdown</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <DetailItem label="Storage Fee (per pallet/month)" value={formatCurrency(pricing.storageFee)} />
                            <DetailItem label="Inbound Fee (per pallet)" value={formatCurrency(pricing.inboundFee)} />
                            <DetailItem label="Pick & Pack (First Item)" value={formatCurrency(pricing.pickPackFirst)} />
                            <DetailItem label="Pick & Pack (Additional Items)" value={formatCurrency(pricing.pickPackAdditional)} />
                            <DetailItem label="Packaging Materials (per order)" value={formatCurrency(pricing.packagingFee)} />
                            <DetailItem label="Monthly Account Fee" value={formatCurrency(pricing.accountFee)} />
                        </div>
                    </div>

                    {quotation.notes && (
                         <div>
                            <h3 className="text-lg font-semibold text-brand-secondary mb-4 border-b pb-2">Notes & Conditions</h3>
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <p className="text-gray-700 whitespace-pre-wrap">{quotation.notes}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:justify-end items-center gap-3 sticky bottom-0">
                    <button onClick={onClose} className="w-full sm:w-auto px-6 py-2 text-gray-700 bg-transparent font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                        Close
                    </button>
                    <button 
                        onClick={() => alert("Payment gateway integration coming soon!")}
                        className="w-full sm:w-auto px-6 py-2 bg-gray-300 text-gray-500 font-bold rounded-lg cursor-not-allowed"
                        disabled
                    >
                        Pay Now
                    </button>
                     <button 
                        onClick={handleAccept}
                        className="w-full sm:w-auto px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-secondary transition-colors shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                        disabled={status !== 'Pending'}
                     >
                        Accept & Sign
                    </button>
                </div>
            </div>
        </div>
    );
};
