
import React, { useState, useRef, useEffect } from 'react';
import { QuoteRequest, User, Quotation } from '../types';
import { QuotationDetailsModal } from './QuotationDetailsModal';

interface QuoteDetailsModalProps {
    quote: QuoteRequest | null;
    user: User;
    quotations: Quotation[];
    users: User[];
    onClose: () => void;
    onCreateQuote?: (quote: QuoteRequest) => void;
    onAcceptQuotation: (quotationId: string) => void;
    onSendMessage: (quoteRequestId: string, messageText: string) => void;
}

type ModalTab = 'details' | 'qna' | 'documents';

const DetailItem: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => {
    if (!value && value !== 0) return null;
    return (
        <div className="bg-brand-light/50 p-3 rounded-md">
            <p className="text-xs font-semibold text-brand-secondary uppercase">{label}</p>
            <p className="text-md text-brand-text font-medium break-words">{String(value)}</p>
        </div>
    );
};

export const QuoteDetailsModal: React.FC<QuoteDetailsModalProps> = (props) => {
    const { quote, user, quotations, users, onClose, onCreateQuote, onAcceptQuotation, onSendMessage } = props;
    const [viewingQuotation, setViewingQuotation] = useState<Quotation | null>(null);
    const [activeTab, setActiveTab] = useState<ModalTab>('details');
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // When modal opens or tab changes to Q&A, scroll to the bottom of messages
        if (quote && activeTab === 'qna') {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [quote, activeTab, quote?.communications?.length]);

    if (!quote) return null;

    const { formData } = quote;
    const fullName = `${formData.first_name || ''} ${formData.last_name || ''}`.trim();

    const isMerchant = user.role === 'merchant';
    const relevantQuotations = isMerchant ? quotations.filter(q => q.quoteRequestId === quote.id) : [];

    const get3PLProvider = (userId: string) => users.find(u => u.id === userId);
    
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(quote.id, message.trim());
            setMessage('');
        }
    };
    
    const renderDetailsTab = () => (
        <div className="space-y-6">
            <div>
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
    );

    const renderQATab = () => (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                {quote.communications && quote.communications.length > 0 ? (
                    quote.communications.map(msg => {
                        const sender = users.find(u => u.id === msg.senderId);
                        const isCurrentUser = msg.senderId === user.id;
                        return (
                            <div key={msg.id} className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                <div className={`w-3/4 p-3 rounded-lg ${isCurrentUser ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    <p className="text-sm font-semibold">{sender?.name || sender?.email}</p>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-xs mt-1 ${isCurrentUser ? 'text-gray-300' : 'text-gray-500'}`}>{new Date(msg.timestamp).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <p className="text-gray-500 text-center py-8">No messages yet. Start the conversation!</p>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="mt-4 flex gap-2 border-t pt-4">
                <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary"
                />
                <button type="submit" className="px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-secondary">Send</button>
            </form>
        </div>
    );
    
    const renderDocumentsTab = () => (
        <div>
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-semibold text-brand-secondary">Uploaded Documents</h3>
                 <button className="px-4 py-2 bg-brand-secondary text-white font-semibold rounded-lg text-sm" onClick={() => alert('File upload functionality coming soon!')}>Upload File</button>
            </div>
            {quote.documents && quote.documents.length > 0 ? (
                <ul className="space-y-2">
                    {/* Render list of documents */}
                </ul>
            ) : (
                <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">No documents have been uploaded for this request.</p>
            )}
        </div>
    );

    return (
        <>
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-details-title"
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center z-10">
                    <h2 id="quote-details-title" className="text-xl sm:text-2xl font-bold text-brand-primary">{formData.input_company}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close modal">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <div className="p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6 flex-grow overflow-y-auto">
                    <div className="lg:col-span-1">
                        {isMerchant ? (
                             <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-brand-secondary mb-4 border-b pb-2">Received Quotations</h3>
                                {relevantQuotations.length > 0 ? (
                                    <div className="space-y-4">
                                        {relevantQuotations.map(q => {
                                            const provider = get3PLProvider(q.submittedBy);
                                            return (
                                                <div key={q.id} className="bg-white p-4 rounded-lg border shadow-sm flex justify-between items-center">
                                                    <div>
                                                        <p className="font-semibold text-brand-primary">{provider?.name || 'Unknown Provider'}</p>
                                                        <p className="text-sm text-gray-500">Submitted: {new Date(q.submittedAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => setViewingQuotation(q)}
                                                        className="font-semibold text-brand-secondary hover:underline text-sm"
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">No quotations have been submitted yet.</p>
                                )}
                            </div>
                        ) : renderDetailsTab()}
                    </div>

                    <div className="lg:col-span-1 flex flex-col h-full">
                         {isMerchant && (
                            <div className="border-b border-gray-200 mb-4">
                                <nav className="-mb-px flex space-x-6">
                                    <button onClick={() => setActiveTab('details')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-sm ${activeTab === 'details' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Request Details</button>
                                    <button onClick={() => setActiveTab('qna')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-sm ${activeTab === 'qna' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Q&A</button>
                                    <button onClick={() => setActiveTab('documents')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-sm ${activeTab === 'documents' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Documents</button>
                                </nav>
                            </div>
                         )}
                         <div className="flex-grow overflow-y-auto">
                            {isMerchant && activeTab === 'details' && renderDetailsTab()}
                            {isMerchant && activeTab === 'qna' && renderQATab()}
                            {isMerchant && activeTab === 'documents' && renderDocumentsTab()}
                         </div>
                    </div>
                </div>

                <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                    <button onClick={onClose} className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-200 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                        Close
                    </button>
                    {onCreateQuote && (
                        <button 
                            onClick={() => onCreateQuote(quote)}
                            className="w-full sm:w-auto px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-secondary transition-colors shadow-lg"
                        >
                            Create Quote
                        </button>
                    )}
                </div>
            </div>
        </div>
        
        {viewingQuotation && (
            <QuotationDetailsModal
                quotation={viewingQuotation}
                quotedBy={get3PLProvider(viewingQuotation.submittedBy) || null}
                onClose={() => setViewingQuotation(null)}
                onAccept={onAcceptQuotation}
            />
        )}
        </>
    );
};
