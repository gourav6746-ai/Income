import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Linkedin, Github, Globe, CheckCircle, Edit2, Lock } from 'lucide-react';
// 1. Aapki image ka import (Iska naam dev.jpg rakhna aur src folder mein dalna)
import devPhoto from './dev.jpg'; 

const AboutContact: React.FC = () => {
  // Form states
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  // 2. Edit lock state - Default false (locked)
  const [canEdit, setCanEdit] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!canEdit) return; // Bina unlock kiye submit nahi hoga

    setIsSubmitting(true);
    // Simulate API call to send email to gourav6746@gmail.com
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setCanEdit(false); // Submit ke baad wapas lock
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSent(false), 5000);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* --- ABOUT SECTION (3/5) --- */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-indigo-500/20 transition-all" />
            
            <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
              {/* IMAGE DISPLAY */}
              <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-white dark:border-zinc-800 shadow-2xl shrink-0">
                <img 
                  src={devPhoto} 
                  alt="Shiva Pandey" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/160?text=dev.jpg+missing";
                  }}
                />
              </div>
              
              <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">About Developer</h2>
                <div className="space-y-4 text-gray-600 dark:text-zinc-400 font-medium leading-relaxed">
                  <p>Hi, I am <span className="text-indigo-600 dark:text-indigo-400 font-black">Shiva Pandey</span>, a passionate full-stack developer based in Nepal.</p>
                  <p>Aapnaincom was built with a vision to simplify personal finance management for individuals across the subcontinent.</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 relative z-10">
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Location</p>
                  <p className="text-sm font-bold dark:text-white">Kathmandu, Nepal</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                  <Phone className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Phone</p>
                  <p className="text-sm font-bold dark:text-white">+977 9706711866</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- CONTACT FORM SECTION (2/5) --- */}
        <div className="lg:col-span-2">
          <div className="bg-indigo-600 p-10 rounded-[3rem] shadow-2xl text-white h-full flex flex-col justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Get in Touch</h2>
                  <p className="text-indigo-100 text-sm font-medium">Send queries to gourav6746@gmail.com</p>
                </div>
                {/* 3. EDIT/LOCK TOGGLE BUTTON */}
                <button 
                  type="button"
                  onClick={() => setCanEdit(!canEdit)}
                  className={`p-3 rounded-2xl transition-all active:scale-90 ${canEdit ? 'bg-emerald-400 text-white shadow-lg shadow-emerald-500/40' : 'bg-white/10 text-indigo-200'}`}
                >
                  {canEdit ? <Edit2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </button>
              </div>

              {isSent ? (
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center space-y-4 border border-white/20 animate-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/40">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-black uppercase">Message Sent!</h3>
                  <button onClick={() => setIsSent(false)} className="text-xs font-black uppercase underline tracking-widest pt-4">Send another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <input
                      type="text"
                      required
                      readOnly={!canEdit}
                      placeholder={canEdit ? "Your Name" : "Form is Locked (Click Lock Icon)"}
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={`w-full px-6 py-4 border border-white/20 rounded-2xl outline-none transition-all placeholder:text-indigo-200 font-bold ${canEdit ? 'bg-white/20' : 'bg-white/5 cursor-not-allowed opacity-60'}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <input
                      type="email"
                      required
                      readOnly={!canEdit}
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full px-6 py-4 border border-white/20 rounded-2xl outline-none transition-all placeholder:text-indigo-200 font-bold ${canEdit ? 'bg-white/20' : 'bg-white/5 cursor-not-allowed opacity-60'}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <textarea
                      required
                      rows={4}
                      readOnly={!canEdit}
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className={`w-full px-6 py-4 border border-white/20 rounded-2xl outline-none transition-all placeholder:text-indigo-200 font-bold resize-none ${canEdit ? 'bg-white/20' : 'bg-white/5 cursor-not-allowed opacity-60'}`}
                    ></textarea>
                  </div>
                  <button
                    disabled={isSubmitting || !canEdit}
                    className="w-full py-5 bg-white text-indigo-600 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin w-4 h-4 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full"></div>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 flex justify-center gap-6 relative z-10">
              <a href="#" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all"><Linkedin className="w-4 h-4" /></a>
              <a href="#" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all"><Github className="w-4 h-4" /></a>
              <a href="#" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all"><MessageSquare className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutContact;
      
