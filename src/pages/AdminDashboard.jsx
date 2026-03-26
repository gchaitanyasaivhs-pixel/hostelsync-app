import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase/config';
import { collection, query, getDocs, orderBy, updateDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { LogOut as LogOutIcon, Plus as PlusIcon, Inbox as InboxIcon, Database as DatabaseIcon } from 'lucide-react';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Hostel Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHostel, setNewHostel] = useState({ name: '', location: '', pricePerMonth: '', availableRooms: '', totalRooms: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Bookings
      const qBooks = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      const snapBooks = await getDocs(qBooks);
      setBookings(snapBooks.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      
      // Fetch Hostels
      const qHostels = query(collection(db, 'hostels'));
      const snapHostels = await getDocs(qHostels);
      setHostels(snapHostels.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
     try {
        await updateDoc(doc(db, 'bookings', bookingId), { status: newStatus });
        fetchData();
     } catch(e) { console.error(e); alert("Failed to update status."); }
  };

  const handleAddHostel = async (e) => {
     e.preventDefault();
     try {
       await addDoc(collection(db, 'hostels'), {
          ...newHostel,
          pricePerMonth: parseInt(newHostel.pricePerMonth),
          availableRooms: parseInt(newHostel.availableRooms),
          totalRooms: parseInt(newHostel.totalRooms),
          averageRating: 0,
          reviewCount: 0,
          amenities: ["Free WiFi", "Security", "Laundry"],
          createdAt: serverTimestamp()
       });
       setShowAddForm(false);
       setNewHostel({ name: '', location: '', pricePerMonth: '', availableRooms: '', totalRooms: '' });
       fetchData();
     } catch(e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
      <header className="border-b border-slate-800 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-30">
         <div className="container mx-auto px-8 py-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
               <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-rose-500 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg">HS</div>
               <h1 className="text-xl font-black text-white tracking-widest uppercase hidden md:block">Administrator Root</h1>
            </div>
            <button onClick={handleLogout} className="text-rose-400 hover:text-rose-500 font-bold transition-colors uppercase tracking-widest text-xs flex items-center bg-rose-500/10 px-4 py-2 rounded-xl">
              <LogOutIcon className="w-4 h-4 mr-2"/> Escalate Session
            </button>
         </div>
      </header>

      <main className="container mx-auto px-8 py-12">
         {/* Manage Bookings Section */}
         <section className="mb-16">
            <h2 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center">
               <InboxIcon className="w-5 h-5 mr-3" /> Global Booking Ledger
            </h2>
            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="border-b border-slate-800 bg-slate-950/50">
                        <th className="p-6 text-[10px] uppercase font-black tracking-widest text-slate-500">Transaction ID</th>
                        <th className="p-6 text-[10px] uppercase font-black tracking-widest text-slate-500">Student Ref</th>
                        <th className="p-6 text-[10px] uppercase font-black tracking-widest text-slate-500">Status</th>
                        <th className="p-6 text-[10px] uppercase font-black tracking-widest text-slate-500 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                     {bookings.length === 0 ? <tr><td colSpan="4" className="p-8 text-center text-slate-500 font-bold text-sm">No transactions exist in registry.</td></tr> : bookings.map(book => (
                        <tr key={book.id} className="hover:bg-slate-800/30 transition-colors">
                           <td className="p-6 font-mono text-xs text-slate-400">{book.id}</td>
                           <td className="p-6 text-white font-black uppercase text-xs tracking-wider line-clamp-1">{book.userId}</td>
                           <td className="p-6">
                              <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${book.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-amber-400 border border-amber-500/20'}`}>
                                 {book.status}
                              </span>
                           </td>
                           <td className="p-6 text-right space-x-2 flex justify-end">
                              {book.status !== 'confirmed' && <button onClick={() => handleUpdateBookingStatus(book.id, 'confirmed')} className="px-4 py-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 font-bold rounded-lg text-xs uppercase tracking-widest transition-colors">Approve</button>}
                              {book.status !== 'failed' && <button onClick={() => handleUpdateBookingStatus(book.id, 'failed')} className="px-4 py-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 font-bold rounded-lg text-xs uppercase tracking-widest transition-colors">Reject</button>}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </section>

         {/* Manage Hostels Section */}
         <section>
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-sm font-black text-teal-400 uppercase tracking-widest flex items-center">
                  <DatabaseIcon className="w-5 h-5 mr-3" /> Database Assets (Hostels)
               </h2>
               <button onClick={()=>setShowAddForm(!showAddForm)} className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center transition-all">
                  <PlusIcon className="w-4 h-4 mr-2" /> Add Supply Node
               </button>
            </div>

            {showAddForm && (
               <form onSubmit={handleAddHostel} className="bg-slate-900 border border-slate-700 p-8 rounded-[2rem] shadow-2xl mb-8 transform origin-top transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                     <input type="text" placeholder="Designation (Name)" required value={newHostel.name} onChange={e=>setNewHostel({...newHostel, name: e.target.value})} className="bg-slate-950 border border-slate-800 text-white rounded-xl p-4 outline-none focus:border-indigo-500" />
                     <input type="text" placeholder="Geolocation (String)" required value={newHostel.location} onChange={e=>setNewHostel({...newHostel, location: e.target.value})} className="bg-slate-950 border border-slate-800 text-white rounded-xl p-4 outline-none focus:border-indigo-500" />
                     <input type="number" placeholder="Price per cycle (₹)" required value={newHostel.pricePerMonth} onChange={e=>setNewHostel({...newHostel, pricePerMonth: e.target.value})} className="bg-slate-950 border border-slate-800 text-white rounded-xl p-4 outline-none focus:border-indigo-500" />
                     <div className="flex space-x-4">
                       <input type="number" placeholder="Avail Rooms" required value={newHostel.availableRooms} onChange={e=>setNewHostel({...newHostel, availableRooms: e.target.value})} className="w-1/2 bg-slate-950 border border-slate-800 text-white rounded-xl p-4 outline-none focus:border-indigo-500" />
                       <input type="number" placeholder="Total Rooms" required value={newHostel.totalRooms} onChange={e=>setNewHostel({...newHostel, totalRooms: e.target.value})} className="w-1/2 bg-slate-950 border border-slate-800 text-white rounded-xl p-4 outline-none focus:border-indigo-500" />
                     </div>
                  </div>
                  <button type="submit" className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black py-4 rounded-xl uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(20,184,166,0.3)]">Inject Node into Production</button>
               </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {hostels.map(h => (
                  <div key={h.id} className="bg-slate-950 border border-slate-800 p-8 rounded-[2rem] shadow-inner hover:border-slate-700 transition-colors">
                     <h3 className="text-xl font-black text-white uppercase tracking-wide mb-2 line-clamp-1">{h.name}</h3>
                     <p className="text-sm font-bold text-slate-500 tracking-widest uppercase mb-6">{h.location}</p>
                     <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-400 border-t border-slate-800 pt-6">
                        <span>Price: <span className="text-emerald-400">₹{h.pricePerMonth}</span></span>
                        <span>Stock: <span className="text-indigo-400">{h.availableRooms}/{h.totalRooms}</span></span>
                     </div>
                  </div>
               ))}
            </div>
         </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
