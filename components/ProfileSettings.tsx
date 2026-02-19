
import React, { useState, useRef } from 'react';
import { User, Mail, Image as ImageIcon, CheckCircle2, Save, Fingerprint, Upload, Camera } from 'lucide-react';
import { UserProfile } from '../types';
import { auth, db, doc, setDoc } from '../firebase';
import { updateProfile } from 'firebase/auth';

interface ProfileSettingsProps {
  user: UserProfile;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user }) => {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [photoURL, setPhotoURL] = useState(user.photoURL || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    setLoading(true);
    setSuccess(false);
    try {
      // 1. Update Firebase Auth Profile
      await updateProfile(auth.currentUser, {
        displayName: displayName,
        photoURL: photoURL
      });

      // 2. Persist to Firestore Users Collection for long-term consistency
      const profileRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(profileRef, {
        displayName: displayName,
        photoURL: photoURL,
        email: user.email,
        updatedAt: Date.now()
      }, { merge: true });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        // Reload to sync the app state with fresh Firestore data
        window.location.reload(); 
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Profile update failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { 
         alert("Image too large. Please select a photo smaller than 1MB.");
         return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-48">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Card: Avatar Preview */}
        <div className="w-full md:w-1/3 bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-zinc-800 text-center space-y-4">
          <div className="relative inline-block group">
            {photoURL ? (
              <img src={photoURL} alt="Profile" className="w-32 h-32 rounded-full border-4 border-indigo-500 p-1 shadow-2xl object-cover" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center border-4 border-indigo-500/20 shadow-2xl">
                <User className="w-16 h-16 text-indigo-600 dark:text-indigo-400" />
              </div>
            )}
            <button 
              onClick={triggerFileInput}
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="w-8 h-8 text-white" />
            </button>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-full shadow-lg border-2 border-white dark:border-zinc-900">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
          />
          <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{displayName || 'Anonymous User'}</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{user.email}</p>
          </div>
          <button 
            onClick={triggerFileInput}
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-100 transition-all shadow-sm"
          >
            <Upload className="w-4 h-4" />
            Gallery Photo
          </button>
        </div>

        {/* Right Card: Form */}
        <div className="flex-1 bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-zinc-800">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
            <Fingerprint className="w-8 h-8 text-indigo-600" />
            Edit Profile
          </h2>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-zinc-800 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Photo URL (Manual / Uploaded)</label>
              <div className="relative">
                <ImageIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://images.com/my-photo.jpg"
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-zinc-800 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold truncate"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Email (Read-only)</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 opacity-50" />
                <input
                  type="email"
                  disabled
                  value={user.email || ''}
                  className="w-full pl-12 pr-6 py-4 bg-gray-100 dark:bg-zinc-800/50 dark:text-zinc-400 border border-gray-100 dark:border-zinc-700 rounded-2xl cursor-not-allowed font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all uppercase tracking-widest shadow-xl active:scale-95 ${
                success 
                ? 'bg-emerald-500 text-white' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {loading ? (
                <div className="animate-spin w-6 h-6 border-4 border-white/20 border-t-white rounded-full"></div>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="w-6 h-6" />
                  Save Settings
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
