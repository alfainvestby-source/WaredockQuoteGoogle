
import React, { useState, useMemo } from 'react';
import { QuoteRequest, Quotation, User } from '../types';
import { QuoteRequestCard } from './QuoteRequestCard';
import { QuoteDetailsModal } from './QuoteDetailsModal';
import { ToastNotification } from './ToastNotification';
import { CreateQuoteView } from './CreateQuoteView';

interface LogisticsDashboardProps {
    user: User;
    quotes: QuoteRequest[];
    quotations: Quotation[];
    users: User[];
    onAddQuotation: (quoteRequestId: string, quotationId: string, pricingData: any) => void;
    onAcceptQuotation: (quotationId: string) => void;
    onSendMessage: (quoteRequestId: string, messageText: string) => void;
    onStartQuoteRequest?: () => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-4 rounded-xl shadow-md border flex items-center">
        <div className="flex-shrink-0 w-12 h-12 bg-brand-light rounded-full flex items-center justify-center text-brand-primary">
            {icon}
        </div>
        <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase">{title}</h3>
            <p className="mt-1 text-2xl font-semibold text-brand-primary">{value}</p>
        </div>
    </div>
);

export const LogisticsDashboard: React.FC<LogisticsDashboardProps> = (props) => {
    const { user, quotes, quotations, users, onAddQuotation, onAcceptQuotation, onSendMessage, onStartQuoteRequest } = props;
    const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
    const [quoteToPrice, setQuoteToPrice] = useState<QuoteRequest | null>(null);
    
    const is3PL = user.role === '3pl';

    const { quotationCountMap, unreadCountMap, totalUnread } = useMemo(() => {
        const qCounts = new Map<string, number>();
        quotations.forEach(q => {
            qCounts.set(q.quoteRequestId, (qCounts.get(q.quoteRequestId) || 0) + 1);
        });

        const uCounts = new Map<string, number>();
        let total = 0;
        quotes.forEach(quote => {
            const unread = quote.communications?.filter(m => m.isUnread && m.senderId !== user.id).length || 0;
            if (unread > 0) {
                uCounts.set(quote.id, unread);
                total += unread;
            }
        });

        return { quotationCountMap: qCounts, unreadCountMap: uCounts, totalUnread: total };
    }, [quotations, quotes, user.id]);


    const handleViewDetails = (quote: QuoteRequest) => {
        setSelectedQuote(quote);
    };

    const handleCloseModal = () => {
        setSelectedQuote(null);
    };
    
    const handleCreateQuote = (quote: QuoteRequest) => {
        setQuoteToPrice(quote);
        setSelectedQuote(null); // Close the modal
    };
    
    if (quoteToPrice) {
        return <CreateQuoteView quote={quoteToPrice} onBack={() => setQuoteToPrice(null)} onAddQuotation={onAddQuotation} />;
    }
    
    const renderMerchantDashboardHeader = () => {
        return (
            <>
                <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-brand-primary">Merchant Dashboard</h2>
                        <p className="text-gray-500 mt-1 text-sm sm:text-base">Track your requests, communicate with providers, and accept quotes.</p>
                    </div>
                     {user.role === 'merchant' && onStartQuoteRequest && (
                        <button 
                            onClick={onStartQuoteRequest}
                            className="bg-brand-primary text-white font-bold px-6 py-3 rounded-lg hover:bg-brand-secondary transition-colors shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            <span>Request New Quote</span>
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Total RFQs" value={quotes.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
                    <StatCard title="Quotations Received" value={quotations.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.T707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
                    <StatCard title="Unread Messages" value={totalUnread} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>} />
                </div>
                
                 <h3 className="text-xl sm:text-2xl font-bold text-brand-primary mb-6">Your Quote Requests</h3>
            </>
        )
    }

    return (
        <div className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
            
            {is3PL ? (
                <div className="mb-6 md:mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-brand-primary">Incoming Quote Requests</h2>
                    <p className="text-gray-500 mt-1 text-sm sm:text-base">Review and respond to new fulfillment opportunities.</p>
                </div>
            ) : (
                renderMerchantDashboardHeader()
            )}
            
            {quotes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                    {quotes.map(quote => (
                        <QuoteRequestCard 
                            key={quote.id} 
                            quote={quote}
                            quotationCount={quotationCountMap.get(quote.id) || 0}
                            unreadCount={unreadCountMap.get(quote.id) || 0}
                            onViewDetails={handleViewDetails}
                        />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-16 bg-white rounded-xl shadow-md border">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No requests found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {is3PL ? 'There are currently no new quote requests.' : 'You have not submitted any quote requests yet.'}
                    </p>
                </div>
            )}


            <QuoteDetailsModal 
                quote={selectedQuote} 
                user={user}
                quotations={quotations}
                users={users}
                onClose={handleCloseModal} 
                onCreateQuote={is3PL ? handleCreateQuote : undefined} 
                onAcceptQuotation={onAcceptQuotation}
                onSendMessage={onSendMessage}
            />
        </div>
    );
};
