export type TransactionType = 'income' | 'expense';
export type PaymentMethod = 'cash' | 'bank';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  date: string;
  description: string;
  type: TransactionType;
  category: string;
  paymentMethod: PaymentMethod;
  bankName?: string;
  bankAccountId?: string;
  createdAt: number;
}

export interface BankAccount {
  id: string;
  userId: string;
  bankId: string;
  bankName: string;
  accountNumberMasked: string;
  balance: number;
  status: 'active' | 'frozen';
  createdAt: number;
}

export interface BankMetadata {
  id: string;
  name: string;
  color: string;
  textColor: string;
  logo: string;
}

export const SUPPORTED_BANKS: BankMetadata[] = [
  { id: 'hdfc', name: 'HDFC Bank', color: 'bg-[#004c8f]', textColor: 'text-white', logo: 'https://companieslogo.com/img/orig/HDB-bb6257ef.png' },
  { id: 'sbi', name: 'State Bank of India', color: 'bg-[#29aae1]', textColor: 'text-white', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/State_Bank_of_India_logo.svg/1024px-State_Bank_of_India_logo.svg.png' },
  { id: 'icici', name: 'ICICI Bank', color: 'bg-[#f37021]', textColor: 'text-white', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/ICICI_Bank_Logo.svg/1024px-ICICI_Bank_Logo.svg.png' },
  { id: 'axis', name: 'Axis Bank', color: 'bg-[#97144d]', textColor: 'text-white', logo: 'https://companieslogo.com/img/orig/AXISBANK.BO-8f7da376.png' },
  { id: 'kotak', name: 'Kotak Mahindra', color: 'bg-[#ed1c24]', textColor: 'text-white', logo: 'https://companieslogo.com/img/orig/KOTAKBANK.NS-4d40b3c6.png' },
  { id: 'bob', name: 'Bank of Baroda', color: 'bg-[#fe5100]', textColor: 'text-white', logo: 'https://companieslogo.com/img/orig/BANKBARODA.NS-3f7f1e4e.png' },
  { id: 'pnb', name: 'Punjab National Bank', color: 'bg-[#a2192e]', textColor: 'text-white', logo: 'https://companieslogo.com/img/orig/PNB.NS-6a2c2084.png' },
  { id: 'canara', name: 'Canara Bank', color: 'bg-[#0091d3]', textColor: 'text-white', logo: 'https://companieslogo.com/img/orig/CANBK.NS-63426002.png' },
  { id: 'union', name: 'Union Bank', color: 'bg-[#e21e26]', textColor: 'text-white', logo: 'https://companieslogo.com/img/orig/UNIONBANK.NS-7e50c763.png' },
  { id: 'indusind', name: 'IndusInd Bank', color: 'bg-[#91282c]', textColor: 'text-white', logo: 'https://companieslogo.com/img/orig/INDUSINDBK.NS-0210e740.png' },
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Bonus',
  'Other Income',
  'Adjustment'
];

export const EXPENSE_CATEGORIES = [
  'Food',
  'Rent',
  'Bills',
  'Transport',
  'Shopping',
  'Healthcare',
  'Education',
  'Entertainment',
  'Travel',
  'Other Expense',
  'Adjustment'
];

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  }
