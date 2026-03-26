import React, { useState, useEffect } from 'react';
import { getHostels } from '../services/db';
import HostelCard from '../components/HostelCard';
import { Search as SearchIcon, SlidersHorizontal as SlidersHorizontalIcon, MapPin as MapPinIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Discover = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHostels, setFilteredHostels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const data = await getHostels();
        setHostels(data);
        setFilteredHostels(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHostels();
  }, []);

  useEffect(() => {
    if(!searchTerm) {
      setFilteredHostels(hostels);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const filtered = hostels.filter(h => h.name.toLowerCase().includes(lower) || h.location.toLowerCase().includes(lower));
    setFilteredHostels(filtered);
  }, [searchTerm, hostels]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
         <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
         <p className="text-slate-400 font-medium tracking-widest uppercase text-sm">Syncing Database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
      <header className="border-b border-slate-800 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-30">
         <div className="container mx-auto px-6 lg:px-12 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate('/student/dashboard')}>
               <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-indigo-500 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg">HS</div>
               <h1 className="text-3xl font-black text-white tracking-wide uppercase">Discover</h1>
            </div>
            
            <div className="flex flex-1 max-w-2xl space-x-3">
              <div className="relative flex-1 group">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search by name or location..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 bg-slate-900 border border-slate-800 rounded-2xl outline-none focus:border-indigo-500 focus:bg-slate-900 text-white font-medium placeholder:text-slate-500 transition-all shadow-inner"
                />
              </div>
              <button className="px-6 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-2xl flex items-center text-white font-bold transition-all disabled:opacity-50">
                 <SlidersHorizontalIcon className="w-5 h-5 lg:mr-2" /> 
                 <span className="hidden lg:inline">Filters</span>
              </button>
            </div>
         </div>
      </header>

      <main className="container mx-auto px-6 lg:px-12 py-12">
        <div className="flex justify-between items-end mb-10">
           <div>
              <h2 className="text-xl font-bold text-slate-300">Available Hostels</h2>
              <p className="text-sm text-slate-500 mt-1">Showing {filteredHostels.length} verified listings</p>
           </div>
        </div>

        {filteredHostels.length === 0 ? (
           <div className="text-center py-32 bg-slate-900/30 rounded-[3rem] border border-dashed border-slate-800">
             <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-800">
               <MapPinIcon className="w-10 h-10 text-slate-600" />
             </div>
             <h2 className="text-2xl font-bold text-white mb-3">No hostels found</h2>
             <p className="text-slate-500 max-w-md mx-auto">We couldn't find any hostels matching your search criteria. Try adjusting your filters or location keyword.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {filteredHostels.map(hostel => (
              <HostelCard key={hostel.id} hostel={hostel} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Discover;
