
import React from 'react';
import { LogOut, Wallet, User as UserIcon, Moon, Sun, LayoutDashboard, Settings, Info } from 'lucide-react';
import { UserProfile } from '../types';
import { logout } from '../firebase';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeView: 'dashboard' | 'profile' | 'about';
  setActiveView: (view: 'dashboard' | 'profile' | 'about') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, darkMode, setDarkMode, activeView, setActiveView }) => {
  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${darkMode ? 'bg-black' : 'bg-[#f8fafc]'}`}>
      <nav className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-10">
              <div 
                className="flex items-center space-x-2 cursor-pointer group"
                onClick={() => setActiveView('dashboard')}
              >
                <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none group-hover:scale-110 transition-transform">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Aapnaincom</span>
              </div>

              <div className="hidden md:flex items-center gap-1">
                <button 
                  onClick={() => setActiveView('dashboard')}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'dashboard' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setActiveView('profile')}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'profile' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  Profile
                </button>
                <button 
                  onClick={() => setActiveView('about')}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'about' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  About
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-gray-400 hover:text-indigo-600 transition-all border border-gray-100 dark:border-zinc-700 shadow-sm"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <div className="hidden sm:flex items-center space-x-3 bg-gray-50 dark:bg-zinc-800 px-4 py-2 rounded-2xl border border-gray-100 dark:border-zinc-700 shadow-sm cursor-pointer hover:border-indigo-200 transition-all" onClick={() => setActiveView('profile')}>
                <div className="text-right hidden lg:block">
                  <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none">{user.displayName || 'User'}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Free Tier</p>
                </div>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-gray-200 dark:border-zinc-600 object-cover shadow-sm" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                )}
              </div>
              
              <button
                onClick={logout}
                className="p-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      
      <footer className="bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2 grayscale opacity-50">
            <Wallet className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-black uppercase tracking-widest dark:text-white">Aapnaincom</span>
          </div>
          <div className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
            Handcrafted with Pride in Nepal
          </div>
          <div className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
            © {new Date().getFullYear()} Shiva Pandey
          </div>
        </div>
      </footer>

      {/* Mobile Navigation Dock */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-gray-100 dark:border-zinc-800 px-6 py-4 rounded-full shadow-2xl flex items-center gap-8 z-50">
        <button onClick={() => setActiveView('dashboard')} className={activeView === 'dashboard' ? 'text-indigo-600' : 'text-gray-400'}><LayoutDashboard className="w-6 h-6" /></button>
        <button onClick={() => setActiveView('profile')} className={activeView === 'profile' ? 'text-indigo-600' : 'text-gray-400'}><Settings className="w-6 h-6" /></button>
        <button onClick={() => setActiveView('about')} className={activeView === 'about' ? 'text-indigo-600' : 'text-gray-400'}><Info className="w-6 h-6" /></button>
      </div>
    </div>
  );
};

export default Layout;
