import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck as ShieldCheckIcon, Hand as HandRaisedIcon, DollarSign as CurrencyDollarIcon, MessageSquare as ChatBubbleBottomCenterTextIcon } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  const features = [
    { name: 'Immutable Locks', description: 'Firebase-backed transactional locking strictly prevents dual-booking globally bridging supply chains.', icon: ShieldCheckIcon, color: 'text-indigo-400' },
    { name: 'Instant Delivery', description: 'Monitor pending fees, active status, and overall room allocations from a centralized dashboard.', icon: CurrencyDollarIcon, color: 'text-teal-400' },
    { name: 'Live Triggers', description: 'Never miss an update. Firestore Snapshot listeners alert you instantly when logic succeeds.', icon: ChatBubbleBottomCenterTextIcon, color: 'text-rose-400' },
    { name: 'Layered Access', description: 'Distinct, tailored experiences for students and administrators enforcing strict Role-Based Access Controls.', icon: HandRaisedIcon, color: 'text-amber-400' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans overflow-hidden selection:bg-indigo-500/30">
      
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px]"></div>
         <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-[150px]"></div>
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      <nav className="relative z-10 container mx-auto px-10 py-8 flex justify-between items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.2)]">
             <span className="font-bold text-white text-xl">HS</span>
          </div>
          <span className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-white uppercase">
            HostelSync
          </span>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <button onClick={() => navigate('/login')} className="px-8 py-3.5 font-bold text-slate-200 rounded-xl bg-slate-900 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 transition-all shadow-lg text-xs uppercase tracking-widest shadow-indigo-500/10">
             System Auth
          </button>
        </motion.div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 pt-32 pb-40 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="max-w-5xl mx-auto">
          <div className="inline-flex items-center px-5 py-2.5 rounded-full border border-teal-500/30 text-teal-300 font-black text-[10px] uppercase tracking-widest mb-10 bg-teal-500/10 shadow-inner">
             <span className="w-2 h-2 rounded-full bg-teal-400 mr-3 animate-pulse"></span>
             Firebase Production Variant Live
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-none text-white drop-shadow-2xl">
            Smarter Logic. <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-teal-400 to-emerald-300">Serverless Subsystem.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-16 max-w-3xl mx-auto font-medium leading-relaxed tracking-wide">
            Find verified hostels near your vector coordinates in microseconds. Zero wait times. Immutable bookings handled dynamically.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/discover')} className="px-12 py-5 bg-indigo-600 rounded-2xl text-white font-black text-sm uppercase tracking-widest shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(99,102,241,0.6)] transition-all">
              Initialize Discovery
            </motion.button>
          </div>
        </motion.div>
      </main>

      <section className="relative z-10 container mx-auto px-6 py-24 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-3xl rounded-[4rem] mb-32 shadow-2xl">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black text-white mb-6 tracking-tight">Full System Overhaul</h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-medium text-lg leading-loose">Built natively on Firebase utilizing complex Firestore security rules guaranteeing execution.</p>
        </div>
        
        <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 max-w-7xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div key={idx} variants={itemVariants} className="p-12 rounded-[3rem] bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full"></div>
              <div className="w-20 h-20 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-slate-800 transition-all shadow-lg">
                <feature.icon className={`w-10 h-10 ${feature.color}`} />
              </div>
              <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-wide">{feature.name}</h3>
              <p className="text-slate-400 font-medium text-lg leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;
