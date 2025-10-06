
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { LogisticsDashboard } from './components/LogisticsDashboard';
import { QuoteWizard } from './components/QuoteWizard';
import { LoginView } from './components/LoginView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { User, QuoteRequest, Quotation, UserRole, Message } from './types';
import { DUMMY_USERS, DUMMY_QUOTES, DUMMY_QUOTATIONS } from './data';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(DUMMY_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [impersonatedUser, setImpersonatedUser] = useState<User | null>(null);
  const [viewAsRole, setViewAsRole] = useState<UserRole | null>(null);
  const [showStandaloneLogin, setShowStandaloneLogin] = useState(false);
  const [quotes, setQuotes] = useState<QuoteRequest[]>(DUMMY_QUOTES);
  const [quotations, setQuotations] = useState<Quotation[]>(DUMMY_QUOTATIONS);
  const [isRequestingQuote, setIsRequestingQuote] = useState(false);


  useEffect(() => {
    const quotedRequestIds = new Set(DUMMY_QUOTATIONS.map(q => q.quoteRequestId));
    const synchronizedQuotes = DUMMY_QUOTES.map(quote => {
        if (quotedRequestIds.has(quote.id) && quote.status !== 'Quoted') {
            return { ...quote, status: 'Quoted' as const };
        }
        return quote;
    });
    setQuotes(synchronizedQuotes);
  }, []);

  const effectiveUser = useMemo(() => {
    const baseUser = impersonatedUser || currentUser;
    if (!baseUser) return null;
    
    const role = viewAsRole || baseUser.role;

    if (role === baseUser.role) {
        return baseUser;
    }
    
    return { ...baseUser, role };
  }, [currentUser, impersonatedUser, viewAsRole]);


  const createAndSubmitQuote = (user: User, quoteData: Record<string, any>) => {
    console.log('Submitting quote for user', user.email, quoteData);
    const newQuoteRequest: QuoteRequest = {
        id: `QR-${Date.now()}`,
        status: 'New Request',
        formData: { ...quoteData, email: user.email }, // Ensure user's email is attached
        submittedAt: new Date(),
        communications: [],
    };
    setQuotes(prev => [newQuoteRequest, ...prev]);
    alert(`Quote request for ${user.email} has been submitted!`);
  }

  const handleLogin = (email: string, password: string, quoteData?: Record<string, any>): { success: boolean, message?: string } => {
    const lowerCaseEmail = email.toLowerCase();
    
    let user = users.find(u => u.email.toLowerCase() === lowerCaseEmail);
    if (!user && lowerCaseEmail === 'admin') {
        user = users.find(u => u.role === 'superuser');
    }

    if (!user) {
      return { success: false, message: 'No account found with that email.' };
    }
    
    if (user.role === 'superuser' && password !== 'admin') {
      return { success: false, message: 'Invalid credentials.' };
    }
    
    if (user.status === 'pending') {
      return { success: false, message: 'Your account is pending admin approval.' };
    }
    if (user.status === 'suspended') {
      return { success: false, message: 'Your account has been suspended.' };
    }

    setCurrentUser(user);
    setViewAsRole(user.role);
    if (quoteData && Object.keys(quoteData).length > 0) {
        createAndSubmitQuote(user, quoteData);
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
        setViewAsRole(newUser.role);
        if (quoteData && Object.keys(quoteData).length > 0) {
            createAndSubmitQuote(newUser, quoteData);
        }
    }
    setShowStandaloneLogin(false);
    return { success: true };
  };
  
  const handleGoogleAuth = (quoteData?: Record<string, any>): { success: boolean, message?: string } => {
      const googleEmail = 'merchant.google@example.com';
      let user = users.find(u => u.email.toLowerCase() === googleEmail.toLowerCase());

      if (!user) {
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
      setViewAsRole(user.role);
      if (quoteData && Object.keys(quoteData).length > 0) {
          createAndSubmitQuote(user, quoteData);
      }
      setShowStandaloneLogin(false);
      return { success: true };
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setImpersonatedUser(null);
    setViewAsRole(null);
    setShowStandaloneLogin(false);
  };
  
  const handleImpersonate = (userToImpersonate: User) => {
    if (currentUser?.role === 'superuser') {
      setImpersonatedUser(userToImpersonate);
      setViewAsRole(userToImpersonate.role);
    }
  };

  const handleExitImpersonation = () => {
    setImpersonatedUser(null);
     if (currentUser) {
        setViewAsRole(currentUser.role);
    }
  };

  const handleUpdateUserStatus = (userId: string, newStatus: 'active' | 'suspended' | 'pending') => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
  };
  
  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };
  
  const handleRoleSwitch = (role: 'merchant' | '3pl') => {
      if (effectiveUser && effectiveUser.role !== 'superuser') {
          setViewAsRole(role);
      }
  };
  
  const handleStartQuoteRequest = () => setIsRequestingQuote(true);
  
  const handleCancelQuoteRequest = () => setIsRequestingQuote(false);

  const handleSubmitNewQuote = (quoteData: Record<string, any>) => {
      if (effectiveUser) {
          createAndSubmitQuote(effectiveUser, quoteData);
          setIsRequestingQuote(false);
      }
  };


  const handleAddQuotation = (quoteRequestId: string, quotationId: string, pricingData: any) => {
        if (!effectiveUser || effectiveUser.role !== '3pl') {
            alert("Error: Only 3PL providers can submit quotations.");
            return;
        }

        const newQuotation: Quotation = {
            id: quotationId,
            quoteRequestId,
            submittedBy: effectiveUser.id,
            submittedAt: new Date(),
            pricing: {
                storageFee: parseFloat(pricingData.storageFee),
                inboundFee: parseFloat(pricingData.inboundFee),
                pickPackFirst: parseFloat(pricingData.pickPackFirst),
                pickPackAdditional: parseFloat(pricingData.pickPackAdditional),
                packagingFee: pricingData.packagingFee ? parseFloat(pricingData.packagingFee) : undefined,
                accountFee: pricingData.accountFee ? parseFloat(pricingData.accountFee) : undefined,
            },
            quoteExpiry: pricingData.quoteExpiry,
            notes: pricingData.notes,
            shareableUrl: `${window.location.origin}/portal/view-quote/${quotationId}`,
            status: 'Pending',
        };

        setQuotations(prev => [...prev, newQuotation]);
        setQuotes(prev => prev.map(q => q.id === quoteRequestId ? { ...q, status: 'Quoted' } : q));
        alert('Quotation submitted successfully!');
    };

    const handleAcceptQuotation = (quotationId: string) => {
        setQuotations(prev => prev.map(q => 
            q.id === quotationId ? { ...q, status: 'Accepted' } : q
        ));
    };
    
    const handleSendMessage = (quoteRequestId: string, messageText: string) => {
        if (!effectiveUser) return;
        
        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            senderId: effectiveUser.id,
            text: messageText,
            timestamp: new Date(),
            isUnread: true,
        };
        
        setQuotes(prev => prev.map(q => {
            if (q.id === quoteRequestId) {
                const updatedCommunications = [...(q.communications || []), newMessage];
                return { ...q, communications: updatedCommunications };
            }
            return q;
        }));
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
      
      // Show quote wizard for anonymous users OR logged-in users starting a new request
      if (!effectiveUser || isRequestingQuote) {
        return <QuoteWizard 
            user={effectiveUser}
            onLogin={handleLogin} 
            onSignup={handleSignup} 
            onGoogleAuth={handleGoogleAuth}
            onSubmit={handleSubmitNewQuote}
            onCancel={isRequestingQuote ? handleCancelQuoteRequest : undefined}
        />;
      }

      if (currentUser?.role === 'superuser' && !impersonatedUser) {
          return <AdminDashboard 
            users={users}
            quotes={quotes}
            quotations={quotations}
            onUpdateUserStatus={handleUpdateUserStatus}
            onDeleteUser={handleDeleteUser}
            onImpersonate={handleImpersonate}
          />;
      }
      
      const merchantQuotes = quotes.filter(q => q.formData.email === effectiveUser.email);
      const merchantQuoteRequestIds = new Set(merchantQuotes.map(q => q.id));
      const merchantQuotations = quotations.filter(q => merchantQuoteRequestIds.has(q.quoteRequestId));

      switch (effectiveUser.role) {
          case '3pl':
              return <LogisticsDashboard 
                user={effectiveUser}
                quotes={quotes}
                quotations={quotations}
                users={users}
                onAddQuotation={handleAddQuotation}
                onAcceptQuotation={handleAcceptQuotation}
                onSendMessage={handleSendMessage}
                 />;
          case 'merchant':
              return <LogisticsDashboard 
                user={effectiveUser}
                quotes={merchantQuotes}
                quotations={merchantQuotations}
                users={users}
                onAddQuotation={handleAddQuotation}
                onAcceptQuotation={handleAcceptQuotation}
                onSendMessage={handleSendMessage}
                onStartQuoteRequest={handleStartQuoteRequest}
                 />;
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
        activeRole={effectiveUser?.role}
        onSwitchRole={handleRoleSwitch}
      />
      <main className="flex flex-1">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
