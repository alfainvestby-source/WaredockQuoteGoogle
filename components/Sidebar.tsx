import React from 'react';

interface SidebarProps {
  steps: string[];
  currentStep: number;
}

const CheckIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
);


export const Sidebar: React.FC<SidebarProps> = ({ steps, currentStep }) => {
  return (
    <aside className="w-full lg:w-1/4">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 lg:sticky top-8">
        <h2 className="text-lg font-semibold text-brand-primary mb-6">Quote Request</h2>
        <nav>
          <ul className="space-y-4">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isActive = index === currentStep;

              return (
                <li key={step} className="flex items-start">
                  <div className="flex flex-col items-center mr-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300
                        ${isCompleted ? 'bg-brand-primary text-white' : ''}
                        ${isActive ? 'bg-brand-light border-2 border-brand-primary text-brand-primary' : ''}
                        ${!isCompleted && !isActive ? 'bg-gray-200 text-gray-500' : ''}
                      `}
                    >
                      {isCompleted ? <CheckIcon /> : index + 1}
                    </div>
                    {index < steps.length - 1 && <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>}
                  </div>
                  <div>
                    <h3
                      className={`font-semibold transition-colors duration-300 ${
                        isActive || isCompleted ? 'text-brand-primary' : 'text-gray-500'
                      }`}
                    >
                      {step}
                    </h3>
                    <p className="text-sm text-gray-400">Please fill in the details</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};