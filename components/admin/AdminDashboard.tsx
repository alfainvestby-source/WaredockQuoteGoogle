
import React, { useState } from 'react';
import { User, UserStatus, QuoteRequest, Quotation } from '../../types';
import { AdminSidebar } from './AdminSidebar';
import { UserManagement } from './UserManagement';
import { Analytics } from './Analytics';
import { Settings } from './Settings';
import { QuoteManagement } from './QuoteManagement';

type AdminView = 'users' | 'quotes' | 'analytics' | 'settings';

interface AdminDashboardProps {
    users: User[];
    quotes: QuoteRequest[];
    quotations: Quotation[];
    onUpdateUserStatus: (userId: string, newStatus: UserStatus) => void;
    onDeleteUser: (userId: string) => void;
    onImpersonate: (user: User) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
    const [currentView, setCurrentView] = useState<AdminView>('users');

    const renderView = () => {
        const { users, onUpdateUserStatus, onDeleteUser, onImpersonate, quotes, quotations } = props;

        switch (currentView) {
            case 'users':
                const nonSuperusers = users.filter(u => u.role !== 'superuser');
                return <UserManagement users={nonSuperusers} onUpdateUserStatus={onUpdateUserStatus} onDeleteUser={onDeleteUser} onImpersonate={onImpersonate} />;
            case 'quotes':
                return <QuoteManagement quotes={quotes} quotations={quotations} users={users} />;
            case 'analytics':
                return <Analytics />;
            case 'settings':
                return <Settings />;
            default:
                 const defaultNonSuperusers = users.filter(u => u.role !== 'superuser');
                return <UserManagement users={defaultNonSuperusers} onUpdateUserStatus={onUpdateUserStatus} onDeleteUser={onDeleteUser} onImpersonate={onImpersonate} />;
        }
    };

    return (
        <div className="flex flex-1 bg-gray-100">
            <AdminSidebar currentView={currentView} setCurrentView={setCurrentView} />
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                {renderView()}
            </main>
        </div>
    );
};
