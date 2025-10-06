
import React, { useState, useMemo } from 'react';
import { QuoteRequest, Quotation, User } from '../../types';
import { QuoteDetailsModal } from '../QuoteDetailsModal';
import { AdminQuoteReviewModal } from './AdminQuoteReviewModal';

const getStatusStyles = (status: string) => {
    switch (status) {
        case 'New Request': return 'bg-blue-100 text-blue-800';
        case 'Viewed': return 'bg-yellow-100 text-yellow-800';
        case 'Quoted': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

interface QuoteManagementProps {
    quotes: QuoteRequest[];
    quotations: Quotation[];
    users: User[];
}

type ReviewItem = QuoteRequest & { quotation: Quotation; quotedBy: User | null; };

export const QuoteManagement: React.FC<QuoteManagementProps> = ({ quotes, quotations, users }) => {
    const [requestToView, setRequestToView] = useState<QuoteRequest | null>(null);
    const [itemToReview, setItemToReview] = useState<ReviewItem | null>(null);
    
    const quoteDataMap = useMemo(() => {
        const quotationMap = new Map<string, Quotation>();
        quotations.forEach(q => quotationMap.set(q.quoteRequestId, q));
        
        const userMap = new Map<string, User>();
        users.forEach(u => userMap.set(u.id, u));

        return quotes.map(quote => {
            const quotation = quotationMap.get(quote.id);
            const quotedBy = quotation ? userMap.get(quotation.submittedBy) : null;
            return {
                ...quote,
                quotation,
                quotedBy,
            };
        });
    }, [quotes, quotations, users]);


    const handleRowClick = (data: (typeof quoteDataMap)[0]) => {
        if (data.quotation) {
            setItemToReview(data as ReviewItem);
        } else {
            setRequestToView(data);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-2xl font-bold text-brand-primary mb-4">Quote Management</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quoted By (3PL)</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Action</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {quoteDataMap.map(data => (
                            <tr key={data.id} onClick={() => handleRowClick(data)} className="hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{data.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.formData.input_company}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.submittedAt.toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(data.status)}`}>
                                        {data.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.quotedBy?.email || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                    {data.quotation ? (
                                        <span className="text-brand-secondary font-semibold">Review</span>
                                    ) : (
                                        <span className="text-gray-500 font-semibold">View Request</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <QuoteDetailsModal 
                quote={requestToView} 
                onClose={() => setRequestToView(null)} 
            />
            
            <AdminQuoteReviewModal 
                reviewData={itemToReview}
                onClose={() => setItemToReview(null)}
            />
        </div>
    );
};
