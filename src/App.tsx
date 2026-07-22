import { useState, useEffect } from 'react';
import AuthComponent from './AuthComponent';
import Dashboard from './Dashboard';

export default function App() {
  const [session, setSession] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('current_user');
    if (user) {
      setSession(user);
    }
  }, []);

  return session ? (
    <Dashboard onLogout={() => setSession(null)} />
  ) : (
    <AuthComponent onLoginSuccess={() => setSession(localStorage.getItem('current_user'))} />
  );
}