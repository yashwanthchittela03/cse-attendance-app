import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Dashboard } from './Dashboard';

export const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const formatEmail = (userStr: string) => {
    const cleanUser = userStr.trim().toLowerCase().replace(/\s+/g, '');
    return `${cleanUser}@attendance.local`;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formattedEmail = formatEmail(username);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: formattedEmail,
          password,
          options: {
            data: { display_name: username.trim() },
          },
        });
        if (error) throw error;
        alert('Account created! You can now log in.');
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formattedEmail,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (session && session.user) {
    const displayName =
      session.user.user_metadata?.display_name ||
      session.user.email?.split('@')[0] ||
      'User';

    return (
      <Dashboard
        user={{ id: session.user.id, name: displayName }}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#121212',
        color: '#e0e0e0',
        fontFamily: 'sans-serif',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          padding: '32px',
          borderRadius: '12px',
          backgroundColor: '#1e1e1e',
          border: '1px solid #2d2d2d',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginTop: 0, color: '#ffffff', fontSize: '22px' }}>
          {isSignUp ? 'Create Account' : 'Login'}
        </h2>

        {errorMsg && (
          <p style={{ color: '#ff5252', fontSize: '13px', textAlign: 'center', marginBottom: '16px' }}>
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#b0b0b0', marginBottom: '6px' }}>
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                boxSizing: 'border-box',
                borderRadius: '6px',
                border: '1px solid #333',
                backgroundColor: '#2a2a2a',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#b0b0b0', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                boxSizing: 'border-box',
                borderRadius: '6px',
                border: '1px solid #333',
                backgroundColor: '#2a2a2a',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              padding: '12px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '15px',
            }}
          >
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: '#888' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </span>{' '}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              cursor: 'pointer',
              fontWeight: 'bold',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;