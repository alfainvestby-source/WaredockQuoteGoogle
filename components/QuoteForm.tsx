import React from 'react';
import { FormField, Step } from '../types';

interface FormFieldProps {
  field: FormField;
  value: any;
  error?: string;
  onChange: (name: string, value: any) => void;
}

const FormFieldComponent: React.FC<FormFieldProps> = ({ field, value, error, onChange }) => {
  const { element, attributes, settings, fields } = field;

  // Base classes for form elements
  const baseClasses = "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-shadow shadow-sm";
  
  // Conditional classes for error state
  const errorClasses = "border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500";
  const normalClasses = "border-gray-300 focus:ring-brand-secondary";
  
  const commonClasses = `${baseClasses} ${error ? errorClasses : normalClasses}`;


  const renderField = () => {
    switch (element) {
      case 'input_name': {
        const subInputClasses = `${baseClasses} ${error ? errorClasses : normalClasses}`;
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* FIX: Explicitly type subField as FormField to resolve property access errors. */}
            {Object.values(fields || {}).map((subField: FormField) => (
               <div key={subField.attributes.name}>
                 <label className="block text-gray-700 font-semibold mb-1" htmlFor={subField.attributes.name}>{subField.settings.label}</label>
                 <input
                   type="text"
                   id={subField.attributes.name}
                   name={subField.attributes.name}
                   value={value?.[subField.attributes.name] || ''}
                   onChange={(e) => onChange(attributes.name, { ...value, [subField.attributes.name]: e.target.value })}
                   className={subInputClasses}
                 />
              </div>
            ))}
          </div>
        );
      }
      case 'input_text':
      case 'input_email':
      case 'input_number':
        return (
          <input
            type={attributes.type || 'text'}
            id={attributes.name}
            name={attributes.name}
            value={value || ''}
            onChange={(e) => onChange(attributes.name, e.target.value)}
            placeholder={attributes.placeholder}
            className={commonClasses}
          />
        );
      case 'checkbox_group': {
        const currentValues = Array.isArray(value) ? value : [];
        
        const handleCheckboxChange = (optionValue: string, isChecked: boolean) => {
            let newValues: string[];
            
            if (optionValue === 'None' && isChecked) {
                newValues = ['None'];
            } else {
                let updatedValues = isChecked
                  ? [...currentValues, optionValue]
                  : currentValues.filter(v => v !== optionValue);

                if (updatedValues.includes('None') && updatedValues.length > 1) {
                    updatedValues = updatedValues.filter(v => v !== 'None');
                }
                newValues = updatedValues;
            }
            onChange(attributes.name, newValues);
        };

        return (
            <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-lg border ${error ? 'border-red-500' : 'border-gray-200'}`}>
                {settings.advanced_options?.map(option => (
                    <div key={option.value} className="flex items-center">
                        <input
                            type="checkbox"
                            id={`${attributes.name}-${option.value}`}
                            name={attributes.name}
                            value={option.value}
                            checked={currentValues.includes(option.value)}
                            onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                            className="h-4 w-4 text-brand-primary focus:ring-brand-secondary border-gray-300 rounded"
                        />
                        <label htmlFor={`${attributes.name}-${option.value}`} className="ml-2 block text-sm text-gray-700">
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>
        );
      }
      case 'select':
        return (
          <select
            id={attributes.name}
            name={attributes.name}
            value={value || ''}
            onChange={(e) => onChange(attributes.name, e.target.value)}
            className={commonClasses}
          >
            <option value="">{settings.placeholder || '- Select -'}</option>
            {settings.advanced_options?.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        );
      case 'gdpr_agreement':
        return (
          <div className={`flex items-start bg-gray-50 p-4 rounded-lg border ${error ? 'border-red-500' : 'border-gray-200'}`}>
            <input
              type="checkbox"
              id={attributes.name}
              name={attributes.name}
              checked={!!value}
              onChange={(e) => onChange(attributes.name, e.target.checked)}
              className="mt-1 h-4 w-4 text-brand-primary focus:ring-brand-secondary border-gray-300 rounded"
            />
            <label htmlFor={attributes.name} className="ml-3 block text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: settings.tnc_html || '' }} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-gray-700 font-semibold mb-2" htmlFor={attributes.name}>
        {settings.label}
      </label>
      {settings.help_message && <p className="text-sm text-gray-500 mb-2">{settings.help_message}</p>}
      {renderField()}
      {error && (
        <p className="flex items-center text-red-600 text-sm mt-2 font-medium">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
        </p>
      )}
    </div>
  );
};

interface QuoteFormProps {
  step: Step;
  formData: Record<string, any>;
  formErrors: Record<string, string>;
  onDataChange: (name: string, value: any) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  isLastStep: boolean;
  currentStep: number;
  totalSteps: number;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({
  step,
  formData,
  formErrors,
  onDataChange,
  onNextStep,
  onPrevStep,
  isLastStep,
  currentStep,
  totalSteps
}) => {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div>
        <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-primary mb-2">{step.title}</h2>
            <p className="text-gray-500">Let's get some details to provide you with the best quotes.</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>
        </div>

      {step.fields.map(field => {
        const fieldName = field.attributes.name;
        if (!fieldName) return null;

        const { conditional_logics } = field.settings;
        if (conditional_logics?.status) {
          const shouldRender = conditional_logics.conditions.some(cond => {
            const value = formData[cond.field];
            if (cond.operator === '=') {
                return Array.isArray(value) ? value.includes(cond.value) : value === cond.value;
            }
            return false;
          });
          if (!shouldRender) return null;
        }

        return (
          <FormFieldComponent
            key={fieldName}
            field={field}
            value={formData[fieldName]}
            error={formErrors[fieldName]}
            onChange={onDataChange}
          />
        );
      })}

      <div className="mt-10 flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-4">
        <div>
            {currentStep > 0 && (
              <button
                type="button"
                onClick={onPrevStep}
                className="w-full sm:w-auto px-6 py-2 text-brand-primary font-semibold rounded-lg hover:bg-brand-light transition-colors"
              >
                Back
              </button>
            )}
        </div>
        <button
          type="button"
          onClick={onNextStep}
          className="w-full sm:w-auto bg-brand-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-brand-secondary transition-colors shadow-lg"
        >
          {isLastStep ? 'Request Pricing' : 'Next'}
        </button>
      </div>
    </div>
  );
};