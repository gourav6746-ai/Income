
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { query, where, onSnapshot, collection } from 'firebase/firestore';
import { auth, db, transactionsCollection } from './firebase';
import { UserProfile, Transaction, BankAccount } from './types';
import Auth from './components/Auth';
import Layout from './components/Layout';
import SummaryCards from './components/SummaryCards';
import CategoryChart from './components/CategoryChart';
import TransactionForm from './components/TransactionForm';
import TransactionTable from './components/TransactionTable';
import BankDashboard from './components/BankDashboard';
import ProfileSettings from './components/ProfileSettings';
import AboutContact from './components/AboutContact';
import { Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // App State: View & Theme
  const [activeView, setActiveView] = useState<'dashboard' | 'profile' | 'about'>('dashboard');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('aapnaincom_theme');
    return saved === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('aapnaincom_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Listen for Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Real-time Firestore updates
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setBankAccounts([]);
      return;
    }

    const tQuery = query(transactionsCollection, where('userId', '==', user.uid));
    const unsubscribeT = onSnapshot(tQuery, (snapshot) => {
      const data: Transaction[] = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as Transaction));
      setTransactions(data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
    });

    const bQuery = query(collection(db, 'bankAccounts'), where('userId', '==', user.uid));
    const unsubscribeB = onSnapshot(bQuery, (snapshot) => {
      const data: BankAccount[] = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as BankAccount));
      setBankAccounts(data);
    }, (err) => {
      console.error("Firestore Bank error:", err);
      setError("Failed to sync bank data.");
    });

    return () => {
      unsubscribeT();
      unsubscribeB();
    };
  }, [user]);

  // Totals
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Aapnaincom Syncing...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Auth />;

  return (
    <Layout 
      user={user} 
      darkMode={darkMode} 
      setDarkMode={setDarkMode} 
      activeView={activeView} 
      setActiveView={setActiveView}
    >
      <div className="animate-in fade-in duration-700">
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl flex items-center space-x-3 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-xs font-bold uppercase tracking-wider">{error}</p>
          </div>
        )}

        {/* Dynamic View Rendering */}
        {activeView === 'dashboard' && (
          <div className="space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Main Hub</h1>
                <p className="text-gray-400 dark:text-zinc-500 font-medium text-lg italic">Tracking your wealth, one entry at a time.</p>
              </div>
              <TransactionForm userId={user.uid} />
            </div>

            <SummaryCards
              totalBalance={totalBalance}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
            />

            <BankDashboard user={user} bankAccounts={bankAccounts} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <CategoryChart transactions={transactions} />
              
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 min-h-[400px]">
                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-8 uppercase tracking-widest flex items-center justify-between">
                  <span>Growth Index</span>
                  <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full tracking-[0.2em]">ANALYTICS</span>
                </h2>
                <div className="space-y-8">
                  <div className="p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-900/30">
                    <p className="text-[10px] font-black text-indigo-900 dark:text-indigo-400 mb-4 uppercase tracking-widest">Savings Retention</p>
                    <div className="flex items-center space-x-6">
                      <div className="flex-1 bg-white dark:bg-zinc-800 h-4 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="bg-indigo-600 h-full transition-all duration-1000" 
                          style={{ width: `${Math.min(100, Math.max(0, (totalBalance / (totalIncome || 1)) * 100))}%` }}
                        />
                      </div>
                      <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                        {totalIncome > 0 ? Math.round((totalBalance / totalIncome) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-gray-50 dark:bg-zinc-800/50 rounded-3xl border border-gray-100 dark:border-zinc-700">
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Activities</p>
                      <p className="text-3xl font-black text-gray-900 dark:text-white">{transactions.length}</p>
                    </div>
                    <div className="p-6 bg-gray-50 dark:bg-zinc-800/50 rounded-3xl border border-gray-100 dark:border-zinc-700">
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Avg Spent</p>
                      <p className="text-3xl font-black text-gray-900 dark:text-white">
                        ₹{Math.round(totalExpense / (transactions.filter(t => t.type === 'expense').length || 1)).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className={`p-6 rounded-3xl border-2 font-black text-[10px] uppercase tracking-widest text-center transition-all ${totalBalance > 0 ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30 text-emerald-700' : 'bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/30 text-rose-700'}`}>
                    {totalBalance > 0 
                      ? "Healthy Surplus - Consider Reinvesting" 
                      : "Deficit Alert - Audit Monthly Burn"}
                  </div>
                </div>
              </div>
            </div>

            <TransactionTable transactions={transactions} bankAccounts={bankAccounts} />
          </div>
        )}

        {activeView === 'profile' && <ProfileSettings user={user} />}
        {activeView === 'about' && <AboutContact />}
      </div>
    </Layout>
  );
};

export default App;
