import React from 'react';
import { MapPin as MapPinIcon, Star as StarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HostelCard = ({ hostel }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/hostels/${hostel.id}`)}
      className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden cursor-pointer hover:border-indigo-500/50 hover:shadow-[0_0_40px_rgba(99,102,241,0.1)] hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="h-56 bg-slate-800 relative overflow-hidden">
        {hostel.images && hostel.images.length > 0 ? (
          <img src={hostel.images[0]} alt={hostel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-slate-800/50">
             <div className="w-12 h-12 rounded-xl bg-slate-700/50 mb-2"></div>
             <span className="text-xs font-bold uppercase tracking-widest">No Image Provided</span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center text-xs font-black uppercase tracking-widest text-emerald-400 shadow-lg">
           {hostel.availableRooms > 0 ? (
             <React.Fragment><span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span> {hostel.availableRooms} Left</React.Fragment>
           ) : (
             <React.Fragment><span className="w-2 h-2 bg-rose-500 text-rose-500 rounded-full mr-2"></span> Sold Out</React.Fragment>
           )}
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-wide leading-tight line-clamp-1">{hostel.name}</h3>
          <div className="flex items-center text-amber-400 text-sm font-bold bg-amber-400/10 px-2 py-1 rounded-lg">
             <StarIcon className="w-4 h-4 mr-1 fill-amber-400" />
             {hostel.averageRating ? hostel.averageRating.toFixed(1) : 'New'}
          </div>
        </div>
        <div className="flex items-center text-slate-400 text-sm mb-6 font-medium">
          <MapPinIcon className="w-4 h-4 mr-2 text-slate-500" />
          <span className="line-clamp-1">{hostel.location}</span>
        </div>
        <div className="flex justify-between items-end pt-5 border-t border-slate-800/80">
           <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Starts from</p>
              <p className="text-2xl font-black text-white">₹{hostel.pricePerMonth}<span className="text-sm font-medium text-slate-500">/mo</span></p>
           </div>
           <button className="px-5 py-2.5 bg-slate-800 text-white text-sm font-bold rounded-xl group-hover:bg-indigo-600 transition-all shadow-inner group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              View Info
           </button>
        </div>
      </div>
    </div>
  );
};

export default HostelCard;
