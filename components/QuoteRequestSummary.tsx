import React from 'react';
import { QuoteRequest } from '../types';

const DetailItem: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => {
    if (!value && value !== 0) return null;
    return (
        <div className="bg-brand-light/50 p-3 rounded-md">
            <p className="text-xs font-semibold text-brand-secondary uppercase">{label}</p>
            <p className="text-md text-brand-text font-medium break-words">{String(value)}</p>
        </div>
    );
};

interface QuoteRequestSummaryProps {
    quote: QuoteRequest;
}

export const QuoteRequestSummary: React.FC<QuoteRequestSummaryProps> = ({ quote }) => {
    const { formData } = quote;
    const fullName = `${formData.first_name || ''} ${formData.last_name || ''}`.trim();

    return (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 lg:sticky top-8">
            <h3 className="text-xl font-bold text-brand-primary mb-1">Request Summary</h3>
            <p className="text-sm text-gray-500 mb-6">Details provided by the client.</p>

            <div className="space-y-6">
                <div>
                    <h4 className="text-md font-semibold text-brand-secondary mb-3 border-b pb-2">Contact Information</h4>
                    <div className="space-y-3">
                        <DetailItem label="Full Name" value={fullName} />
                        <DetailItem label="Email Address" value={formData.email} />
                        <DetailItem label="Company Website" value={formData.url} />
                    </div>
                </div>

                <div>
                    <h4 className="text-md font-semibold text-brand-secondary mb-3 border-b pb-2">Business Details</h4>
                    <div className="space-y-3">
                       <DetailItem label="eCommerce Platform" value={formData.ecommerce_platform_OTHER || formData.ecommerce_platform} />
                       <DetailItem label="Product Category" value={formData.product_category_OTHER || formData.product_category} />
                       <DetailItem label="Fulfillment Location" value={formData.warehouse_location_OTHER || formData.warehouse_location} />
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
    );
};
