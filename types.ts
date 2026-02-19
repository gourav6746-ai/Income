
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
  { id: 'hdfc', name: 'HDFC Bank', color: 'bg-[#004c8f]', textColor: 'text-white', logo: 'https://www.hdfcbank.com/content/api/contentstream-id/723fb80a-2dde-42a3-9793-7ae1be57c87f/6069941a-6f0f-4886-9a2c-9a4f66907481' },
  { id: 'sbi', name: 'State Bank of India', color: 'bg-[#29aae1]', textColor: 'text-white', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/State_Bank_of_India_logo.svg' },
  { id: 'icici', name: 'ICICI Bank', color: 'bg-[#f37021]', textColor: 'text-white', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg' },
  { id: 'axis', name: 'Axis Bank', color: 'bg-[#97144d]', textColor: 'text-white', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Axis_Bank_logo.svg' },
  { id: 'kotak', name: 'Kotak Mahindra', color: 'bg-[#ed1c24]', textColor: 'text-white', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Kotak_Mahindra_Bank_logo.svg' },
  { id: 'bob', name: 'Bank of Baroda', color: 'bg-[#fe5100]', textColor: 'text-white', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Bank_of_Baroda_logo.svg' },
  { id: 'pnb', name: 'Punjab National Bank', color: 'bg-[#a2192e]', textColor: 'text-white', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Punjab_National_Bank_logo.svg' },
  { id: 'canara', name: 'Canara Bank', color: 'bg-[#0091d3]', textColor: 'text-white', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Canara_Bank_Logo.svg' },
  { id: 'union', name: 'Union Bank', color: 'bg-[#e21e26]', textColor: 'text-white', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Union_Bank_of_India_Logo.svg' },
  { id: 'indusind', name: 'IndusInd Bank', color: 'bg-[#91282c]', textColor: 'text-white', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/IndusInd_Bank_logo.svg' },
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
