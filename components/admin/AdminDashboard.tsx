
import React, { useState } from 'react';
import { User, UserStatus } from '../../types';
import { AdminSidebar } from './AdminSidebar';
import { UserManagement } from './UserManagement';
import { Analytics } from './Analytics';
import { Settings } from './Settings';

type AdminView = 'users' | 'analytics' | 'settings';

interface AdminDashboardProps {
    users: User[];
    onUpdateUserStatus: (userId: string, newStatus: UserStatus) => void;
    onDeleteUser: (userId: string) => void;
    onImpersonate: (user: User) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
    const [currentView, setCurrentView] = useState<AdminView>('users');

    const renderView = () => {
        switch (currentView) {
            case 'users':
                return <UserManagement {...props} />;
            case 'analytics':
                return <Analytics />;
            case 'settings':
                return <Settings />;
            default:
                return <UserManagement {...props} />;
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
