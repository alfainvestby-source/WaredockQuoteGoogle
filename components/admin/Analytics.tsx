
import React from 'react';

const StatCard: React.FC<{ title: string; value: string; change?: string }> = ({ title, value, change }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 uppercase">{title}</h3>
        <p className="mt-1 text-3xl font-semibold text-brand-primary">{value}</p>
        {change && <p className="text-sm text-green-500 mt-1">{change}</p>}
    </div>
);

const ChartPlaceholder: React.FC<{ title: string }> = ({ title }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-brand-primary mb-4">{title}</h3>
        <div className="bg-gray-100 rounded-md h-64 flex items-center justify-center">
            <p className="text-gray-400">Chart Data Unavailable</p>
        </div>
    </div>
);


export const Analytics: React.FC = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-brand-primary mb-6">Platform Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Merchants" value="1,284" change="+5.2% this month" />
                <StatCard title="Total 3PL Providers" value="112" change="+2 active this month" />
                <StatCard title="Active Contracts" value="859" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartPlaceholder title="Merchant Growth Trends" />
                <ChartPlaceholder title="New Quotes Requested (30 Days)" />
            </div>
        </div>
    );
};
