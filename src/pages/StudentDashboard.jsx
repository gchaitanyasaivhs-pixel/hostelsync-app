import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase/config';
import { collection, query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { LogOut as LogOutIcon, Bell as BellIcon, Home as HomeIcon, Settings as SettingsIcon, RefreshCcw as RefreshCcwIcon } from 'lucide-react';

const StudentDashboard = () => {
  const { currentUser, logout, role } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    
    // Real-time notifications listener
    const qNotifs = query(collection(db, 'notifications'), where('userId', '==', currentUser.uid), orderBy('createdAt', 'desc'));
    const unsubNotifs = onSnapshot(qNotifs, (snap) => {
       setNotifications(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch Bookings
    const fetchBookings = async () => {
       const qBooks = query(collection(db, 'bookings'), where('userId', '==', currentUser.uid), orderBy('createdAt', 'desc'));
       const snapList = await getDocs(qBooks);
       setBookings(snapList.docs.map(doc => ({ id: doc.id, ...doc.data() })));
       setLoading(false);
    };
    
    fetchBookings();
    
    return () => unsubNotifs();
  }, [currentUser]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
      <header className="border-b border-slate-800 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-30">
         <div className="container mx-auto px-8 py-6 flex items-center justify-between">
            <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate('/discover')}>
               <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-indigo-500 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg">HS</div>
               <h1 className="text-xl font-black text-white tracking-widest uppercase hidden lg:block">System Node</h1>
            </div>
            
            <div className="flex items-center space-x-6">
               <button onClick={() => navigate('/discover')} className="text-slate-400 hover:text-white font-bold transition-colors uppercase tracking-widest text-xs flex items-center"><HomeIcon className="w-4 h-4 mr-2"/> Catalog</button>
               <div className="relative">
                  <BellIcon className="w-6 h-6 text-slate-400" />
                  {notifications.filter(n => !n.isRead).length > 0 && (
                     <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-[#020617] animate-pulse"></span>
                  )}
               </div>
               <div className="w-px h-6 bg-slate-800"></div>
               <button onClick={handleLogout} className="text-rose-400 hover:text-rose-500 font-bold transition-colors uppercase tracking-widest text-xs flex items-center"><LogOutIcon className="w-4 h-4 mt-0.5 mr-2"/> Sign Out</button>
            </div>
         </div>
      </header>

      <main className="container mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 border border-slate-800 rounded-[3rem] p-10 bg-slate-900 shadow-xl overflow-hidden relative">
           <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 blur-[60px] rounded-full"></div>
           <div className="w-24 h-24 rounded-[2rem] bg-slate-950 border border-slate-800 mx-auto flex items-center justify-center text-4xl mb-6 shadow-inner tracking-tighter text-indigo-400 font-black">
              {currentUser?.email?.charAt(0).toUpperCase()}
           </div>
           <h2 className="text-2xl font-black text-white text-center mb-1 uppercase tracking-wide">{currentUser?.displayName || 'Resident Node'}</h2>
           <p className="text-slate-500 text-center text-xs font-black tracking-widest uppercase mb-10">{role} Clearance</p>
           
           <div className="space-y-4">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex justify-between items-center transition-colors hover:border-slate-700 cursor-pointer">
                 <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total Bookings</span>
                 <span className="text-xl font-black text-white">{bookings.length}</span>
              </div>
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex justify-between items-center transition-colors hover:border-slate-700 cursor-pointer">
                 <span className="text-xs font-black uppercase tracking-widest text-slate-400">Settings</span>
                 <SettingsIcon className="w-5 h-5 text-slate-500" />
              </div>
           </div>
        </div>

        <div className="lg:col-span-2 space-y-12">
           {/* Notifications Panel */}
           <section>
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-4">Live Alerts stream</h3>
              {notifications.length === 0 ? <p className="text-slate-500 text-sm font-bold bg-slate-900/50 p-6 rounded-2xl border border-dashed border-slate-800">No active alerts detected.</p> : (
                 <div className="space-y-4">
                    {notifications.slice(0, 3).map(n => (
                       <div key={n.id} className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] flex items-center shadow-inner hover:border-slate-700 transition-colors">
                          <div className={`w-3 h-3 rounded-full mr-6 ${n.type === 'booking_success' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`}></div>
                          <div>
                             <p className="text-white font-black text-sm uppercase tracking-wide mb-1">{n.message}</p>
                             <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{n.createdAt?.toDate ? n.createdAt.toDate().toLocaleString() : 'Just now'}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              )}
           </section>

           {/* Bookings Table */}
           <section>
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-4 flex justify-between">
                 <span>Active Service Requests</span>
                 <RefreshCcwIcon className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
              </h3>
              
              {loading ? <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-slate-800 rounded w-3/4"></div></div></div> : 
               bookings.length === 0 ? <div className="text-slate-500 text-sm font-bold bg-slate-900/50 p-10 rounded-[2rem] border border-dashed border-slate-800 text-center">You have no active bookings. Explore the catalog to initialize one.</div> : (
                 <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="border-b border-slate-800 bg-slate-950/50">
                             <th className="p-6 text-[10px] uppercase font-black tracking-widest text-slate-500">Hostel Hash</th>
                             <th className="p-6 text-[10px] uppercase font-black tracking-widest text-slate-500">Value Due</th>
                             <th className="p-6 text-[10px] uppercase font-black tracking-widest text-slate-500">Current Status</th>
                             <th className="p-6 text-[10px] uppercase font-black tracking-widest text-slate-500">Timestamp</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-800">
                          {bookings.map(book => (
                             <tr key={book.id} className="hover:bg-slate-800/20 transition-colors">
                                <td className="p-6 text-white font-black uppercase text-xs tracking-wider line-clamp-1">{book.hostelId}</td>
                                <td className="p-6 text-slate-300 font-bold font-mono">₹{book.totalPrice}</td>
                                <td className="p-6">
                                   <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest ${book.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                      {book.status}
                                   </span>
                                </td>
                                <td className="p-6 text-slate-500 font-bold text-xs uppercase tracking-widest">
                                   {book.createdAt?.toDate ? book.createdAt.toDate().toLocaleDateString() : 'Pending'}
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              )}
           </section>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
