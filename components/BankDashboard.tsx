import React, { useState } from 'react';
import { Building2, Plus, QrCode, X, Landmark, Trash2, ArrowUpCircle, ArrowDownCircle, Info } from 'lucide-react';
import { BankAccount, UserProfile, SUPPORTED_BANKS } from '../types';
import { addDoc, db, deleteDoc, doc, updateDoc, banksCollection, collection } from '../firebase';

interface BankDashboardProps {
  user: UserProfile;
  bankAccounts: BankAccount[];
}

const BankDashboard: React.FC<BankDashboardProps> = ({ user, bankAccounts }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState(SUPPORTED_BANKS[0].id);
  const [accountNumber, setAccountNumber] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');
  const [activeBank, setActiveBank] = useState<BankAccount | null>(null);

  const handleAddBank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber) return;
    const bankMeta = SUPPORTED_BANKS.find(b => b.id === selectedBankId);
    if (!bankMeta) return;

    const startBalance = parseFloat(openingBalance) || 0;

    try {
      await addDoc(banksCollection, {
        userId: user.uid,
        bankId: bankMeta.id,
        bankName: bankMeta.name,
        accountNumberMasked: `**** **** **** ${accountNumber.slice(-4)}`,
        balance: startBalance,
        status: 'active',
        createdAt: Date.now()
      });
      setIsAdding(false);
      setAccountNumber('');
      setOpeningBalance('');
    } catch (err) {
      console.error("Add Bank error:", err);
      alert("Error linking bank. Check permissions.");
    }
  };

  const removeBank = async (id: string) => {
    const confirmation = window.confirm(
      'WARNING: Are you sure you want to remove this bank account card? \n\n' +
      'This action is permanent and cannot be undone.'
    );
    
    if (confirmation) {
      try {
        await deleteDoc(doc(db, 'bankAccounts', id));
      } catch (err) {
        console.error("Delete bank error:", err);
        alert("Delete failed.");
      }
    }
  };

  const adjustBalance = async (bank: BankAccount, type: 'deposit' | 'withdraw') => {
    const actionLabel = type === 'deposit' ? 'DEPOSIT (Jama)' : 'WITHDRAW (Nikalna)';
    const amountStr = window.prompt(`Enter amount to ${actionLabel}:`);
    
    if (amountStr === null || amountStr.trim() === "") return;
    
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const currentBal = Number(bank.balance) || 0;
    const newBalance = type === 'deposit' ? currentBal + amount : currentBal - amount;
    
    if (newBalance < 0) {
      alert("Insufficient funds in this bank account.");
      return;
    }

    try {
      const bankRef = doc(db, 'bankAccounts', bank.id);
      await updateDoc(bankRef, { balance: newBalance });

      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        amount: amount,
        description: `Manual Bank ${type === 'deposit' ? 'Deposit' : 'Withdrawal'}`,
        type: type === 'deposit' ? 'income' : 'expense',
        category: 'Adjustment',
        paymentMethod: 'bank',
        bankAccountId: bank.id,
        bankName: bank.bankName,
        date: new Date().toISOString().split('T')[0],
        createdAt: Date.now()
      });

    } catch (err) {
      console.error("Adjustment error:", err);
      alert("System sync failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3 uppercase tracking-tight">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          Bank Management
        </h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl active:scale-95"
        >
          <Plus className="w-4 h-4" /> Link Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {bankAccounts.length === 0 ? (
          <div className="col-span-full py-24 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-[3rem] flex flex-col items-center justify-center text-gray-400 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
            <Landmark className="w-20 h-20 mb-4 opacity-10" />
            <p className="font-black uppercase tracking-widest text-xs">No active bank links</p>
            <button onClick={() => setIsAdding(true)} className="mt-6 px-6 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-full font-bold text-[10px] uppercase transition-all">Link Now</button>
          </div>
        ) : (
          bankAccounts.map((bank) => {
            const meta = SUPPORTED_BANKS.find(b => b.id === bank.bankId) || SUPPORTED_BANKS[0];

            return (
              <div 
                key={bank.id}
                className={`group relative overflow-hidden rounded-[2.5rem] shadow-2xl transition-all p-8 flex flex-col justify-between h-72 ${meta.color} text-white hover:-translate-y-2`}
              >
                <div className="absolute -right-12 -top-12 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                  <Landmark className="w-64 h-64" />
                </div>
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-xl p-2 flex items-center justify-center shadow-lg">
                        <img 
                          src={meta.logo} 
                          alt={meta.name} 
                          className="w-full h-full object-contain"
                          onError={(e) => { e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png'; }}
                        />
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">{meta.name}</p>
                        <p className="text-xl font-mono font-bold tracking-widest">{bank.accountNumberMasked}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => removeBank(bank.id)}
                    className="p-3 bg-white/10 hover:bg-rose-600 rounded-2xl transition-all border border-white/20 backdrop-blur-md shadow-lg"
                    title="Delete Card"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative z-10 mt-auto">
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-80 mb-1">Total Balance</p>
                  <h3 className="text-4xl font-black tracking-tighter">₹{Number(bank.balance).toLocaleString('en-IN')}</h3>
                </div>
                
                <div className="flex gap-2 relative z-10 pt-6">
                  <button onClick={() => adjustBalance(bank, 'deposit')} className="flex-1 py-3.5 bg-white/20 hover:bg-white/40 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all border border-white/20 backdrop-blur-md">
                    <ArrowUpCircle className="w-4 h-4" /> Deposit
                  </button>
                  <button onClick={() => adjustBalance(bank, 'withdraw')} className="flex-1 py-3.5 bg-white/20 hover:bg-white/40 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all border border-white/20 backdrop-blur-md">
                    <ArrowDownCircle className="w-4 h-4" /> Withdraw
                  </button>
                  <button onClick={() => { setActiveBank(bank); setIsReceiving(true); }} className="p-3.5 bg-white/20 hover:bg-white/40 rounded-2xl transition-all border border-white/20 backdrop-blur-md">
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-indigo-600 text-white">
              <div className="flex items-center gap-3">
                <Landmark className="w-6 h-6" />
                <h3 className="text-lg font-black uppercase tracking-tight">Link New Account</h3>
              </div>
              <button onClick={() => setIsAdding(false)} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-all"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAddBank} className="p-8 space-y-6">
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Partner Bank</label>
                <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-2 custom-scrollbar p-1">
                  {SUPPORTED_BANKS.map(bank => (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => setSelectedBankId(bank.id)}
                      className={`p-4 text-left rounded-2xl border-2 transition-all flex items-center gap-3 ${selectedBankId === bank.id ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 shadow-inner' : 'border-gray-50 dark:border-zinc-800 hover:border-gray-200 dark:hover:border-zinc-700'}`}
                    >
                      <div className="w-8 h-8 bg-white rounded p-1 shadow-sm flex-shrink-0">
                        <img src={bank.logo} alt="" className="w-full h-full object-contain" />
                      </div>
                      <span className={`text-[11px] font-black uppercase leading-tight ${selectedBankId === bank.id ? 'text-indigo-700 dark:text-indigo-400' : 'text-gray-500 dark:text-zinc-500'}`}>{bank.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Number (Last 4)</label>
                  <input type="text" maxLength={4} placeholder="8888" value={accountNumber} onChange={e => setAccountNumber(e.target.value.replace(/\D/g, ''))} className="w-full px-6 py-4 bg-gray-50 dark:bg-zinc-800 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-2xl outline-none font-mono text-2xl text-center" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Opening Balance (₹)</label>
                  <input type="number" placeholder="₹0.00" value={openingBalance} onChange={e => setOpeningBalance(e.target.value)} className="w-full px-6 py-5 bg-gray-50 dark:bg-zinc-800 dark:text-white border border-gray-100 dark:border-zinc-700 rounded-2xl outline-none font-black text-2xl text-center" />
                </div>
              </div>
              <button className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 uppercase tracking-[0.2em] active:scale-95">Confirm Link</button>
            </form>
          </div>
        </div>
      )}

      {isReceiving && activeBank && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] shadow-2xl w-full max-sm:p-8 p-12 text-center animate-in zoom-in duration-300">
             <div className="flex justify-between items-center mb-8">
                <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-[10px]">Merchant UPI QR</h3>
                <button onClick={() => setIsReceiving(false)} className="text-gray-400 hover:text-gray-900 bg-gray-50 p-2 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             <div className="p-10 bg-gray-50 rounded-[3rem] mb-10 border border-gray-100 flex items-center justify-center">
                <QrCode className="w-48 h-48 text-indigo-900" />
             </div>
             <p className="text-2xl font-black text-gray-900 dark:text-white">{activeBank.bankName}</p>
             <button onClick={() => setIsReceiving(false)} className="mt-12 w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] active:scale-95">Dismiss</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankDashboard;
      
