import React, { useState } from 'react';
import { bookRoom } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck as ShieldCheckIcon, X as XMarkIcon } from 'lucide-react';

const BookingModal = ({ isOpen, onClose, hostel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleBooking = async () => {
    setLoading(true);
    setError('');
    try {
      if(!currentUser) {
         navigate('/login');
         return;
      }
      await bookRoom(hostel.id, currentUser.uid);
      onClose();
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl relative">
        <div className="p-6 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
           <div className="flex items-center space-x-3 text-indigo-400">
             <div className="p-2 bg-indigo-500/20 rounded-lg">
                <ShieldCheckIcon className="w-5 h-5" />
             </div>
             <span className="font-bold tracking-widest uppercase text-xs">Secure Cryptographic Lock</span>
           </div>
           <button onClick={!loading ? onClose : undefined} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-xl transition-colors"><XMarkIcon className="w-5 h-5"/></button>
        </div>
        
        <div className="p-8">
          <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-wide leading-tight">{hostel.name}</h3>
          <p className="text-slate-400 mb-8 font-medium">{hostel.location}</p>
          
          {error && (
             <div className="p-4 mb-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-bold text-center flex items-center justify-center space-x-2">
                <XMarkIcon className="w-4 h-4" />
                <span>{error}</span>
             </div>
          )}
          
          <div className="bg-slate-950 rounded-2xl p-6 mb-8 border border-slate-800 shadow-inner">
            <div className="flex justify-between items-center mb-5 pb-5 border-b border-slate-800/50">
              <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Room Allocation</span>
              <span className="text-white font-bold text-sm bg-slate-800 px-3 py-1 rounded-lg">Standard Assignment</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-bold uppercase tracking-widest text-xs">Total Due at Check-in</span>
              <span className="text-emerald-400 font-black text-3xl">₹{hostel.pricePerMonth}</span>
            </div>
            <p className="text-right text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">Per Month Basis</p>
          </div>
          
          <button 
             onClick={handleBooking}
             disabled={loading || hostel.availableRooms <= 0}
             className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center text-lg"
          >
             {loading ? <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div> : 'Confirm Application'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
