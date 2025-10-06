
import React, { useState, useRef, useEffect } from 'react';
import { User, UserRole } from '../types';

interface HeaderProps {
    user: User | null;
    onLogout?: () => void;
    isImpersonating?: boolean;
    onExitImpersonation?: () => void;
    onLoginClick?: () => void;
    activeRole?: UserRole | null;
    onSwitchRole?: (role: 'merchant' | '3pl') => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, isImpersonating, onExitImpersonation, onLoginClick, activeRole, onSwitchRole }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogoutClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onLogout) {
            onLogout();
        }
        setIsMenuOpen(false);
    }

    return (
        <>
        {isImpersonating && user && (
            <div className="bg-yellow-400 text-yellow-900 text-center py-2 px-4 font-semibold">
                You are currently impersonating {user.email}. 
                <button onClick={onExitImpersonation} className="underline hover:text-yellow-800 ml-2 font-bold">Exit Impersonation</button>
            </div>
        )}
        <header className="bg-brand-primary shadow-lg">
            <div className="container mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
                <div className="flex items-center">
                   <img src="https://www.waredock.com/wp-content/uploads/2019/09/waredock-white-long-100-300.png" alt="Waredock Logo" className="h-8" />
                </div>
                {user ? (
                    <div className="relative" ref={menuRef}>
                        <button 
                            onClick={toggleMenu} 
                            className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-primary focus:ring-white" 
                            aria-haspopup="true" 
                            aria-expanded={isMenuOpen}
                            aria-label="User menu"
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                                <div className="px-4 py-2 border-b">
                                    <p className="text-sm text-gray-700">Signed in as</p>
                                    <p className="text-sm font-medium text-brand-primary truncate">{user.email}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user.role} Account</p>
                                </div>
                                
                                {user.role !== 'superuser' && onSwitchRole && activeRole && (
                                    <div className="px-4 py-3 border-b">
                                        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">View Dashboard As</label>
                                        <div className="flex rounded-lg border border-gray-200 p-1 bg-gray-50">
                                            <button
                                                type="button"
                                                onClick={() => { onSwitchRole('merchant'); setIsMenuOpen(false); }}
                                                className={`w-1/2 py-1 text-sm font-semibold rounded-md transition-colors duration-150 ${activeRole === 'merchant' ? 'bg-brand-primary text-white shadow-sm' : 'text-gray-600 hover:bg-brand-light'}`}
                                            >
                                                Merchant
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { onSwitchRole('3pl'); setIsMenuOpen(false); }}
                                                className={`w-1/2 py-1 text-sm font-semibold rounded-md transition-colors duration-150 ${activeRole === '3pl' ? 'bg-brand-primary text-white shadow-sm' : 'text-gray-600 hover:bg-brand-light'}`}
                                            >
                                                3PL Provider
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Settings</a>
                                <a href="#" onClick={handleLogoutClick} className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100" role="menuitem">Sign Out</a>
                            </div>
                        )}
                    </div>
                ) : (
                     <div>
                        <button 
                            onClick={onLoginClick} 
                            className="bg-brand-accent text-brand-primary font-bold px-6 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm"
                        >
                            Get Started
                        </button>
                    </div>
                )}
            </div>
        </header>
        </>
    );
};
