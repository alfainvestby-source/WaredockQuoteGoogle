import React from 'react';
import { QuoteRequest } from '../types';

interface QuoteRequestCardProps {
  quote: QuoteRequest;
  onViewDetails: (quote: QuoteRequest) => void;
}

const getStatusStyles = (status: string) => {
    switch (status) {
        case 'New Request':
            return {
                dot: 'bg-blue-500',
                text: 'text-blue-700',
                bg: 'bg-blue-100'
            };
        case 'Viewed':
            return {
                dot: 'bg-yellow-500',
                text: 'text-yellow-700',
                bg: 'bg-yellow-100'
            };
        case 'Quoted':
            return {
                dot: 'bg-green-500',
                text: 'text-green-700',
                bg: 'bg-green-100'
            };
        default:
            return {
                dot: 'bg-gray-500',
                text: 'text-gray-700',
                bg: 'bg-gray-100'
            };
    }
}

export const QuoteRequestCard: React.FC<QuoteRequestCardProps> = ({ quote, onViewDetails }) => {
    const { formData, submittedAt, status, id } = quote;
    const statusStyle = getStatusStyles(status);

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-brand-primary">{formData.input_company || 'N/A'}</h3>
                        <p className="text-sm text-gray-500">{formData.warehouse_location}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${statusStyle.bg} ${statusStyle.text}`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${statusStyle.dot}`}></span>
                        {status}
                    </div>
                </div>

                <div className="space-y-3 text-sm text-brand-text mb-6">
                    <p><span className="font-semibold">📦 Category:</span> {formData.product_category_OTHER || formData.product_category}</p>
                    <p><span className="font-semibold">🚚 Monthly Orders:</span> {formData.B2C_orders}</p>
                    <p><span className="font-semibold">#️⃣ SKUs:</span> {formData.SKUcount}</p>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-2">
                 <p className="text-xs text-gray-400 text-center sm:text-left">
                    ID: {id} <br />
                    Received: {submittedAt.toLocaleDateString()}
                </p>
                <button
                    onClick={() => onViewDetails(quote)}
                    className="w-full sm:w-auto bg-brand-secondary text-white font-semibold px-4 py-2 rounded-lg hover:bg-brand-primary transition-colors text-sm"
                    aria-label={`View details for quote ${id}`}
                >
                    View Details
                </button>
            </div>
        </div>
    );
};