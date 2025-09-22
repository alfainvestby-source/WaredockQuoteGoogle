import React from 'react';
import { FormDefinition } from '../types';

interface SummaryProps {
  formData: Record<string, any>;
  formDefinition: FormDefinition;
}

export const Summary: React.FC<SummaryProps> = ({ formData, formDefinition }) => {
  const allFields = formDefinition.form_fields.fields;

  const getFieldLabel = (fieldName: string): string | null => {
    const field = allFields.find(f => f.attributes.name === fieldName);
    if (field) {
      return field.settings.label;
    }
    // Check for nested fields like in 'input_name'
    for (const f of allFields) {
        if (f.element === 'input_name' && f.fields) {
            const subField = Object.values(f.fields).find((sf: any) => sf.attributes.name === fieldName);
            if (subField) {
                return (subField as any).settings.label;
            }
        }
    }
    return null;
  };
  
  const summaryItems = Object.entries(formData)
    .map(([key, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) return null;
      
      if (key === 'names' && typeof value === 'object' && !Array.isArray(value)) {
          const firstName = (value as any).first_name || '';
          const lastName = (value as any).last_name || '';
          const fullName = `${firstName} ${lastName}`.trim();
          return { label: 'Full Name', value: fullName };
      }
      
      if (typeof value === 'object' && !Array.isArray(value)) return null;

      const label = getFieldLabel(key);
      if (!label) return null;

      const displayValue = Array.isArray(value)
          ? value.join(', ')
          : value === true ? 'Agreed' : value;
          
      return { label, value: displayValue };
    })
    .filter((item): item is { label: string; value: any } => !!item && !!item.value);


  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 lg:sticky top-8">
      <h3 className="text-xl font-bold text-brand-primary mb-1">Request Summary</h3>
      <p className="text-sm text-gray-500 mb-6">Your details will update here as you fill them in.</p>
      
      {summaryItems.length === 0 ? (
        <div className="text-center py-10">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-800">No details entered yet</h3>
          <p className="mt-1 text-sm text-gray-500">Start filling the form to see the summary.</p>
        </div>
      ) : (
        <div className="space-y-4">
            {summaryItems.map((item, index) => item && (
                <div key={index} className="bg-brand-light/50 p-3 rounded-md">
                    <p className="text-xs font-semibold text-brand-secondary uppercase">{item.label}</p>
                    <p className="text-md text-brand-text font-medium break-words">{String(item.value)}</p>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};