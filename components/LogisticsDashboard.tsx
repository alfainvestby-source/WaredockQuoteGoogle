import React, { useState, useEffect } from 'react';
import { DUMMY_QUOTES } from '../data';
import { QuoteRequest } from '../types';
import { QuoteRequestCard } from './QuoteRequestCard';
import { QuoteDetailsModal } from './QuoteDetailsModal';
import { ToastNotification } from './ToastNotification';
import { CreateQuoteView } from './CreateQuoteView';

export const LogisticsDashboard: React.FC = () => {
    const [quotes, setQuotes] = useState<QuoteRequest[]>(DUMMY_QUOTES);
    const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
    const [newQuoteNotification, setNewQuoteNotification] = useState<QuoteRequest | null>(null);
    const [quoteToPrice, setQuoteToPrice] = useState<QuoteRequest | null>(null);


    // Simulate a new quote arriving after a delay
    useEffect(() => {
        const timer = setTimeout(() => {
            const newQuote: QuoteRequest = {
                id: 'QR-005',
                status: 'New Request',
                formData: {
                    first_name: 'Eva',
                    last_name: 'Green',
                    input_company: 'Eco Goods Inc.',
                    email: 'eva.g@ecogoods.com',
                    url: 'https://ecogoods.com',
                    ecommerce_platform: 'Shopify',
                    product_category: 'Other',
                    product_category_OTHER: 'Sustainable Home Goods',
                    warehouse_location: 'USA',
                    B2C_orders: '251-500/month',
                    SKUcount: '80',
                    pick_count: '4',
                },
                submittedAt: new Date(),
            };
            
            setQuotes(prevQuotes => [newQuote, ...prevQuotes]);
            setNewQuoteNotification(newQuote);
        }, 3000); // Show notification after 3 seconds

        return () => clearTimeout(timer);
    }, []);


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
    
    const handleViewFromToast = (quote: QuoteRequest) => {
        handleViewDetails(quote);
        setNewQuoteNotification(null);
    };
    
    const handleCloseToast = () => {
        setNewQuoteNotification(null);
    };

    if (quoteToPrice) {
        return <CreateQuoteView quote={quoteToPrice} onBack={() => setQuoteToPrice(null)} />;
    }

    return (
        <div className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="mb-6 md:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-brand-primary">Incoming Quote Requests</h2>
                <p className="text-gray-500 mt-1 text-sm sm:text-base">Review and respond to new fulfillment opportunities.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {quotes.map(quote => (
                    <QuoteRequestCard 
                        key={quote.id} 
                        quote={quote}
                        onViewDetails={handleViewDetails}
                    />
                ))}
            </div>

            <QuoteDetailsModal quote={selectedQuote} onClose={handleCloseModal} onCreateQuote={handleCreateQuote} />
            
            {newQuoteNotification && (
                <ToastNotification 
                    quote={newQuoteNotification}
                    onView={handleViewFromToast}
                    onClose={handleCloseToast}
                />
            )}
        </div>
    );
};