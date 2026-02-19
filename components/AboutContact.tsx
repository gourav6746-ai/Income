
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Linkedin, Github, Globe, CheckCircle } from 'lucide-react';

const AboutContact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call to send email to gourav6746@gmail.com
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSent(false), 5000);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* About Section (3/5) */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-indigo-500/20 transition-all" />
            
            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6 relative z-10">About Developer</h2>
            <div className="space-y-4 text-gray-600 dark:text-zinc-400 font-medium leading-relaxed relative z-10">
              <p>Hi, I am <span className="text-indigo-600 dark:text-indigo-400 font-black">Shiva Pandey</span>, a passionate full-stack developer based in Nepal.</p>
              <p>Aapnaincom was built with a vision to simplify personal finance management for individuals across the subcontinent. My goal is to combine powerful financial logic with a premium, accessible UI/UX.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
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
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700">
                  <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-xl">
                    <Mail className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Personal Email</p>
                    <p className="text-sm font-bold dark:text-white">pandit6736@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Portfolio</p>
                    <p className="text-sm font-bold dark:text-white">shivapandey.com.np</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Section (2/5) */}
        <div className="lg:col-span-2">
          <div className="bg-indigo-600 p-10 rounded-[3rem] shadow-2xl text-white h-full flex flex-col justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            
            <div className="relative z-10">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Get in Touch</h2>
              <p className="text-indigo-100 text-sm font-medium mb-8">Send your queries directly to gourav6746@gmail.com</p>

              {isSent ? (
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center space-y-4 border border-white/20 animate-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/40">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-black uppercase">Message Sent!</h3>
                  <p className="text-sm text-indigo-100">Thank you for reaching out. We will get back to you shortly.</p>
                  <button onClick={() => setIsSent(false)} className="text-xs font-black uppercase underline tracking-widest pt-4">Send another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl outline-none focus:bg-white/20 transition-all placeholder:text-indigo-200 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl outline-none focus:bg-white/20 transition-all placeholder:text-indigo-200 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <textarea
                      required
                      rows={4}
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl outline-none focus:bg-white/20 transition-all placeholder:text-indigo-200 font-bold resize-none"
                    ></textarea>
                  </div>
                  <button
                    disabled={isSubmitting}
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
