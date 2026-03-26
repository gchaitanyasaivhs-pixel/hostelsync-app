import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHostelById, getReviews, addReview } from '../services/db';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';
import { MapPin as MapPinIcon, Star as StarIcon, ShieldCheck as ShieldCheckIcon, User as UserIcon, ArrowLeft as ArrowLeftIcon } from 'lucide-react';

const HostelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, role } = useAuth();
  const [hostel, setHostel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const h = await getHostelById(id);
        if (h) setHostel(h);
        const r = await getReviews(id);
        setReviews(r);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if(!newReview.trim()) return;
    try {
      await addReview(id, currentUser.uid, currentUser.displayName || 'Student', parseInt(newRating), newReview);
      setNewReview('');
      
      setReviews([{ id: Date.now(), userName: currentUser.displayName || 'Student', rating: parseInt(newRating), comment: newReview, createdAt: new Date() }, ...reviews]);
    } catch(err) {
      console.error(err);
      alert("Failed to submit review.");
    }
  };

  if (loading) return (
     <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 tracking-widest uppercase text-xs font-bold">Querying Resource...</p>
     </div>
  );
  if (!hostel) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-3xl font-black uppercase tracking-widest">Resource Unavailable</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-24 font-sans">
      <div className="h-[45vh] bg-slate-900 relative border-b border-slate-800">
         <img src={hostel.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'} className="w-full h-full object-cover opacity-50 mix-blend-screen" alt={hostel.name} />
         <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
         
         <div className="absolute top-8 left-8 z-10">
            <button onClick={() => navigate('/discover')} className="flex items-center space-x-3 bg-slate-950/80 backdrop-blur-md px-5 py-3 rounded-2xl text-white font-black hover:bg-indigo-600 transition-colors border border-slate-800 hover:border-indigo-500 uppercase text-xs tracking-widest shadow-lg">
               <ArrowLeftIcon className="w-5 h-5" /> <span>Listing Catalog</span>
            </button>
         </div>

         <div className="absolute bottom-12 left-0 w-full container mx-auto px-6 lg:px-12">
            <h1 className="text-6xl lg:text-8xl font-black text-white uppercase tracking-tighter mb-6 drop-shadow-2xl leading-none">{hostel.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-black tracking-widest uppercase">
               <div className="flex items-center text-slate-300 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 shadow-xl">
                  <MapPinIcon className="w-4 h-4 mr-3 text-indigo-400" /> {hostel.location}
               </div>
               <div className="flex items-center text-amber-400 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 shadow-xl">
                  <StarIcon className="w-4 h-4 mr-3 fill-amber-400 text-amber-500" /> {hostel.averageRating?.toFixed(1) || '0.0'} <span className="text-slate-500 ml-2">({hostel.reviewCount || 0})</span>
               </div>
               <div className={`flex items-center backdrop-blur-md px-4 py-2.5 rounded-xl border shadow-xl ${hostel.availableRooms > 0 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20'}`}>
                  <ShieldCheckIcon className="w-4 h-4 mr-3" /> {hostel.availableRooms > 0 ? `${hostel.availableRooms} Assets Available` : 'Supply Exhausted'}
               </div>
            </div>
         </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 mt-16 grid grid-cols-1 xl:grid-cols-3 gap-12">
         <div className="xl:col-span-2 space-y-12">
            <section className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-inner relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full"></div>
               <h2 className="text-3xl font-black text-white uppercase tracking-wide mb-8">Metadata</h2>
               <p className="text-slate-400 leading-loose text-lg font-medium mb-12">
                  Welcome to {hostel.name}, strategically located in {hostel.location}. This verified node in the HostelSync network offers guaranteed secure access control and premium facilities vetted by our decentralized administrators.
               </p>
               
               <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">Verified Parameters</h3>
               <div className="flex flex-wrap gap-4">
                  {hostel.amenities?.map((amenity, idx) => (
                     <span key={idx} className="px-5 py-3 bg-slate-950 border border-slate-800 text-indigo-300 rounded-2xl text-xs font-black uppercase tracking-widest shadow-inner">{amenity}</span>
                  ))}
               </div>
            </section>

            <section className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-inner">
               <h2 className="text-3xl font-black text-white uppercase tracking-wide mb-10">Network Feedback</h2>
               
               {role === 'student' && (
                  <form onSubmit={handleAddReview} className="mb-12 bg-slate-950 p-8 rounded-[2rem] border border-slate-800 relative z-10 shadow-2xl">
                     <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-6">Transmit New Feedback</h4>
                     <div className="flex items-center space-x-6 mb-6">
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Score</span>
                        <select value={newRating} onChange={(e)=>setNewRating(e.target.value)} className="bg-slate-900 text-amber-400 font-black border border-slate-700 outline-none rounded-xl px-5 py-3 focus:border-indigo-500 transition-colors uppercase tracking-widest text-xs">
                           {[5,4,3,2,1].map(num => <option key={num} value={num}>Star Rating {num}</option>)}
                        </select>
                     </div>
                     <textarea 
                        value={newReview} onChange={(e)=>setNewReview(e.target.value)}
                        placeholder="Log your operational experience here..." 
                        className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 text-white outline-none focus:border-indigo-500 transition-colors mb-6 h-32 resize-none font-medium text-sm"
                     ></textarea>
                     <button type="submit" disabled={!newReview.trim()} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black px-8 py-4 rounded-xl uppercase text-xs tracking-widest transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95">Commit Log</button>
                  </form>
               )}

               <div className="space-y-6">
                  {reviews.length === 0 ? <div className="text-slate-500 text-center py-12 font-medium bg-slate-950 rounded-[2rem] border border-dashed border-slate-800">No data stored in registry.</div> : reviews.map((rev) => (
                     <div key={rev.id} className="bg-slate-950 p-8 rounded-[2rem] border border-slate-800 transition-colors hover:border-slate-700">
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-indigo-400"><UserIcon className="w-6 h-6"/></div>
                              <div>
                                 <p className="font-black text-white text-sm uppercase tracking-wide">{rev.userName}</p>
                                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{rev.createdAt?.toDate ? rev.createdAt.toDate().toLocaleString() : 'Just now'}</p>
                              </div>
                           </div>
                           <div className="flex text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-lg border border-amber-400/20">
                              {[...Array(rev.rating)].map((_, i) => <StarIcon key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />)}
                           </div>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed pl-16 font-medium">{rev.comment}</p>
                     </div>
                  ))}
               </div>
            </section>
         </div>

         <div className="xl:col-span-1">
            <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl sticky top-32">
               <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-800 pb-4">Standard Operational Rate</h3>
               <div className="flex items-baseline mb-8 mt-6">
                  <span className="text-6xl font-black text-white tracking-tighter">₹{hostel.pricePerMonth}</span>
                  <span className="text-slate-500 font-bold ml-2 tracking-widest uppercase text-xs">/ cycle</span>
               </div>
               
               <div className="space-y-4 mb-10">
                  <div className="flex items-center text-xs font-black uppercase tracking-widest text-slate-300 bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                     <ShieldCheckIcon className="w-5 h-5 text-indigo-400 mr-4" /> Cryptographic State Lock
                  </div>
                  <div className="flex items-center text-xs font-black uppercase tracking-widest text-slate-300 bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 shadow-inner">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full mr-4 animate-pulse"></div>
                     <span className="text-emerald-400">{hostel.availableRooms} Units Retained</span>
                  </div>
               </div>
               
               {role !== 'admin' && (
                  <button 
                     onClick={() => setIsBookingOpen(true)}
                     disabled={hostel.availableRooms <= 0}
                     className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 rounded-2xl uppercase tracking-widest transition-all hover:-translate-y-1 shadow-[0_10px_40px_rgba(99,102,241,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none text-sm"
                  >
                     Initiate Acquisition
                  </button>
               )}
            </div>
         </div>
      </div>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} hostel={hostel} />
    </div>
  );
};

export default HostelDetails;
