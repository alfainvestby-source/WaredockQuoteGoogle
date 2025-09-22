
import React from 'react';

type AdminView = 'users' | 'analytics' | 'settings';

interface AdminSidebarProps {
    currentView: AdminView;
    setCurrentView: (view: AdminView) => void;
}

const NavItem: React.FC<{
    view: AdminView;
    label: string;
    icon: JSX.Element;
    currentView: AdminView;
    onClick: (view: AdminView) => void;
}> = ({ view, label, icon, currentView, onClick }) => {
    const isActive = currentView === view;
    return (
        <li>
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    onClick(view);
                }}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                    isActive
                        ? 'bg-brand-primary text-white shadow-md'
                        : 'text-gray-600 hover:bg-brand-light hover:text-brand-primary'
                }`}
            >
                {icon}
                <span className="ml-3 font-semibold">{label}</span>
            </a>
        </li>
    );
};


export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentView, setCurrentView }) => {
    const iconClass = "w-6 h-6";

    return (
        <aside className="w-64 bg-white shadow-md flex-shrink-0">
            <div className="p-4 border-b">
                <h2 className="text-xl font-bold text-brand-primary">Admin Panel</h2>
            </div>
            <nav className="p-4">
                <ul className="space-y-2">
                    <NavItem 
                        view="users" 
                        label="User Management"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.274-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.274.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                        currentView={currentView}
                        onClick={setCurrentView}
                    />
                     <NavItem 
                        view="analytics" 
                        label="Analytics"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                        currentView={currentView}
                        onClick={setCurrentView}
                    />
                     <NavItem 
                        view="settings" 
                        label="Settings"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                        currentView={currentView}
                        onClick={setCurrentView}
                    />
                </ul>
            </nav>
        </aside>
    );
};
