import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      // Wait a tiny bit for role to sync in context
      setTimeout(() => navigate('/discover'), 500); 
    } catch (err) {
      setError("Invalid Email or Password");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
        <div className="flex justify-center mb-6">
           <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-indigo-500 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg">HS</div>
        </div>
        <h2 className="text-3xl font-bold text-white text-center mb-2">Welcome Back</h2>
        <p className="text-slate-400 text-center mb-8">Sign in to HostelSync.</p>
        
        {error && <div className="bg-rose-500/10 text-rose-500 p-3 rounded-xl mb-6 text-sm border border-rose-500/20 text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wide">Email Address</label>
            <input type="email" placeholder="you@college.edu" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-800 text-white p-3.5 rounded-xl border border-slate-700 outline-none focus:border-indigo-500 transition-colors" />
          </div>
          <div>
             <div className="flex justify-between items-center mb-2">
               <label className="block text-slate-400 text-xs font-bold uppercase tracking-wide">Password</label>
             </div>
            <input type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-800 text-white p-3.5 rounded-xl border border-slate-700 outline-none focus:border-indigo-500 transition-colors" />
          </div>
          
          <button disabled={isLoading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white font-bold p-3.5 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/30 flex justify-center items-center">
             {isLoading ? 'Authenticating...' : 'Sign In securely'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-slate-400 text-sm">
          New here? <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
