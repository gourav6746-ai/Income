
import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Banknote } from 'lucide-react';

interface SummaryCardsProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ totalBalance, totalIncome, totalExpense }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      {/* Balance Card */}
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-zinc-800 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />
        <div className="flex items-center justify-between mb-6">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
            <Banknote className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Balance</span>
        </div>
        <h3 className={`text-4xl font-black tracking-tighter ${totalBalance >= 0 ? 'text-gray-900 dark:text-white' : 'text-rose-600'}`}>
          {formatCurrency(totalBalance)}
        </h3>
      </div>

      {/* Income Card */}
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-zinc-800 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />
        <div className="flex items-center justify-between mb-6">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl">
            <ArrowUpCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Earnings</span>
        </div>
        <h3 className="text-4xl font-black tracking-tighter text-emerald-600 dark:text-emerald-400">
          {formatCurrency(totalIncome)}
        </h3>
      </div>

      {/* Expense Card */}
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-zinc-800 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />
        <div className="flex items-center justify-between mb-6">
          <div className="p-3 bg-rose-50 dark:bg-rose-900/30 rounded-2xl">
            <ArrowDownCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          </div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Spends</span>
        </div>
        <h3 className="text-4xl font-black tracking-tighter text-rose-600 dark:text-rose-400">
          {formatCurrency(totalExpense)}
        </h3>
      </div>
    </div>
  );
};

export default SummaryCards;
