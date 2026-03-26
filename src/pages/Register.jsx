import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setLocalRole] = useState('student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(email, password, name, role);
      navigate(role === 'admin' ? '/admin/dashboard' : '/discover');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-slate-400 mb-6">Join HostelSync today.</p>
        
        {error && <div className="bg-rose-500/10 text-rose-500 p-3 rounded-xl mb-4 text-sm border border-rose-500/20">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wide">Full Name</label>
            <input type="text" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 outline-none focus:border-indigo-500 transition-colors" />
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wide">Email Address</label>
            <input type="email" placeholder="you@college.edu" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 outline-none focus:border-indigo-500 transition-colors" />
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wide">Password</label>
            <input type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 outline-none focus:border-indigo-500 transition-colors" />
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wide">Account Type</label>
            <select value={role} onChange={e => setLocalRole(e.target.value)} className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 outline-none focus:border-indigo-500 transition-colors">
              <option value="student">Student (Find & Book)</option>
              <option value="admin">Administrator (Manage Hostels)</option>
            </select>
          </div>
          
          <button disabled={isLoading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white font-bold p-3.5 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/30 mt-6 flex justify-center items-center">
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-slate-400 text-sm">
          Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
