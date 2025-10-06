
import React from 'react';
import { Quotation, User, QuoteRequest } from '../../types';

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

type ReviewData = QuoteRequest & {
    quotation: Quotation;
    quotedBy: User | null;
}

interface AdminQuoteReviewModalProps {
    reviewData: ReviewData | null;
    onClose: () => void;
}

export const AdminQuoteReviewModal: React.FC<AdminQuoteReviewModalProps> = ({ reviewData, onClose }) => {
    if (!reviewData) return null;

    const { formData, quotation, quotedBy } = reviewData;
    const { pricing } = quotation;

    const fullName = `${formData.first_name || ''} ${formData.last_name || ''}`.trim();

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-modal-title"
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                    <div>
                        <h2 id="review-modal-title" className="text-xl sm:text-2xl font-bold text-brand-primary">Quote Review</h2>
                        <p className="text-sm text-gray-500">Comparing Merchant Request vs. 3PL Quotation</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close modal">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6 flex-grow">
                    {/* Column 1: Quote Request */}
                    <div className="border-r-0 lg:border-r lg:pr-8 border-gray-200">
                        <h3 className="text-lg font-bold text-brand-primary mb-4">
                            Merchant Request (<span className="font-mono text-sm">{reviewData.id}</span>)
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-md font-semibold text-brand-secondary mb-3 border-b pb-2">Contact & Company</h4>
                                <div className="space-y-3">
                                    <DetailItem label="Company" value={formData.input_company} />
                                    <DetailItem label="Contact Name" value={fullName} />
                                    <DetailItem label="Email" value={formData.email} />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-md font-semibold text-brand-secondary mb-3 border-b pb-2">Operational Volume</h4>
                                <div className="space-y-3">
                                    <DetailItem label="B2C Orders / Month" value={formData.B2C_orders} />
                                    <DetailItem label="Unique Products (SKUs)" value={formData.SKUcount} />
                                    <DetailItem label="Avg. Items / Order" value={formData.pick_count} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Quotation */}
                    <div>
                        <h3 className="text-lg font-bold text-brand-primary mb-4">
                            3PL Quotation (<span className="font-mono text-sm">{quotation.id}</span>)
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-md font-semibold text-brand-secondary mb-3 border-b pb-2">Quote Info</h4>
                                <div className="space-y-3">
                                    <DetailItem label="Submitted By" value={quotedBy?.email} />
                                    <DetailItem label="Submitted On" value={quotation.submittedAt.toLocaleString()} />
                                    <DetailItem label="Valid Until" value={quotation.quoteExpiry} />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-md font-semibold text-brand-secondary mb-3 border-b pb-2">Pricing</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <DetailItem label="Storage Fee" value={formatCurrency(pricing.storageFee)} />
                                    <DetailItem label="Inbound Fee" value={formatCurrency(pricing.inboundFee)} />
                                    <DetailItem label="Pick & Pack (First)" value={formatCurrency(pricing.pickPackFirst)} />
                                    <DetailItem label="Pick & Pack (Add.)" value={formatCurrency(pricing.pickPackAdditional)} />
                                    <DetailItem label="Packaging Fee" value={formatCurrency(pricing.packagingFee)} />
                                    <DetailItem label="Account Fee" value={formatCurrency(pricing.accountFee)} />
                                </div>
                            </div>
                            {quotation.notes && (
                                <div>
                                    <h4 className="text-md font-semibold text-brand-secondary mb-3 border-b pb-2">Notes & Conditions</h4>
                                    <div className="bg-gray-50 p-3 rounded-lg border text-sm">
                                        <p className="text-gray-700 whitespace-pre-wrap">{quotation.notes}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end sticky bottom-0">
                    <button onClick={onClose} className="w-full sm:w-auto px-6 py-2 text-gray-700 bg-gray-200 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
