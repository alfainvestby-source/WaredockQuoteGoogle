
import React, { useState } from 'react';
import { Header } from './components/Header';
import { LogisticsDashboard } from './components/LogisticsDashboard';
import { QuoteWizard } from './components/QuoteWizard';
import { LoginView } from './components/LoginView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { User } from './types';
import { DUMMY_USERS } from './data';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(DUMMY_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [impersonatedUser, setImpersonatedUser] = useState<User | null>(null);
  const [showStandaloneLogin, setShowStandaloneLogin] = useState(false);


  const effectiveUser = impersonatedUser || currentUser;

  const submitQuote = (user: User, quoteData: Record<string, any>) => {
    console.log('Submitting quote for user', user.email, quoteData);
    // In a real app, you would save this to your backend,
    // associating the quote data with the user.
    alert(`Quote request for ${user.email} has been submitted!`);
  }

  const handleLogin = (email: string, password: string, quoteData?: Record<string, any>): { success: boolean, message?: string } => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, message: 'No account found with that email.' };
    }
    
    if (user.status === 'pending') {
      return { success: false, message: 'Your account is pending admin approval.' };
    }
    if (user.status === 'suspended') {
      return { success: false, message: 'Your account has been suspended.' };
    }

    setCurrentUser(user);
    if (quoteData && Object.keys(quoteData).length > 0) {
        submitQuote(user, quoteData);
    }
    setShowStandaloneLogin(false);
    return { success: true };
  };

  const handleSignup = (email: string, role: 'merchant' | '3pl', quoteData: Record<string, any>): { success: boolean, message?: string } => {
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: 'An account with this email already exists.'};
    }

    const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        authMethod: 'email',
        role,
        status: role === 'merchant' ? 'active' : 'pending',
    };
    
    setUsers(prev => [...prev, newUser]);

    if (newUser.status === 'active') {
        setCurrentUser(newUser);
        if (quoteData && Object.keys(quoteData).length > 0) {
            submitQuote(newUser, quoteData);
        }
    }
    setShowStandaloneLogin(false);
    return { success: true };
  };
  
  const handleGoogleAuth = (quoteData?: Record<string, any>): { success: boolean, message?: string } => {
      // In a real app, this would trigger the Google OAuth flow.
      // We'll simulate finding or creating a merchant user.
      const googleEmail = 'merchant.google@example.com';
      let user = users.find(u => u.email.toLowerCase() === googleEmail.toLowerCase());

      if (!user) {
          // If user doesn't exist, create a new merchant account
          user = {
              id: `user-${Date.now()}`,
              email: googleEmail,
              authMethod: 'google',
              role: 'merchant',
              status: 'active',
          };
          setUsers(prev => [...prev, user as User]);
      }
      
      setCurrentUser(user);
      if (quoteData && Object.keys(quoteData).length > 0) {
          submitQuote(user, quoteData);
      }
      setShowStandaloneLogin(false);
      return { success: true };
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setImpersonatedUser(null);
    setShowStandaloneLogin(false);
  };
  
  const handleImpersonate = (userToImpersonate: User) => {
    if (currentUser?.role === 'superuser') {
      setImpersonatedUser(userToImpersonate);
    }
  };

  const handleExitImpersonation = () => {
    setImpersonatedUser(null);
  };

  const handleUpdateUserStatus = (userId: string, newStatus: 'active' | 'suspended' | 'pending') => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
  };
  
  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const renderContent = () => {
      if (showStandaloneLogin) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-100 p-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                    <LoginView
                      onLogin={(email, pass) => handleLogin(email, pass, {})}
                      onSignup={(email, role) => handleSignup(email, role, {})}
                      onGoogleAuth={() => handleGoogleAuth({})}
                      onClose={() => setShowStandaloneLogin(false)}
                      title="Access Your Account"
                      subtitle="Sign in or create a new account to continue"
                    />
                </div>
            </div>
        );
      }

      if (!effectiveUser) {
        return <QuoteWizard 
            onLogin={handleLogin} 
            onSignup={handleSignup} 
            onGoogleAuth={handleGoogleAuth}
        />;
      }

      // Superuser sees admin dashboard UNLESS they are impersonating
      if (currentUser?.role === 'superuser' && !impersonatedUser) {
          return <AdminDashboard 
            users={users.filter(u => u.role !== 'superuser')} // Admins can't manage other admins
            onUpdateUserStatus={handleUpdateUserStatus}
            onDeleteUser={handleDeleteUser}
            onImpersonate={handleImpersonate}
          />;
      }

      // Render role-specific dashboards for the effective user
      switch (effectiveUser.role) {
          case '3pl':
              return <LogisticsDashboard />;
          case 'merchant':
              return <LogisticsDashboard />;
          default:
              handleLogout();
              return null;
      }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-brand-text">
      <Header 
        user={effectiveUser}
        onLogout={handleLogout}
        isImpersonating={!!impersonatedUser}
        onExitImpersonation={handleExitImpersonation}
        onLoginClick={() => setShowStandaloneLogin(true)}
      />
      <main className="flex flex-1">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;