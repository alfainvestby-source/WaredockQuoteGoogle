
import React, { useState } from 'react';
import { QuoteRequest } from '../types';
import { PricingForm } from './PricingForm';
import { QuoteRequestSummary } from './QuoteRequestSummary';

interface CreateQuoteViewProps {
    quote: QuoteRequest;
    onBack: () => void;
    onAddQuotation: (quoteRequestId: string, quotationId: string, pricingData: any) => void;
}

const DetailItem: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => {
    if (!value && value !== 0) return null;
    const displayValue = typeof value === 'number' ? `$${value.toFixed(2)}` : value;
    return (
        <div className="bg-brand-light/50 p-3 rounded-md">
            <p className="text-xs font-semibold text-brand-secondary uppercase">{label}</p>
            <p className="text-md text-brand-text font-medium break-words">{String(displayValue)}</p>
        </div>
    );
};


export const CreateQuoteView: React.FC<CreateQuoteViewProps> = ({ quote, onBack, onAddQuotation }) => {
    const [viewState, setViewState] = useState<'ENTRY' | 'PREVIEW'>('ENTRY');
    const [pricingData, setPricingData] = useState<any | null>(null);
    const [quotationId] = useState(() => `QTN-${Date.now()}`);
    const [copied, setCopied] = useState(false);

    const uniqueUrl = `${window.location.origin}/portal/view-quote/${quotationId}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(uniqueUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePreview = (data: any) => {
        setPricingData(data);
        setViewState('PREVIEW');
    };
    
    const handleEdit = () => {
        setViewState('ENTRY');
    };

    const handleSubmit = () => {
        if(pricingData) {
            onAddQuotation(quote.id, quotationId, pricingData);
            onBack();
        }
    };
    
    return (
        <div className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="mb-6 md:mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-brand-primary">
                        {viewState === 'ENTRY' ? 'Create Quotation' : 'Review and Submit Quotation'}
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm sm:text-base">
                        For: <span className="font-semibold">{quote.formData.input_company}</span> (ID: {quote.id})
                    </p>
                </div>
                <button
                    onClick={onBack}
                    className="px-4 py-2 text-brand-primary font-semibold rounded-lg hover:bg-brand-light transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to Dashboard
                </button>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <main className="flex-1 bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-200 w-full">
                    {viewState === 'ENTRY' ? (
                        <PricingForm onPreview={handlePreview} initialData={pricingData} />
                    ) : (
                        pricingData && (
                            <div className="space-y-8 animate-fade-in">
                                <div>
                                    <h3 className="text-lg font-semibold text-brand-secondary mb-4 border-b pb-2">Pricing Breakdown</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <DetailItem label="Storage Fee" value={parseFloat(pricingData.storageFee)} />
                                        <DetailItem label="Inbound Fee" value={parseFloat(pricingData.inboundFee)} />
                                        <DetailItem label="Pick & Pack (First Item)" value={parseFloat(pricingData.pickPackFirst)} />
                                        <DetailItem label="Pick & Pack (Additional)" value={parseFloat(pricingData.pickPackAdditional)} />
                                        <DetailItem label="Packaging Materials" value={pricingData.packagingFee ? parseFloat(pricingData.packagingFee) : undefined} />
                                        <DetailItem label="Monthly Account Fee" value={pricingData.accountFee ? parseFloat(pricingData.accountFee) : undefined} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-brand-secondary mb-4 border-b pb-2">General Information</h3>
                                    <DetailItem label="Quote Expiration Date" value={pricingData.quoteExpiry} />
                                    {pricingData.notes && <DetailItem label="Notes / Comments" value={pricingData.notes} />}
                                </div>
                                 <div>
                                    <h3 className="text-lg font-semibold text-brand-secondary mb-4 border-b pb-2">Shareable Link</h3>
                                    <div className="flex gap-2">
                                        <input type="text" readOnly value={uniqueUrl} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600" />
                                        <button onClick={handleCopy} className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors w-32">
                                            {copied ? 'Copied!' : 'Copy'}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">This unique link can be shared with the merchant to view the quote online.</p>
                                </div>

                                <div className="mt-10 pt-6 border-t flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-4">
                                    <button onClick={handleEdit} className="w-full sm:w-auto px-6 py-2 text-brand-primary font-semibold rounded-lg hover:bg-brand-light transition-colors">
                                        Back to Edit
                                    </button>
                                     <button onClick={handleSubmit} className="w-full sm:w-auto bg-brand-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-brand-secondary transition-colors shadow-lg">
                                        Send Quote to Client
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </main>
                <aside className="lg:w-1/3 w-full">
                   <QuoteRequestSummary quote={quote} />
                </aside>
            </div>
        </div>
    );
};
