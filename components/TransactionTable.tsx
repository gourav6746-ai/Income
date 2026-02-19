
import React, { useState } from 'react';
import { Search, Trash2, ArrowUpRight, ArrowDownRight, Landmark, Banknote } from 'lucide-react';
import { Transaction, BankAccount } from '../types';
import { db, doc, deleteDoc, updateDoc } from '../firebase';

interface TransactionTableProps {
  transactions: Transaction[];
  bankAccounts: BankAccount[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, bankAccounts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (t.bankName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDelete = async (transaction: Transaction) => {
    if (window.confirm('Delete this record? Bank balance will be reconciled.')) {
      try {
        if (transaction.paymentMethod === 'bank' && transaction.bankAccountId) {
          const targetBank = bankAccounts.find(b => b.id === transaction.bankAccountId);
          if (targetBank) {
            const bankRef = doc(db, 'bankAccounts', targetBank.id);
            const currentBal = Number(targetBank.balance) || 0;
            const amount = Number(transaction.amount) || 0;
            const newBalance = transaction.type === 'income' ? currentBal - amount : currentBal + amount;
            await updateDoc(bankRef, { balance: newBalance });
          }
        }
        await deleteDoc(doc(db, 'transactions', transaction.id));
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden mt-8">
      <div className="p-8 border-b border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Ledger History</h2>
          <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Comprehensive Transaction Record</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-6 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none w-full sm:w-64 dark:text-white transition-all"
            />
          </div>
          <div className="flex items-center space-x-1 bg-gray-50 dark:bg-zinc-800 p-1 rounded-2xl border border-gray-100 dark:border-zinc-700 shadow-inner">
            {(['all', 'income', 'expense'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${filterType === type ? 'bg-white dark:bg-zinc-700 shadow-sm text-indigo-600 dark:text-white' : 'text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-zinc-800/50 text-gray-400 dark:text-zinc-500 text-[9px] uppercase tracking-[0.2em] font-black">
            <tr>
              <th className="px-8 py-6">Description</th>
              <th className="px-8 py-6">Category</th>
              <th className="px-8 py-6">Method</th>
              <th className="px-8 py-6">Date</th>
              <th className="px-8 py-6 text-right">Amount</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center text-gray-300 dark:text-zinc-600 font-bold uppercase text-[10px] tracking-widest">
                  No records found
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2.5 rounded-xl shadow-sm ${t.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600'}`}>
                        {t.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{t.description}</span>
                        {t.bankName && <span className="text-[9px] text-indigo-500 font-black uppercase tracking-tight">{t.bankName}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2 text-gray-400 dark:text-zinc-500">
                      {t.paymentMethod === 'bank' ? <Landmark className="w-3.5 h-3.5" /> : <Banknote className="w-3.5 h-3.5" />}
                      <span className="text-[10px] font-bold uppercase tracking-tight">{t.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-[11px] font-bold text-gray-500 dark:text-zinc-400">
                    {formatDate(t.date)}
                  </td>
                  <td className={`px-8 py-6 text-right font-black ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => handleDelete(t)}
                      className="p-2.5 text-gray-300 dark:text-zinc-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
