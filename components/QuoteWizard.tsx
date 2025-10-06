
import React, { useState, useMemo } from 'react';
import { Sidebar } from './Sidebar';
import { QuoteForm } from './QuoteForm';
import { Summary } from './Summary';
import { QUOTE_FORM_DEFINITION } from '../constants';
import { Step, FormField, User } from '../types';
import { LoginView } from './LoginView';

const parseFormDefinition = (): Step[] => {
    const { fields, stepsWrapper } = QUOTE_FORM_DEFINITION.form_fields;
    const stepTitles = stepsWrapper.stepStart.settings.step_titles;
    const steps: Step[] = stepTitles.map(title => ({ title, fields: [] }));

    let currentStepIndex = 0;
    fields.forEach(field => {
        if (field.element === 'form_step') {
            currentStepIndex++;
        } else if (steps[currentStepIndex]) {
            steps[currentStepIndex].fields.push(field as FormField);
        }
    });

    return steps;
};

interface QuoteWizardProps {
    user?: User | null;
    onSubmit?: (formData: Record<string, any>) => void;
    onCancel?: () => void;
    onSignup?: (email: string, role: 'merchant' | '3pl', formData: Record<string, any>) => { success: boolean, message?: string };
    onLogin?: (email: string, password: string, formData: Record<string, any>) => { success: boolean, message?: string };
    onGoogleAuth?: (formData: Record<string, any>) => { success: boolean, message?: string };
}

export const QuoteWizard: React.FC<QuoteWizardProps> = (props) => {
    const { user, onSubmit, onCancel, onSignup, onLogin, onGoogleAuth } = props;
    const formSteps = useMemo(() => parseFormDefinition(), []);
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const wizardSteps = useMemo(() => user 
        ? formSteps.map(s => s.title)
        : [...formSteps.map(s => s.title), "Create Account"],
    [user, formSteps]);
    
    const isLastFormStep = currentStep === formSteps.length - 1;
    const isAuthStep = !user && currentStep === wizardSteps.length - 1;

    const handleDataChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateStep = (): boolean => {
        const errors: Record<string, string> = {};
        const currentFields = formSteps[currentStep].fields;

        currentFields.forEach(field => {
            const { attributes, settings, element, fields } = field;
            const fieldName = attributes.name;
            const value = formData[fieldName];

            const { conditional_logics } = settings;
            if (conditional_logics?.status) {
                const shouldRender = conditional_logics.conditions.some(cond => {
                    const formValue = formData[cond.field];
                    if (cond.operator === '=') {
                        return Array.isArray(formValue) ? formValue.includes(cond.value) : formValue === cond.value;
                    }
                    return false;
                });
                if (!shouldRender) return;
            }
            
            if (element === 'input_name') {
                const nameValue = value || {};
                const firstNameRequired = fields?.first_name?.settings?.validation_rules?.required?.value;
                const lastNameRequired = fields?.last_name?.settings?.validation_rules?.required?.value;
                
                if ((firstNameRequired && !nameValue.first_name) || (lastNameRequired && !nameValue.last_name)) {
                     errors[fieldName] = "First and last name are required.";
                }
            } else {
                const rules = settings.validation_rules;
                if (!rules) return;

                if (rules.required?.value) {
                    const isMissing = (Array.isArray(value) && value.length === 0) || !value;
                    if (isMissing) {
                        errors[fieldName] = rules.required.message;
                    }
                }
                
                if (rules.email?.value && value && !/\S+@\S+\.\S+/.test(String(value))) {
                     errors[fieldName] = rules.email.message;
                }
            }
        });

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleNextStep = () => {
        if (validateStep()) {
            // Logged-in user submission
            if (isLastFormStep && user && onSubmit) {
                onSubmit(formData);
                return;
            }
            
            // Proceed to next step if available
            if (currentStep < wizardSteps.length - 1) {
                setCurrentStep(prev => prev + 1);
            }
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };
    
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-start">
            <Sidebar steps={wizardSteps} currentStep={currentStep} />
            <main className="flex-1 bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-200 w-full">
                {isAuthStep ? (
                    <LoginView
                        onLogin={(email, pass) => onLogin!(email, pass, formData)}
                        onSignup={(email, role) => onSignup!(email, role, formData)}
                        onGoogleAuth={() => onGoogleAuth!(formData)}
                        initialMode="signup"
                        title="Create Your Account"
                        subtitle="One last step to submit your quote request!"
                        forceRole="merchant"
                        prefilledEmail={formData.email}
                    />
                ) : (
                    <QuoteForm
                        step={formSteps[currentStep]}
                        formData={formData}
                        formErrors={formErrors}
                        onDataChange={handleDataChange}
                        onNextStep={handleNextStep}
                        onPrevStep={handlePrevStep}
                        onCancel={onCancel}
                        isLastStep={isLastFormStep}
                        currentStep={currentStep}
                        totalSteps={formSteps.length}
                        submitButtonText={isLastFormStep && user ? 'Submit Quote Request' : undefined}
                    />
                )}
            </main>
            <div className="lg:w-1/3 w-full">
                <Summary formData={formData} formDefinition={QUOTE_FORM_DEFINITION} />
            </div>
        </div>
    );
};
