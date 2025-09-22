import React from 'react';
import { QuoteRequest } from '../types';
import { PricingForm } from './PricingForm';
import { QuoteRequestSummary } from './QuoteRequestSummary';

interface CreateQuoteViewProps {
    quote: QuoteRequest;
    onBack: () => void;
}

export const CreateQuoteView: React.FC<CreateQuoteViewProps> = ({ quote, onBack }) => {
    return (
        <div className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="mb-6 md:mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-brand-primary">Create Quotation</h2>
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
                    <PricingForm />
                </main>
                <aside className="lg:w-1/3 w-full">
                   <QuoteRequestSummary quote={quote} />
                </aside>
            </div>
        </div>
    );
};
