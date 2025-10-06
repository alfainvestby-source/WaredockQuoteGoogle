
import React, { useState } from 'react';

interface FormFieldProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder?: string;
    isTextarea?: boolean;
    required?: boolean;
    step?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, name, type = 'text', value, onChange, placeholder, isTextarea, required, step }) => (
    <div>
        <label htmlFor={name} className="block text-gray-700 font-semibold mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {isTextarea ? (
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-shadow shadow-sm"
            />
        ) : (
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                step={step}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-shadow shadow-sm"
            />
        )}
    </div>
);

interface PricingFormProps {
    onPreview: (pricingData: any) => void;
    initialData?: any | null;
}

export const PricingForm: React.FC<PricingFormProps> = ({ onPreview, initialData }) => {
    const [pricingData, setPricingData] = useState(initialData || {
        storageFee: '',
        inboundFee: '',
        pickPackFirst: '',
        pickPackAdditional: '',
        packagingFee: '',
        accountFee: '',
        quoteExpiry: '',
        notes: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPricingData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPreview(pricingData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold text-brand-secondary mb-4 border-b pb-2">Warehousing Fees ($)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Storage Fee (per pallet/month)" name="storageFee" type="number" step="0.01" value={pricingData.storageFee} onChange={handleChange} placeholder="e.g., 25.50" required />
                    <FormField label="Inbound Fee (per pallet)" name="inboundFee" type="number" step="0.01" value={pricingData.inboundFee} onChange={handleChange} placeholder="e.g., 10.00" required />
                </div>
            </div>
            
            <div>
                <h3 className="text-lg font-semibold text-brand-secondary mb-4 border-b pb-2">Fulfillment Fees ($)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Pick & Pack (First Item)" name="pickPackFirst" type="number" step="0.01" value={pricingData.pickPackFirst} onChange={handleChange} placeholder="e.g., 2.50" required />
                    <FormField label="Pick & Pack (Additional Items)" name="pickPackAdditional" type="number" step="0.01" value={pricingData.pickPackAdditional} onChange={handleChange} placeholder="e.g., 0.50" required />
                    <FormField label="Packaging Materials (per order)" name="packagingFee" type="number" step="0.01" value={pricingData.packagingFee} onChange={handleChange} placeholder="e.g., 1.00" />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-brand-secondary mb-4 border-b pb-2">Account & General</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Monthly Account Fee ($)" name="accountFee" type="number" step="0.01" value={pricingData.accountFee} onChange={handleChange} placeholder="e.g., 100.00" />
                    <FormField label="Quote Expiration Date" name="quoteExpiry" type="date" value={pricingData.quoteExpiry} onChange={handleChange} required />
                </div>
                <div className="mt-6">
                    <FormField label="Notes / Comments" name="notes" isTextarea value={pricingData.notes} onChange={handleChange} placeholder="Add any additional terms, conditions, or comments here." />
                </div>
            </div>

            <div className="mt-10 flex justify-end">
                <button
                    type="submit"
                    className="bg-brand-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-brand-secondary transition-colors shadow-lg"
                >
                    Preview Quote
                </button>
            </div>
        </form>
    );
};
