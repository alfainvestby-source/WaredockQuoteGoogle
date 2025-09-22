
import React, { useState } from 'react';
import { User, UserStatus } from '../../types';

interface UserManagementProps {
    users: User[];
    onUpdateUserStatus: (userId: string, newStatus: UserStatus) => void;
    onDeleteUser: (userId: string) => void;
    onImpersonate: (user: User) => void;
}


const StatusBadge: React.FC<{ status: UserStatus }> = ({ status }) => {
    const styles = {
        active: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        suspended: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}`}>
            {status}
        </span>
    );
};

const ActionsMenu: React.FC<{ user: User, onUpdateUserStatus: UserManagementProps['onUpdateUserStatus'], onDeleteUser: UserManagementProps['onDeleteUser'], onImpersonate: UserManagementProps['onImpersonate'] }> = 
    ({ user, onUpdateUserStatus, onDeleteUser, onImpersonate }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-block text-left">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                Actions
                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        <a href="#" onClick={(e) => { e.preventDefault(); onImpersonate(user); setIsOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Impersonate</a>
                        {user.status === 'pending' && <a href="#" onClick={(e) => { e.preventDefault(); onUpdateUserStatus(user.id, 'active'); setIsOpen(false); }} className="block px-4 py-2 text-sm text-green-700 hover:bg-gray-100">Approve</a>}
                        {user.status === 'active' && <a href="#" onClick={(e) => { e.preventDefault(); onUpdateUserStatus(user.id, 'suspended'); setIsOpen(false); }} className="block px-4 py-2 text-sm text-yellow-700 hover:bg-gray-100">Suspend</a>}
                        {user.status === 'suspended' && <a href="#" onClick={(e) => { e.preventDefault(); onUpdateUserStatus(user.id, 'active'); setIsOpen(false); }} className="block px-4 py-2 text-sm text-green-700 hover:bg-gray-100">Re-activate</a>}
                        <a href="#" onClick={(e) => { e.preventDefault(); if(confirm('Are you sure?')) onDeleteUser(user.id); setIsOpen(false); }} className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100">Delete</a>
                    </div>
                </div>
            )}
        </div>
    );
};


export const UserManagement: React.FC<UserManagementProps> = (props) => {
    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-brand-primary mb-4">User Management</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {props.users.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <StatusBadge status={user.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <ActionsMenu user={user} {...props} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
