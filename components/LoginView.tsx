

import React, { useState } from 'react';

interface LoginViewProps {
    onLogin: (email: string, password: string) => { success: boolean, message?: string };
    onSignup: (email: string, role: 'merchant' | '3pl') => { success: boolean, message?: string };
    onGoogleAuth: () => { success: boolean, message?: string };
    initialMode?: 'login' | 'signup';
    title?: string;
    subtitle?: string;
    forceRole?: 'merchant' | '3pl';
    onClose?: () => void;
    prefilledEmail?: string;
}

const RoleSelector: React.FC<{ selectedRole: 'merchant' | '3pl', onRoleChange: (role: 'merchant' | '3pl') => void }> = ({ selectedRole, onRoleChange }) => (
    <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">I am a...</label>
        <div className="flex rounded-lg border border-gray-300 p-1">
            <button
                type="button"
                onClick={() => onRoleChange('merchant')}
                className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${selectedRole === 'merchant' ? 'bg-brand-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
                Merchant
            </button>
            <button
                type="button"
                onClick={() => onRoleChange('3pl')}
                className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${selectedRole === '3pl' ? 'bg-brand-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
                3PL Provider
            </button>
        </div>
    </div>
);


export const LoginView: React.FC<LoginViewProps> = (props) => {
    const { onLogin, onSignup, onGoogleAuth, initialMode = 'login', title, subtitle, forceRole, onClose, prefilledEmail } = props;
    const [isLogin, setIsLogin] = useState(initialMode === 'login' && !prefilledEmail);
    const [email, setEmail] = useState(prefilledEmail || '');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [role, setRole] = useState<'merchant' | '3pl'>(forceRole || 'merchant');
    const [signupState, setSignupState] = useState<'form' | 'pending_approval'>('form');

    const handleEmailAuth = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        if (isLogin) {
            const result = onLogin(email, password);
            if (!result.success) setError(result.message || 'Login failed.');
        } else {
            const result = onSignup(email, role);
             if (!result.success) {
                setError(result.message || 'Signup failed.');
                return;
            }
            if (role === '3pl') setSignupState('pending_approval');
        }
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setSignupState('form');
    };

    if (signupState === 'pending_approval') {
        return (
             <div className="w-full text-center">
                <h2 className="text-2xl font-bold text-green-600 mb-2">Thank you for registering!</h2>
                <p className="text-gray-600 mb-6">Your 3PL provider account is now pending approval from our admin team. We'll notify you via email once it's been activated.</p>
                <button 
                    onClick={toggleAuthMode}
                    className="w-full bg-brand-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-brand-secondary transition-colors shadow-lg"
                >
                    Back to Sign In
                </button>
            </div>
        )
    }

    return (
        <div className="w-full mx-auto relative">
             {onClose && (
                <button onClick={onClose} className="absolute -top-4 -right-4 text-gray-400 hover:text-gray-600" aria-label="Close">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            )}
            <h2 className="text-2xl font-bold text-center text-brand-text mb-2">{title || (isLogin ? 'Sign In' : 'Create Account')}</h2>
            <p className="text-center text-gray-500 mb-6">{subtitle || 'to access your dashboard'}</p>
            
            <button
                onClick={onGoogleAuth}
                type="button"
                className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
            >
                <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                <span>Continue with Google</span>
            </button>

            <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
                {!isLogin && !forceRole && <RoleSelector selectedRole={role} onRoleChange={setRole} />}
                <div>
                    <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">Email Address</label>
                    <input
                        id="email" name="email" type="email" autoComplete="email" required
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-shadow shadow-sm read-only:bg-gray-100 read-only:cursor-not-allowed"
                        placeholder="you@example.com"
                        readOnly={!!prefilledEmail}
                        aria-readonly={!!prefilledEmail}
                    />
                </div>

                <div>
                    <label htmlFor="password"className="block text-gray-700 font-semibold mb-1">Password</label>
                    <input
                        id="password" name="password" type="password" autoComplete="current-password" required
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-shadow shadow-sm"
                        placeholder="••••••••"
                    />
                </div>
                
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div>
                    <button
                        type="submit"
                        className="w-full bg-brand-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-brand-secondary transition-colors shadow-lg mt-2"
                    >
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </div>
            </form>
            
            <p className="text-center text-sm text-gray-600 mt-8">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button onClick={toggleAuthMode} className="font-semibold text-brand-secondary hover:underline ml-1">
                    {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
            </p>
        </div>
    );
};