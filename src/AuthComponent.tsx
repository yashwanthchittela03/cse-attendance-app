import React, { useState } from 'react';

export default function AuthComponent({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const formattedRoll = rollNumber.trim().toUpperCase();
    if (!formattedRoll || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('attendance_users') || '{}');

    if (isSignUp) {
      if (users[formattedRoll]) {
        setErrorMsg('Account already exists for this Roll Number. Please Log In.');
        return;
      }
      users[formattedRoll] = { password };
      localStorage.setItem('attendance_users', JSON.stringify(users));
      localStorage.setItem('current_user', formattedRoll);
      onLoginSuccess();
    } else {
      if (!users[formattedRoll] || users[formattedRoll].password !== password) {
        setErrorMsg('Invalid Roll Number or Password.');
        return;
      }
      localStorage.setItem('current_user', formattedRoll);
      onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">CSE Attendance Tracker</h1>
          <p className="text-sm text-slate-400">
            {isSignUp ? 'Create your account' : 'Enter credentials to continue'}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3.5 rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">
              Roll Number / Student ID
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 24B81A05BY"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 uppercase"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
          >
            {isSignUp ? 'Register Account' : 'Log In'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg('');
            }}
            className="text-xs text-slate-400 hover:text-indigo-400 transition-colors"
          >
            {isSignUp ? 'Already have an account? Log In' : "First time here? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}