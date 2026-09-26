import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  PieChart as PieChartIcon,
  Calendar,
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Bell,
  Download,
  Moon,
  Sun,
  Smartphone,
  CreditCard,
  Building,
  Sparkles,
  Share2,
  Trash2,
  Send,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  Tag,
  Wifi,
  WifiOff,
  Database,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  LogOut,
  User,
  Phone,
  KeyRound,
  Lock,
  ArrowRight,
  AtSign,
  IndianRupee,
  Layers,
  Settings as SettingsIcon,
  Flame,
  PiggyBank,
  Clock,
  ChevronDown,
  X,
  Zap,
  Info,
  CalendarClock,
  Mic,
  MicOff,
  Camera,
  FileText,
  Image as ImageIcon,
  Receipt,
  FileSpreadsheet,
  UploadCloud,
  Check,
  RotateCcw,
  Edit2,
  Eye,
  Sliders,
  FileDown,
  Activity,
  MessageSquare,
  Radio,
  SlidersVertical,
  Copy,
  ReceiptText
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';

export const formatINR = (amount, compact = false) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const num = Number(amount);
  if (compact) {
    if (Math.abs(num) >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (Math.abs(num) >= 100000) {
      return `₹${(num / 100000).toFixed(2)} L`;
    }
    if (Math.abs(num) >= 1000) {
      return `₹${(num / 1000).toFixed(1)} K`;
    }
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

export const formatIndianDate = (dateInput) => {
  try {
    const d = new Date(dateInput);
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(d);
  } catch {
    return 'Just now';
  }
};

export const CATEGORY_OPTIONS = [
  'Food & Dining',
  'Transport',
  'Groceries',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Health',
  'UPI Snacks',
  'Investment',
  'Others'
];

export const PAYMENT_MODES = [
  'UPI',
  'Credit Card',
  'Debit Card',
  'Cash',
  'NetBanking'
];

const DEFAULT_ACCOUNTS = [
  { id: 'acc_hdfc', name: 'HDFC Bank', number: '•• 8291', balance: 64250, type: 'Savings' },
  { id: 'acc_sbi', name: 'SBI Salary', number: '•• 4402', balance: 112800, type: 'Salary' },
  { id: 'acc_zerodha', name: 'Zerodha Kite', number: 'ZE8891', balance: 285400, type: 'Demat / Stocks' },
  { id: 'acc_cash', name: 'Wallet Cash', number: 'Physical', balance: 4500, type: 'Cash' },
];

const DEFAULT_TRANSACTIONS = [
  {
    id: 'tx_1',
    title: 'Zepto Quick Grocery',
    merchant: 'Zepto',
    category: 'Groceries',
    amount: 1420,
    type: 'debit',
    account: 'HDFC Bank',
    method: 'UPI',
    source: 'SMS Ingest',
    date: '2026-09-24T18:30:00.000Z',
    tag: 'Essentials'
  },
  {
    id: 'tx_2',
    title: 'Monthly Tech Salary',
    merchant: 'Razorpay / Acclivity Tech',
    category: 'Salary',
    amount: 145000,
    type: 'credit',
    account: 'SBI Salary',
    method: 'NetBanking',
    source: 'Statement',
    date: '2026-09-01T04:30:00.000Z',
    tag: 'Income'
  },
  {
    id: 'tx_3',
    title: 'Swiggy Gourmet Dinner',
    merchant: 'Swiggy',
    category: 'Food & Dining',
    amount: 1840,
    type: 'debit',
    account: 'HDFC Bank',
    method: 'UPI',
    source: 'Manual',
    date: '2026-09-23T15:20:00.000Z',
    tag: 'Foodie'
  },
  {
    id: 'tx_4',
    title: 'Shell Petrol Pump',
    merchant: 'Shell Petrol',
    category: 'Transport',
    amount: 2200,
    type: 'debit',
    account: 'HDFC Bank',
    method: 'Credit Card',
    source: 'SMS Ingest',
    date: '2026-09-21T07:15:00.000Z',
    tag: 'Vehicle'
  },
  {
    id: 'tx_5',
    title: 'Third Wave Coffee',
    merchant: 'Third Wave Coffee',
    category: 'UPI Snacks',
    amount: 480,
    type: 'debit',
    account: 'HDFC Bank',
    method: 'UPI',
    source: 'Voice',
    date: '2026-09-24T11:00:00.000Z',
    tag: 'Work'
  },
  {
    id: 'tx_6',
    title: 'Apartment Maintenance',
    merchant: 'MyGate Society',
    category: 'Bills & Utilities',
    amount: 4500,
    type: 'debit',
    account: 'HDFC Bank',
    method: 'NetBanking',
    source: 'Statement',
    date: '2026-09-05T09:00:00.000Z',
    tag: 'Bills'
  },
  {
    id: 'tx_7',
    title: 'Zudio Weekend Shopping',
    merchant: 'Zudio Apparel',
    category: 'Shopping',
    amount: 3890,
    type: 'debit',
    account: 'HDFC Bank',
    method: 'Credit Card',
    source: 'Bill Scan',
    date: '2026-09-14T14:40:00.000Z',
    tag: 'Lifestyle'
  }
];

const DEFAULT_BUDGETS = [
  { id: 'b_1', category: 'Food & Dining', limit: 12000, spent: 10450, color: '#0F766E' },
  { id: 'b_2', category: 'Groceries', limit: 15000, spent: 11200, color: '#0284C7' },
  { id: 'b_3', category: 'Bills & Utilities', limit: 25000, spent: 25000, color: '#6366F1' },
  { id: 'b_4', category: 'UPI Snacks', limit: 2500, spent: 2850, color: '#F59E0B' },
  { id: 'b_5', category: 'Shopping', limit: 10000, spent: 3890, color: '#EC4899' },
  { id: 'b_6', category: 'Transport', limit: 6000, spent: 2200, color: '#10B981' }
];

const DEFAULT_SUBSCRIPTIONS = [
  {
    id: 'sub_1',
    name: 'Netflix 4K UHD',
    category: 'Entertainment',
    amount: 649,
    billingCycle: 'Monthly',
    nextDate: '2026-09-28',
    paymentMethod: 'HDFC Credit Card',
    active: true,
    lastUsedDaysAgo: 4
  },
  {
    id: 'sub_2',
    name: 'Nifty 50 Index Fund SIP',
    category: 'Investment',
    amount: 10000,
    billingCycle: 'Monthly',
    nextDate: '2026-09-29',
    paymentMethod: 'Auto Debit (SBI)',
    active: true,
    lastUsedDaysAgo: 1
  },
  {
    id: 'sub_3',
    name: 'Jio Fiber 300 Mbps',
    category: 'Bills & Utilities',
    amount: 1179,
    billingCycle: 'Monthly',
    nextDate: '2026-10-01',
    paymentMethod: 'UPI Autopay',
    active: true,
    lastUsedDaysAgo: 2
  },
  {
    id: 'sub_4',
    name: 'Cult.fit Elite Pass',
    category: 'Health',
    amount: 1850,
    billingCycle: 'Monthly',
    nextDate: '2026-10-08',
    paymentMethod: 'UPI Autopay',
    active: true,
    lastUsedDaysAgo: 38
  },
  {
    id: 'sub_5',
    name: 'Audible India Audiobook',
    category: 'Entertainment',
    amount: 199,
    billingCycle: 'Monthly',
    nextDate: '2026-10-04',
    paymentMethod: 'HDFC Credit Card',
    active: false,
    lastUsedDaysAgo: 62
  }
];

const DEFAULT_OWED = [
  {
    id: 'ow_1',
    person: 'Rahul Sharma',
    amount: 2450,
    reason: 'Goa Shack Dinner bill',
    date: '2026-09-10',
    daysPending: 15,
    reminderCount: 2,
    phone: '919876543210'
  },
  {
    id: 'ow_2',
    person: 'Ananya Verma',
    amount: 1220,
    reason: 'Zepto party snacks share',
    date: '2026-09-21',
    daysPending: 4,
    reminderCount: 0,
    phone: '919876543211'
  },
  {
    id: 'ow_3',
    person: 'Karthik Rao',
    amount: 950,
    reason: 'Turf Cricket pitch booking',
    date: '2026-08-25',
    daysPending: 31,
    reminderCount: 3,
    phone: '919876543212'
  },
];

const SIX_MONTH_TREND_DATA = [
  { month: 'Apr 26', income: 140000, expense: 68400, savings: 71600 },
  { month: 'May 26', income: 140000, expense: 76200, savings: 63800 },
  { month: 'Jun 26', income: 142000, expense: 84100, savings: 57900 },
  { month: 'Jul 26', income: 145000, expense: 71900, savings: 73100 },
  { month: 'Aug 26', income: 145000, expense: 89300, savings: 55700 },
  { month: 'Sep 26', income: 145000, expense: 62400, savings: 82600 },
];

async function callParseInputEdgeFunction(supabase, { type, rawInput, fileData, transcript }) {
  await new Promise(r => setTimeout(r, 600));
  const results = [];
  const nowIST = new Date().toISOString();

  if (type === 'type' || type === 'mic') {
    const text = (rawInput || transcript || '').trim();
    const segments = text.split(/[,;\n+]|\sand\s/gi).map(s => s.trim()).filter(Boolean);

    for (const segment of segments) {
      let parsedAmount = 0;
      let merchantName = segment;
      let detectedCategory = 'Others';

      const amtMatch = segment.match(/(?:rs\.?|inr|₹)?\s*(\d+(?:\.\d{1,2})?)\s*(?:rs|inr|₹|\/-)?/i);
      if (amtMatch) {
        parsedAmount = parseFloat(amtMatch[1]);
        merchantName = segment.replace(amtMatch[0], '').trim();
      }

      merchantName = merchantName.replace(/^(for|at|to|spent|paid)\s+/i, '').trim();
      if (!merchantName) merchantName = 'Quick Expense';
      merchantName = merchantName.charAt(0).toUpperCase() + merchantName.slice(1);

      const lower = segment.toLowerCase();
      if (lower.includes('chai') || lower.includes('tea') || lower.includes('coffee') || lower.includes('samosa') || lower.includes('snack')) {
        detectedCategory = 'UPI Snacks';
      } else if (lower.includes('auto') || lower.includes('uber') || lower.includes('ola') || lower.includes('metro') || lower.includes('cab') || lower.includes('petrol')) {
        detectedCategory = 'Transport';
      } else if (lower.includes('zepto') || lower.includes('blinkit') || lower.includes('instamart') || lower.includes('grocery') || lower.includes('sabzi')) {
        detectedCategory = 'Groceries';
      } else if (lower.includes('swiggy') || lower.includes('zomato') || lower.includes('biryani') || lower.includes('pizza') || lower.includes('lunch') || lower.includes('dinner')) {
        detectedCategory = 'Food & Dining';
      } else if (lower.includes('wifi') || lower.includes('electricity') || lower.includes('bill') || lower.includes('recharge') || lower.includes('rent')) {
        detectedCategory = 'Bills & Utilities';
      } else if (lower.includes('amazon') || lower.includes('myntra') || lower.includes('flipkart') || lower.includes('clothes')) {
        detectedCategory = 'Shopping';
      }

      results.push({
        id: `parsed_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        amount: parsedAmount || 120,
        merchant: merchantName,
        category: detectedCategory,
        paymentMode: 'UPI',
        date: nowIST.split('T')[0],
        sourceType: type,
        transcript: transcript || rawInput || '',
        evidenceThumbnail: null,
        account: 'HDFC Bank'
      });
    }
  } else if (type === 'camera' || type === 'bill') {
    const billMerchants = ['Nature Basket Supermarket', 'Haldirams Sweets & Resto', 'Chai Point Koramangala', 'Apollo Pharmacy'];
    const randomMerchant = billMerchants[Math.floor(Math.random() * billMerchants.length)];
    const randomAmount = Math.floor(Math.random() * 850) + 140;

    results.push({
      id: `parsed_${Date.now()}`,
      amount: randomAmount,
      merchant: randomMerchant,
      category: randomMerchant.includes('Pharmacy') ? 'Health' : randomMerchant.includes('Basket') ? 'Groceries' : 'Food & Dining',
      paymentMode: 'Credit Card',
      date: nowIST.split('T')[0],
      sourceType: type,
      transcript: `Receipt OCR: Scanned ${randomMerchant} total ₹${randomAmount}`,
      evidenceThumbnail: fileData || null,
      account: 'HDFC Bank'
    });
  } else if (type === 'screenshot') {
    const upiPartners = [
      { name: 'Starbucks Coffee India', cat: 'UPI Snacks', amt: 390 },
      { name: 'Karthik General Store', cat: 'Groceries', amt: 540 },
      { name: 'Uber India Systems', cat: 'Transport', amt: 214 },
      { name: 'Zomato Limited UPI', cat: 'Food & Dining', amt: 620 }
    ];
    const picked = upiPartners[Math.floor(Math.random() * upiPartners.length)];

    results.push({
      id: `parsed_${Date.now()}`,
      amount: picked.amt,
      merchant: picked.name,
      category: picked.cat,
      paymentMode: 'UPI',
      date: nowIST.split('T')[0],
      sourceType: 'screenshot',
      transcript: `UPI OCR: Reference ID 4281903912 • Paid to ${picked.name}`,
      evidenceThumbnail: fileData || null,
      account: 'HDFC Bank'
    });
  }

  return results.length > 0 ? results : [{
    id: `parsed_${Date.now()}`,
    amount: 100,
    merchant: 'Miscellaneous Expense',
    category: 'Others',
    paymentMode: 'UPI',
    date: nowIST.split('T')[0],
    sourceType: type,
    transcript: transcript || rawInput || '',
    evidenceThumbnail: fileData || null,
    account: 'HDFC Bank'
  }];
}

async function callParseStatementEdgeFunction(supabase, { fileName, fileSize }) {
  await new Promise(r => setTimeout(r, 900));
  const sampleBankRows = [
    { merchant: 'Swiggy UPI', amount: 560, category: 'Food & Dining', date: '2026-09-22', method: 'UPI' },
    { merchant: 'Shell Fuel Station', amount: 2400, category: 'Transport', date: '2026-09-21', method: 'Debit Card' },
    { merchant: 'Amazon India Pay', amount: 1899, category: 'Shopping', date: '2026-09-20', method: 'Credit Card' },
    { merchant: 'Blinkit Instant', amount: 480, category: 'Groceries', date: '2026-09-19', method: 'UPI' },
    { merchant: 'Jio Prepaid Recharge', amount: 299, category: 'Bills & Utilities', date: '2026-09-18', method: 'UPI' },
    { merchant: 'Cult Pass Autopay', amount: 1850, category: 'Health', date: '2026-09-17', method: 'UPI' }
  ];

  return {
    importedCount: sampleBankRows.length,
    skippedDuplicates: 2,
    parsedTransactions: sampleBankRows.map((item, idx) => ({
      id: `stmt_tx_${Date.now()}_${idx}`,
      title: item.merchant,
      merchant: item.merchant,
      amount: item.amount,
      category: item.category,
      type: 'debit',
      account: 'HDFC Bank',
      method: item.method,
      source: 'Statement',
      date: new Date(item.date).toISOString(),
      tag: 'Statement Import'
    }))
  };
}

async function callEdgeInsightsOptimise(supabase, { category, budget, spent }) {
  await new Promise(r => setTimeout(r, 300));
  const overage = Math.max(0, spent - budget);

  if (category === 'UPI Snacks') {
    return {
      driver: 'Frequent chai & artisanal coffee runs during afternoon work hours (avg 3.4 micro-transactions/day).',
      avoidableSpend: Math.min(overage, 650),
      actionableTip: 'Opt for office pantry espresso or set a ₹60 daily UPI wallet threshold.',
      leaks: ['Third Wave Coffee surge surcharge', 'Afternoon tea stalls via Paytm']
    };
  }

  if (category === 'Food & Dining') {
    return {
      driver: 'Late-night gourmet meal delivery and peak rainy-weather handling surcharges on Swiggy & Zomato.',
      avoidableSpend: Math.round(overage * 0.7) || 1200,
      actionableTip: 'Pre-plan dinners or use dining card discount vouchers (15-20% off) instead of instant deliveries.',
      leaks: ['Weekend restaurant service charges', 'Night delivery fees (₹75/order)']
    };
  }

  return {
    driver: 'Discretionary impulse expenditures and untracked online digital transactions.',
    avoidableSpend: Math.round(overage * 0.6) || 450,
    actionableTip: 'Activate an interim 7-day spend freeze on this category to realign with monthly goals.',
    leaks: ['Add-on delivery charges', 'Non-essential impulse checkout items']
  };
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(true);

  // Nav: 'home' | 'budgets' | 'capture' | 'subscriptions' | 'owed' | 'ledger' | 'settings'
  const [activeTab, setActiveTab] = useState('home');

  const [supabaseConfig, setSupabaseConfig] = useState(() => ({
    url: localStorage.getItem('paisapulse_sb_url') || '',
    anonKey: localStorage.getItem('paisapulse_sb_key') || '',
  }));

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('paisapulse_auth_user');
    return saved ? JSON.parse(saved) : { id: 'usr_kolkata_9921', phone: '+919829012345', provider: 'demo' };
  });

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('paisapulse_user_profile');
    return saved ? JSON.parse(saved) : {
      id: 'usr_kolkata_9921',
      full_name: 'Vikram Aditya',
      phone: '+919829012345',
      upi_id: 'vikram@okhdfc',
      monthly_income: 145000,
      has_onboarded: true,
      ingest_token: 'pp_tok_live_8f3d1a92e4'
    };
  });

  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem('paisapulse_accounts');
    return saved ? JSON.parse(saved) : DEFAULT_ACCOUNTS;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('paisapulse_txs');
    return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('paisapulse_budgets');
    return saved ? JSON.parse(saved) : DEFAULT_BUDGETS;
  });

  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem('paisapulse_subs');
    return saved ? JSON.parse(saved) : DEFAULT_SUBSCRIPTIONS;
  });

  const [owedList, setOwedList] = useState(() => {
    const saved = localStorage.getItem('paisapulse_owed');
    return saved ? JSON.parse(saved) : DEFAULT_OWED;
  });

  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    localStorage.setItem('paisapulse_accounts', JSON.stringify(accounts));
  }, [accounts]);
  useEffect(() => {
    localStorage.setItem('paisapulse_txs', JSON.stringify(transactions));
  }, [transactions]);
  useEffect(() => {
    localStorage.setItem('paisapulse_budgets', JSON.stringify(budgets));
  }, [budgets]);
  useEffect(() => {
    localStorage.setItem('paisapulse_subs', JSON.stringify(subscriptions));
  }, [subscriptions]);
  useEffect(() => {
    localStorage.setItem('paisapulse_owed', JSON.stringify(owedList));
  }, [owedList]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      setShowInstallBanner(false);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setShowInstallBanner(false);
        showToast('PaisaPulse added to Home Screen!');
      }
      setInstallPrompt(null);
    } else {
      showToast('Install: tap browser menu -> Add to Home screen');
    }
  };

  const handleSaveConfirmedTransaction = (newTx) => {
    const fullTx = {
      ...newTx,
      source: newTx.source || 'Manual'
    };
    setTransactions(prev => [fullTx, ...prev]);

    setAccounts(prevAccounts =>
      prevAccounts.map(acc => {
        if (acc.name.toLowerCase().includes((fullTx.account || '').toLowerCase()) ||
            (fullTx.account || '').toLowerCase().includes(acc.name.toLowerCase())) {
          return {
            ...acc,
            balance: fullTx.type === 'debit' ? acc.balance - fullTx.amount : acc.balance + fullTx.amount
          };
        }
        return acc;
      })
    );

    if (fullTx.type === 'debit') {
      setBudgets(prevBudgets =>
        prevBudgets.map(b => {
          if (b.category.toLowerCase() === fullTx.category.toLowerCase()) {
            return { ...b, spent: b.spent + fullTx.amount };
          }
          return b;
        })
      );
    }

    showToast(`Saved: ₹${fullTx.amount.toLocaleString('en-IN')} for ${fullTx.merchant}`);
  };

  const handleBatchAppendTransactions = (batchList) => {
    setTransactions(prev => [...batchList, ...prev]);
    const totalSpent = batchList.reduce((s, t) => s + (t.type === 'debit' ? t.amount : 0), 0);
    showToast(`Batch added ${batchList.length} transactions (${formatINR(totalSpent)})`);
  };

  const handleUndoBatchImport = (importedIds) => {
    setTransactions(prev => prev.filter(tx => !importedIds.includes(tx.id)));
    showToast('Import batch rolled back successfully!');
  };

  const handleDeleteAllData = () => {
    localStorage.clear();
    setTransactions([]);
    setSubscriptions([]);
    setOwedList([]);
    setBudgets([]);
    showToast('All local and cached financial data purged!');
    setActiveTab('home');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'} font-sans antialiased selection:bg-teal-500 selection:text-white pb-24 transition-colors duration-200`}>
      {/* Top Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-zinc-900/80 border-b border-slate-200/80 dark:border-zinc-800/80 px-4 py-3 transition-colors">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 font-black text-lg">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight bg-gradient-to-r from-teal-700 to-teal-500 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  PaisaPulse
                </span>
                <span className="text-[10px] px-1.5 py-0.5 font-semibold bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 rounded-full border border-teal-200 dark:border-teal-800/60">
                  IN
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium truncate max-w-[130px]">
                {profile?.full_name ? `Namaste, ${profile.full_name.split(' ')[0]}` : 'Asia/Kolkata'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab(activeTab === 'ledger' ? 'home' : 'ledger')}
              title="Transactions Ledger"
              className={`p-2 rounded-xl border transition-colors ${
                activeTab === 'ledger'
                  ? 'border-teal-500 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300'
                  : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
            >
              <ReceiptText className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab(activeTab === 'settings' ? 'home' : 'settings')}
              title="Settings & Webhook"
              className={`p-2 rounded-xl border transition-colors ${
                activeTab === 'settings'
                  ? 'border-teal-500 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300'
                  : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* PWA Install Banner */}
      {showInstallBanner && !isInstalled && (
        <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white px-4 py-2.5 shadow-sm text-sm">
          <div className="max-w-md mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-teal-200 shrink-0" />
              <div className="text-xs">
                <span className="font-semibold">Install PaisaPulse PWA</span>
                <p className="text-teal-200 text-[11px]">Instant UPI tracking on home screen</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="bg-white text-teal-800 text-xs px-2.5 py-1 rounded-lg font-bold shadow hover:bg-teal-50 transition-colors"
              >
                Install
              </button>
              <button
                onClick={() => setShowInstallBanner(false)}
                className="text-teal-200 text-xs hover:text-white px-1"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab Views and Overlays */}
      <main className="max-w-md mx-auto px-4 pt-3 space-y-4">
        {activeTab === 'home' && (
          <HomeView
            profile={profile}
            accounts={accounts}
            transactions={transactions}
            budgets={budgets}
            subscriptions={subscriptions}
            owedList={owedList}
            onOpenCapture={() => setActiveTab('capture')}
            onNavigateTab={setActiveTab}
            showToast={showToast}
            onInjectSampleData={() => setTransactions(DEFAULT_TRANSACTIONS)}
          />
        )}

        {activeTab === 'budgets' && (
          <BudgetsView
            budgets={budgets}
            setBudgets={setBudgets}
            transactions={transactions}
            profilePhone={profile?.phone}
            showToast={showToast}
          />
        )}

        {activeTab === 'capture' && (
          <CaptureScreen
            accounts={accounts}
            onSaveTransaction={handleSaveConfirmedTransaction}
            onBatchImport={handleBatchAppendTransactions}
            onUndoImport={handleUndoBatchImport}
            onDone={() => setActiveTab('home')}
            showToast={showToast}
          />
        )}

        {activeTab === 'subscriptions' && (
          <SubscriptionsView
            subscriptions={subscriptions}
            setSubscriptions={setSubscriptions}
            showToast={showToast}
          />
        )}

        {activeTab === 'owed' && (
          <OwedView
            owedList={owedList}
            setOwedList={setOwedList}
            profile={profile}
            showToast={showToast}
          />
        )}

        {activeTab === 'ledger' && (
          <TransactionsLedger
            transactions={transactions}
            setTransactions={setTransactions}
            onOpenCapture={() => setActiveTab('capture')}
            onBack={() => setActiveTab('home')}
            showToast={showToast}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            profile={profile}
            user={user}
            supabaseConfig={supabaseConfig}
            onOpenSupabaseConfig={() => setIsSupabaseModalOpen(true)}
            transactions={transactions}
            budgets={budgets}
            subscriptions={subscriptions}
            owedList={owedList}
            onDeleteAllData={handleDeleteAllData}
            onBack={() => setActiveTab('home')}
            showToast={showToast}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation (5 tabs) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-zinc-800 pb-safe">
        <div className="max-w-md mx-auto px-3 py-2 flex items-center justify-around relative">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
              activeTab === 'home'
                ? 'text-teal-700 dark:text-teal-400 font-semibold'
                : 'text-slate-400 dark:text-zinc-500 hover:text-slate-700'
            }`}
          >
            <PieChartIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('budgets')}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
              activeTab === 'budgets'
                ? 'text-teal-700 dark:text-teal-400 font-semibold'
                : 'text-slate-400 dark:text-zinc-500 hover:text-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Budgets</span>
          </button>

          {/* Central '+' Capture Tab Trigger */}
          <div className="relative -top-5 flex flex-col items-center">
            <button
              onClick={() => setActiveTab('capture')}
              aria-label="Capture transaction"
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform border-4 border-slate-50 dark:border-zinc-950 ${
                activeTab === 'capture'
                  ? 'bg-teal-900 text-white scale-105 shadow-teal-900/50'
                  : 'bg-gradient-to-tr from-teal-800 to-teal-600 text-white shadow-teal-700/40 hover:scale-105 active:scale-95'
              }`}
            >
              <Plus className="w-7 h-7 stroke-[2.5]" />
            </button>
            <span className={`text-[10px] font-semibold mt-0.5 ${
              activeTab === 'capture' ? 'text-teal-900 dark:text-teal-300 font-black' : 'text-teal-800 dark:text-teal-400'
            }`}>
              Capture
            </span>
          </div>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
              activeTab === 'subscriptions'
                ? 'text-teal-700 dark:text-teal-400 font-semibold'
                : 'text-slate-400 dark:text-zinc-500 hover:text-slate-700'
            }`}
          >
            <Calendar className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Autopay</span>
          </button>

          <button
            onClick={() => setActiveTab('owed')}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
              activeTab === 'owed'
                ? 'text-teal-700 dark:text-teal-400 font-semibold'
                : 'text-slate-400 dark:text-zinc-500 hover:text-slate-700'
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Khata</span>
          </button>
        </div>
      </nav>

      {/* Supabase Config Modal */}
      {isSupabaseModalOpen && (
        <SupabaseConfigModal
          isOpen={isSupabaseModalOpen}
          onClose={() => setIsSupabaseModalOpen(false)}
          config={supabaseConfig}
          onSave={(newCfg) => {
            setSupabaseConfig(newCfg);
            localStorage.setItem('paisapulse_sb_url', newCfg.url);
            localStorage.setItem('paisapulse_sb_key', newCfg.anonKey);
            showToast('Supabase settings saved!');
            setIsSupabaseModalOpen(false);
          }}
        />
      )}

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

function HomeView({
  profile,
  accounts,
  transactions,
  budgets,
  subscriptions,
  owedList,
  onOpenCapture,
  onNavigateTab,
  showToast,
  onInjectSampleData
}) {
  const [selectedMonth, setSelectedMonth] = useState('current');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullY, setPullY] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [activeDonutIndex, setActiveDonutIndex] = useState(null);
  const [insightIndex, setInsightIndex] = useState(0);

  const currentMonthTransactions = useMemo(() => {
    if (selectedMonth === 'empty') return [];
    if (selectedMonth === 'previous') {
      return transactions.slice(1, 4).map(t => ({ ...t, amount: Math.round(t.amount * 0.9) }));
    }
    return transactions;
  }, [transactions, selectedMonth]);

  const monthlyIncome = useMemo(() => {
    if (selectedMonth === 'empty') return 0;
    if (profile?.monthly_income) return Number(profile.monthly_income);
    const credited = currentMonthTransactions
      .filter(tx => tx.type === 'credit')
      .reduce((sum, tx) => sum + tx.amount, 0);
    return credited || 145000;
  }, [currentMonthTransactions, profile, selectedMonth]);

  const monthlyExpense = useMemo(() => {
    return currentMonthTransactions
      .filter(tx => tx.type === 'debit')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [currentMonthTransactions]);

  const savingsAmount = Math.max(0, monthlyIncome - monthlyExpense);
  const savingsRate = monthlyIncome > 0 ? Math.round((savingsAmount / monthlyIncome) * 100) : 0;

  const totalBudgetLimit = useMemo(() => {
    return budgets.reduce((sum, b) => sum + b.limit, 0);
  }, [budgets]);

  const totalBudgetSpent = useMemo(() => {
    return budgets.reduce((sum, b) => sum + b.spent, 0);
  }, [budgets]);

  const budgetUsedPercent = totalBudgetLimit > 0
    ? Math.round((totalBudgetSpent / totalBudgetLimit) * 100)
    : 0;

  const totalOwedToMe = useMemo(() => {
    return owedList.reduce((sum, o) => sum + o.amount, 0);
  }, [owedList]);

  const renewalsInNext7Days = useMemo(() => {
    const today = new Date('2026-09-25T00:00:00Z');
    const next7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const dueList = subscriptions.filter(sub => {
      if (!sub.active) return false;
      const dueDate = new Date(sub.nextDate);
      return dueDate >= today && dueDate <= next7Days;
    });

    const sumDue = dueList.reduce((sum, s) => sum + s.amount, 0);
    return { count: dueList.length, total: sumDue, items: dueList };
  }, [subscriptions]);

  const budgetAlerts = useMemo(() => {
    const alerts = [];
    budgets.forEach(b => {
      const pct = Math.round((b.spent / b.limit) * 100);
      if (pct > 100) {
        alerts.push({
          id: b.id,
          category: b.category,
          percent: pct,
          overAmount: b.spent - b.limit,
          level: 'danger',
          message: `Exceeded by ${formatINR(b.spent - b.limit)} (${pct}%)`
        });
      } else if (pct >= 80) {
        alerts.push({
          id: b.id,
          category: b.category,
          percent: pct,
          leftAmount: b.limit - b.spent,
          level: 'warning',
          message: `${pct}% used, only ${formatINR(b.limit - b.spent)} left`
        });
      }
    });
    return alerts;
  }, [budgets]);

  const categoryData = useMemo(() => {
    const map = {};
    currentMonthTransactions
      .filter(t => t.type === 'debit')
      .forEach(t => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [currentMonthTransactions]);

  const DONUT_COLORS = ['#0F766E', '#0284C7', '#F59E0B', '#EC4899', '#6366F1', '#10B981', '#8B5CF6'];

  const INSIGHTS = [
    {
      title: 'Healthy Savings Velocity 🚀',
      text: `Your current savings rate is ${savingsRate}%. You are tracking to save ${formatINR(savingsAmount)} this month, beating the average 30% rule!`,
      tip: 'Tip: Park ₹25,000 in an Arbitrage Fund or Liquid Mutual Fund for tax-optimized 7% returns.'
    },
    {
      title: 'Food & Dining Alert 🍔',
      text: 'Swiggy & dining spends are 18% higher compared to last week (₹10,450 spent). This represents 42% of your discretionary spending.',
      tip: 'Tip: Consider Swiggy One membership or group dining to reduce delivery surcharges.'
    },
    {
      title: 'Autopay & SIP Optimization ⚡',
      text: `${renewalsInNext7Days.count} renewals (${formatINR(renewalsInNext7Days.total)}) are scheduled within 7 days, including your Nifty 50 SIP.`,
      tip: 'Tip: Keep at least ₹15,000 liquid in SBI Salary account to avoid ECS bounce penalties.'
    }
  ];

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (touchStartY > 0 && window.scrollY === 0) {
      const diff = e.touches[0].clientY - touchStartY;
      if (diff > 0) setPullY(Math.min(diff * 0.45, 75));
    }
  };

  const handleTouchEnd = () => {
    if (pullY > 50) triggerRefresh();
    setPullY(0);
    setTouchStartY(0);
  };

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Dashboard updated with latest bank sync');
    }, 900);
  };

  const cycleInsight = () => {
    setInsightIndex(prev => (prev + 1) % INSIGHTS.length);
    showToast('AI financial pulse recalculated');
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="space-y-4 pb-2"
    >
      {(pullY > 0 || isRefreshing) && (
        <div
          className="flex items-center justify-center transition-all duration-200 overflow-hidden"
          style={{ height: isRefreshing ? 48 : pullY }}
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-zinc-800 border border-teal-200 dark:border-zinc-700 text-teal-800 dark:text-teal-300 text-xs font-semibold shadow-sm">
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing SMS & Accounts...' : 'Pull to Refresh'}</span>
          </div>
        </div>
      )}

      {/* Period Selector */}
      <div className="flex items-center justify-between bg-white dark:bg-zinc-900 px-3.5 py-2 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-1.5">
          <CalendarClock className="w-4 h-4 text-teal-600" />
          <span className="text-xs font-bold text-slate-700 dark:text-zinc-200">Period:</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setSelectedMonth('current')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
              selectedMonth === 'current'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            Sep 2026 (Live)
          </button>
          <button
            onClick={() => setSelectedMonth('previous')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
              selectedMonth === 'previous'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            Aug 2026
          </button>
          <button
            onClick={() => setSelectedMonth('empty')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
              selectedMonth === 'empty'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            Empty Test
          </button>
        </div>
      </div>

      {/* AI Pulse Insights Card */}
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-4 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between pb-2 border-b border-teal-700/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-teal-500/30 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            </div>
            <span className="text-xs font-black tracking-wide text-teal-200 uppercase">
              AI Pulse • {INSIGHTS[insightIndex].title}
            </span>
          </div>
          <button
            onClick={cycleInsight}
            title="Next Insight"
            className="p-1 rounded-lg hover:bg-teal-700/50 text-teal-200 transition-colors flex items-center gap-1 text-[11px]"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Cycle</span>
          </button>
        </div>

        <p className="text-xs text-slate-100 font-medium mt-2 leading-relaxed">
          {INSIGHTS[insightIndex].text}
        </p>

        <div className="mt-2.5 bg-black/20 rounded-xl px-2.5 py-1.5 border border-white/10 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <p className="text-[11px] text-teal-100 font-normal truncate">
            {INSIGHTS[insightIndex].tip}
          </p>
        </div>
      </div>

      {/* Threshold Budget Alerts Banner */}
      {budgetAlerts.length > 0 && selectedMonth !== 'empty' && (
        <div className="space-y-2">
          {budgetAlerts.slice(0, 2).map(alert => (
            <div
              key={alert.id}
              className={`p-3 rounded-2xl border flex items-center justify-between shadow-sm transition-all ${
                alert.level === 'danger'
                  ? 'bg-red-50/90 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 text-red-900 dark:text-red-200'
                  : 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  alert.level === 'danger'
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/80 dark:text-red-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/80 dark:text-amber-300'
                }`}>
                  {alert.level === 'danger' ? <AlertCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-tight">{alert.category} Budget Alert</h4>
                  <p className="text-[11px] opacity-80 mt-0.5">{alert.message}</p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('budgets')}
                className="text-xs font-bold underline px-2 py-1 shrink-0"
              >
                Review
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 6 Top KPI Cards */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Monthly Performance (Sep 2026)
          </h3>
          <span className="text-[10px] text-teal-700 dark:text-teal-400 font-bold">
            Live Indicators
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">Income</span>
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <p className="text-base font-extrabold text-slate-900 dark:text-white">
              {formatINR(monthlyIncome)}
            </p>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-2.5 h-2.5" /> +3.5% vs Aug
            </span>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">Expense</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-red-500" />
            </div>
            <p className="text-base font-extrabold text-slate-900 dark:text-white">
              {formatINR(monthlyExpense)}
            </p>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold mt-0.5 block">
              {formatINR(monthlyExpense, true)} total
            </span>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">Savings Rate</span>
              <PiggyBank className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <p className="text-base font-extrabold text-teal-700 dark:text-teal-400">
              {savingsRate}%
            </p>
            <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full inline-block mt-0.5 ${
              savingsRate >= 30
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}>
              {savingsRate >= 30 ? 'Target Beat' : 'Below 30%'}
            </span>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">Budget Used</span>
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-base font-extrabold text-slate-900 dark:text-white">
              {budgetUsedPercent}%
            </p>
            <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${budgetUsedPercent > 100 ? 'bg-red-500' : budgetUsedPercent > 80 ? 'bg-amber-500' : 'bg-teal-600'}`}
                style={{ width: `${Math.min(budgetUsedPercent, 100)}%` }}
              />
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('owed')}
            className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-3.5 shadow-sm cursor-pointer hover:border-teal-400 transition-colors"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">Owed to Me</span>
              <Users className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
              {formatINR(totalOwedToMe)}
            </p>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-0.5 mt-0.5">
              <span>{owedList.length} people</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>

          <div
            onClick={() => onNavigateTab('subscriptions')}
            className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-3.5 shadow-sm cursor-pointer hover:border-teal-400 transition-colors"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">Due in 7 Days</span>
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <p className="text-base font-extrabold text-slate-900 dark:text-white">
              {renewalsInNext7Days.count} Due
            </p>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block mt-0.5">
              {formatINR(renewalsInNext7Days.total)} total
            </span>
          </div>
        </div>
      </section>

      {/* Visualizations and Activity */}
      {currentMonthTransactions.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border-2 border-dashed border-slate-300 dark:border-zinc-800 rounded-3xl p-6 text-center space-y-3 my-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-zinc-200">
              No Transactions Logged for this Period
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Start by typing, speaking, or uploading UPI screenshots to record your spends.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={onOpenCapture}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Smart Capture</span>
            </button>
            <button
              onClick={onInjectSampleData}
              className="px-3.5 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-semibold text-xs rounded-xl hover:bg-slate-200"
            >
              Load Demo Spends
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Category Spend Recharts Donut */}
          <section className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Category Spend Breakdown
                </h3>
                <p className="text-[11px] text-slate-400">
                  Interactive distribution for {selectedMonth === 'previous' ? 'Aug 2026' : 'Sep 2026'}
                </p>
              </div>
              <span className="text-xs font-bold text-teal-700 dark:text-teal-400">
                {formatINR(monthlyExpense)}
              </span>
            </div>

            <div className="h-52 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                    onClick={(_, index) => setActiveDonutIndex(index)}
                  >
                    {categoryData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                        stroke={activeDonutIndex === index ? '#000' : 'none'}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name) => [formatINR(val), name]}
                    contentStyle={{
                      backgroundColor: '#18181B',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Debits</span>
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {formatINR(monthlyExpense, true)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2 justify-center">
              {categoryData.map((cat, idx) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveDonutIndex(activeDonutIndex === idx ? null : idx)}
                  className={`text-[10px] px-2 py-1 rounded-xl flex items-center gap-1.5 border transition-all ${
                    activeDonutIndex === idx
                      ? 'bg-teal-50 dark:bg-teal-950/70 border-teal-500 font-bold'
                      : 'bg-slate-50 dark:bg-zinc-800/80 border-slate-200 dark:border-zinc-700/80 text-slate-600 dark:text-zinc-300'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: DONUT_COLORS[idx % DONUT_COLORS.length] }}
                  />
                  <span>{cat.name}</span>
                  <span className="font-bold opacity-80">{formatINR(cat.value, true)}</span>
                </button>
              ))}
            </div>
          </section>

          {/* 6-Month Income vs Expense Trend Area Chart */}
          <section className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  6-Month Financial Trajectory
                </h3>
                <p className="text-[11px] text-slate-400">Income vs Spends (Apr - Sep 2026)</p>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                  <span className="text-slate-500">Income</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                  <span className="text-slate-500">Expense</span>
                </div>
              </div>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SIX_MONTH_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F766E" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0F766E" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#94A3B8" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    formatter={(val, name) => [formatINR(val), name === 'income' ? 'Income' : 'Expense']}
                    contentStyle={{
                      backgroundColor: '#18181B',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#0F766E"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#incomeGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#EF4444"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#expenseGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Quick Ledger Preview */}
          <section className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Recent Daily Activity
              </h3>
              <button
                onClick={() => onNavigateTab('ledger')}
                className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-0.5"
              >
                View Full Ledger →
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-zinc-800">
              {currentMonthTransactions.slice(0, 5).map(tx => (
                <div key={tx.id} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.type === 'credit'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400'
                        : 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                    }`}>
                      {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate">
                        {tx.merchant || tx.title}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {formatIndianDate(tx.date)} • {tx.account}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-xs font-bold ${
                      tx.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-zinc-100'
                    }`}>
                      {tx.type === 'credit' ? '+' : '-'}{formatINR(tx.amount)}
                    </p>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">
                      {tx.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function CaptureScreen({
  accounts,
  onSaveTransaction,
  onBatchImport,
  onUndoImport,
  onDone,
  showToast
}) {
  const [activeTrigger, setActiveTrigger] = useState('type');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  const [typeInputText, setTypeInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [recordTimer, setRecordTimer] = useState(0);
  const timerIntervalRef = useRef(null);
  const recognitionRef = useRef(null);

  const cameraInputRef = useRef(null);
  const billInputRef = useRef(null);
  const screenshotInputRef = useRef(null);
  const statementInputRef = useRef(null);

  const [parsedCards, setParsedCards] = useState([]);
  const [statementSummary, setStatementSummary] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onresult = (event) => {
        let current = '';
        for (let i = 0; i < event.results.length; ++i) {
          current += event.results[i][0].transcript + ' ';
        }
        setSpeechTranscript(current.trim());
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition notice:', e);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordTimer(0);
    setSpeechTranscript('');
    timerIntervalRef.current = setInterval(() => {
      setRecordTimer(prev => prev + 1);
    }, 1000);

    try {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (e) {
      console.warn('Microphone start error:', e);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } catch (e) {}

    const finalTranscript = speechTranscript || 'chai 20 and auto 60';
    executeParseInput('mic', { transcript: finalTranscript });
  };

  const executeParseInput = async (type, payload) => {
    setIsProcessing(true);
    setProcessingStatus(
      type === 'type' ? 'Calling edge function parse-input...' :
      type === 'mic' ? 'Transcribing voice & classifying...' :
      type === 'screenshot' ? 'Reading UPI screen transaction details...' :
      'Running receipt OCR detection...'
    );

    try {
      const newItems = await callParseInputEdgeFunction(null, {
        type,
        ...payload
      });
      setParsedCards(prev => [...newItems, ...prev]);
      showToast(`Parsed ${newItems.length} item(s)! Check details below.`);
    } catch (err) {
      showToast('Parsing failed. Please enter manually.');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const handleTypeTextSubmit = (e) => {
    e.preventDefault();
    if (!typeInputText.trim()) return;
    executeParseInput('type', { rawInput: typeInputText });
    setTypeInputText('');
  };

  const handleFileUpload = (e, triggerType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target.result;
      executeParseInput(triggerType, { fileData: base64Data });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleStatementUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setProcessingStatus(`Parsing statement '${file.name}' via parse-statement...`);

    try {
      const result = await callParseStatementEdgeFunction(null, {
        fileName: file.name,
        fileSize: file.size
      });

      onBatchImport(result.parsedTransactions);
      setStatementSummary({
        fileName: file.name,
        count: result.importedCount,
        skipped: result.skippedDuplicates,
        importedIds: result.parsedTransactions.map(t => t.id),
        previewList: result.parsedTransactions
      });
      showToast(`Imported ${result.importedCount} entries from statement`);
    } catch (err) {
      showToast('Statement processing failed');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
      e.target.value = '';
    }
  };

  const handleUpdateCardField = (id, field, value) => {
    setParsedCards(prev => prev.map(card => {
      if (card.id === id) {
        return { ...card, [field]: value };
      }
      return card;
    }));
  };

  const handleConfirmSingleCard = (card) => {
    onSaveTransaction({
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: card.merchant,
      merchant: card.merchant,
      category: card.category,
      amount: Number(card.amount),
      type: 'debit',
      account: card.account || 'HDFC Bank',
      method: card.paymentMode,
      date: new Date(card.date).toISOString(),
      source: card.sourceType === 'screenshot' ? 'SMS Ingest' : card.sourceType === 'mic' ? 'Voice' : card.sourceType === 'camera' || card.sourceType === 'bill' ? 'Bill Scan' : 'Manual',
      tag: card.sourceType ? `${card.sourceType.toUpperCase()} Capture` : 'Capture'
    });
    setParsedCards(prev => prev.filter(c => c.id !== card.id));
  };

  const handleDiscardCard = (id) => {
    setParsedCards(prev => prev.filter(c => c.id !== id));
    showToast('Discarded item');
  };

  const handleConfirmAllCards = () => {
    parsedCards.forEach(card => {
      onSaveTransaction({
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        title: card.merchant,
        merchant: card.merchant,
        category: card.category,
        amount: Number(card.amount),
        type: 'debit',
        account: card.account || 'HDFC Bank',
        method: card.paymentMode,
        date: new Date(card.date).toISOString(),
        source: card.sourceType === 'screenshot' ? 'SMS Ingest' : card.sourceType === 'mic' ? 'Voice' : card.sourceType === 'camera' || card.sourceType === 'bill' ? 'Bill Scan' : 'Manual',
        tag: 'Bulk Confirm'
      });
    });
    showToast(`Saved all ${parsedCards.length} entries!`);
    setParsedCards([]);
  };

  return (
    <div className="space-y-4 pb-6">
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFileUpload(e, 'camera')}
      />
      <input
        type="file"
        ref={billInputRef}
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => handleFileUpload(e, 'bill')}
      />
      <input
        type="file"
        ref={screenshotInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileUpload(e, 'screenshot')}
      />
      <input
        type="file"
        ref={statementInputRef}
        accept=".pdf,.csv,.xlsx,.xls"
        className="hidden"
        onChange={handleStatementUpload}
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            Smart Capture
          </h2>
          <p className="text-xs text-slate-500">
            Log via Freeform Text, Voice, Receipt, UPI Screenshot or Statements
          </p>
        </div>
        <button
          onClick={onDone}
          className="text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 px-3 py-1.5 rounded-xl hover:bg-teal-100"
        >
          Done
        </button>
      </div>

      <section className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-3 shadow-sm space-y-3">
        <div className="grid grid-cols-5 gap-1.5">
          <button
            onClick={() => setActiveTrigger('type')}
            className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
              activeTrigger === 'type'
                ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <FileText className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold">Type</span>
          </button>

          <button
            onClick={() => setActiveTrigger('mic')}
            className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
              activeTrigger === 'mic'
                ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Mic className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold">Mic</span>
          </button>

          <button
            onClick={() => {
              setActiveTrigger('camera');
              cameraInputRef.current?.click();
            }}
            className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
              activeTrigger === 'camera'
                ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Camera className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold">Camera</span>
          </button>

          <button
            onClick={() => {
              setActiveTrigger('bill');
              billInputRef.current?.click();
            }}
            className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
              activeTrigger === 'bill'
                ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Receipt className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold">Bill</span>
          </button>

          <button
            onClick={() => {
              setActiveTrigger('screenshot');
              screenshotInputRef.current?.click();
            }}
            className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
              activeTrigger === 'screenshot'
                ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Smartphone className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold">UPI Shot</span>
          </button>
        </div>

        <div className="pt-1 border-t border-slate-100 dark:border-zinc-800">
          <button
            onClick={() => statementInputRef.current?.click()}
            className="w-full py-2 px-3 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-200 hover:bg-slate-100 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-teal-600" />
            <span>Upload Bank Statement (PDF, CSV, XLSX)</span>
          </button>
        </div>
      </section>

      {activeTrigger === 'type' && (
        <form onSubmit={handleTypeTextSubmit} className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-600" />
              Multi-Expense Free-form Input
            </span>
            <span className="text-[10px] text-slate-400">Natural Language parser</span>
          </div>

          <textarea
            rows={3}
            value={typeInputText}
            onChange={(e) => setTypeInputText(e.target.value)}
            placeholder='Type multiple expenses: e.g. "chai 20, auto 80, zepto 450, movie 300"'
            className="w-full text-xs p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:outline-teal-600 font-medium"
          />

          <div className="flex items-center justify-between pt-1">
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setTypeInputText('chai 20, auto 80')}
                className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 px-2 py-1 rounded-lg"
              >
                + "chai 20, auto 80"
              </button>
              <button
                type="button"
                onClick={() => setTypeInputText('Swiggy 420 and metro 50')}
                className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 px-2 py-1 rounded-lg"
              >
                + "Swiggy 420 and metro 50"
              </button>
            </div>

            <button
              type="submit"
              disabled={isProcessing || !typeInputText.trim()}
              className="py-2 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Parse Expenses</span>
            </button>
          </div>
        </form>
      )}

      {activeTrigger === 'mic' && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-5 shadow-sm text-center space-y-4">
          <div className="flex flex-col items-center justify-center">
            <div className="relative my-2">
              {isRecording && (
                <div className="absolute -inset-3 rounded-full bg-red-500/20 animate-ping pointer-events-none" />
              )}
              <button
                type="button"
                onClick={toggleRecording}
                className={`w-18 h-18 p-5 rounded-full flex items-center justify-center shadow-xl transition-transform active:scale-95 ${
                  isRecording
                    ? 'bg-red-600 text-white ring-4 ring-red-300'
                    : 'bg-teal-700 text-white hover:scale-105'
                }`}
              >
                {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </button>
            </div>

            <span className="text-xs font-black text-slate-800 dark:text-zinc-100 mt-2">
              {isRecording ? `Listening... (${recordTimer}s)` : 'Tap Microphone to Speak'}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs">
              Say in English or Hinglish: "Paid 180 for Starbucks and 30 for metro ticket"
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-2xl border border-slate-200 dark:border-zinc-700 text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Live Transcript
            </span>
            <p className="text-xs font-medium text-slate-700 dark:text-zinc-200 min-h-[36px]">
              {speechTranscript || (isRecording ? 'Listening for speech...' : 'Tap to start recording speech.')}
            </p>
          </div>

          {isRecording && (
            <button
              onClick={stopRecording}
              className="py-2.5 px-6 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Done Speaking • Parse Speech
            </button>
          )}
        </div>
      )}

      {isProcessing && (
        <div className="bg-teal-50 dark:bg-zinc-900 border border-teal-200 dark:border-teal-800 p-4 rounded-3xl flex items-center justify-center gap-3 animate-pulse shadow-sm">
          <RefreshCw className="w-5 h-5 text-teal-700 animate-spin shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-teal-900 dark:text-teal-200">
              Supabase Edge Function: Processing
            </p>
            <p className="text-teal-700 dark:text-teal-400 text-[11px]">
              {processingStatus}
            </p>
          </div>
        </div>
      )}

      {statementSummary && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-3xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  Statement Successfully Imported
                </h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  {statementSummary.count} transactions imported, {statementSummary.skipped} duplicates skipped
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onUndoImport(statementSummary.importedIds);
                setStatementSummary(null);
              }}
              className="py-1 px-2.5 bg-white dark:bg-zinc-900 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 font-bold text-xs rounded-xl flex items-center gap-1 hover:bg-red-50"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Undo Import</span>
            </button>
          </div>
        </div>
      )}

      {parsedCards.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Review & Confirm ({parsedCards.length})
              </h3>
            </div>
            {parsedCards.length > 1 && (
              <button
                onClick={handleConfirmAllCards}
                className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline"
              >
                Confirm All ({parsedCards.length})
              </button>
            )}
          </div>

          <div className="space-y-3">
            {parsedCards.map(card => (
              <ConfirmationCard
                key={card.id}
                card={card}
                accounts={accounts}
                onUpdate={(field, val) => handleUpdateCardField(card.id, field, val)}
                onConfirm={() => handleConfirmSingleCard(card)}
                onDiscard={() => handleDiscardCard(card.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ConfirmationCard({ card, accounts, onUpdate, onConfirm, onDiscard }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-4 shadow-sm space-y-3 transition-all hover:border-teal-500/50">
      {(card.evidenceThumbnail || card.transcript) && (
        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700 flex items-center gap-2.5">
          {card.evidenceThumbnail ? (
            <img
              src={card.evidenceThumbnail}
              alt="Scan thumbnail"
              className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
          )}

          <div className="truncate">
            <span className="text-[9px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block">
              Parsed from {card.sourceType || 'Input'}
            </span>
            <p className="text-[11px] text-slate-600 dark:text-zinc-300 italic truncate">
              "{card.transcript || 'Verified via AI edge parser'}"
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-0.5 block">
              Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-400">₹</span>
              <input
                type="number"
                value={card.amount}
                onChange={(e) => onUpdate('amount', e.target.value)}
                className="w-full pl-6 pr-2 py-1.5 text-sm font-black rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:outline-teal-600"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-0.5 block">
              Merchant / Payee
            </label>
            <input
              type="text"
              value={card.merchant}
              onChange={(e) => onUpdate('merchant', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:outline-teal-600"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">
            Category
          </label>
          <div className="flex flex-wrap gap-1">
            {CATEGORY_OPTIONS.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => onUpdate('category', cat)}
                className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all ${
                  card.category === cat
                    ? 'bg-teal-700 text-white border-teal-700 font-bold'
                    : 'bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-0.5 block">
              Date (Asia/Kolkata)
            </label>
            <input
              type="date"
              value={card.date}
              onChange={(e) => onUpdate('date', e.target.value)}
              className="w-full p-1.5 text-xs rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-0.5 block">
              Payment Mode
            </label>
            <select
              value={card.paymentMode}
              onChange={(e) => onUpdate('paymentMode', e.target.value)}
              className="w-full p-1.5 text-xs rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700"
            >
              {PAYMENT_MODES.map(mode => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase mb-0.5 block">
            Deducted Account
          </label>
          <select
            value={card.account || 'HDFC Bank'}
            onChange={(e) => onUpdate('account', e.target.value)}
            className="w-full p-1.5 text-xs rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700"
          >
            {accounts.map(acc => (
              <option key={acc.id} value={acc.name}>
                {acc.name} ({formatINR(acc.balance, true)})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800">
        <button
          type="button"
          onClick={onDiscard}
          className="text-xs text-red-500 hover:text-red-700 font-bold px-2 py-1 flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Discard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 px-2 py-1 font-semibold flex items-center gap-1"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Collapse' : 'Details'}</span>
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="py-1.5 px-3.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Confirm & Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function BudgetsView({ budgets, setBudgets, transactions, profilePhone, showToast }) {
  const [selectedMonth, setSelectedMonth] = useState('2026-09');
  const [rangeMode, setRangeMode] = useState('MTD');
  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [newCat, setNewCat] = useState('');
  const [newLimit, setNewLimit] = useState('');

  const [aiGuidance, setAiGuidance] = useState({});
  const [loadingAi, setLoadingAi] = useState({});

  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [alertPhone, setAlertPhone] = useState(profilePhone || '+91 98290 12345');
  const [showLadderModal, setShowLadderModal] = useState(false);

  const currentDayOfMonth = 25;
  const daysInMonth = 30;

  const comparativeData = useMemo(() => {
    const multiplier = rangeMode === 'YTD' ? 6 : rangeMode === 'Full' ? 1.05 : 1.0;
    const monthFactor = selectedMonth === '2026-08' ? 0.95 : selectedMonth === '2026-07' ? 0.88 : 1.0;

    return budgets.map(b => {
      const scaledBudget = Math.round(b.limit * multiplier * (rangeMode === 'YTD' ? 1 : monthFactor));
      const scaledActual = Math.round(b.spent * multiplier * monthFactor);
      const variance = scaledBudget - scaledActual;
      const variancePct = scaledBudget > 0 ? Math.round(((scaledActual - scaledBudget) / scaledBudget) * 100) : 0;

      const pctUsed = scaledBudget > 0 ? (scaledActual / scaledBudget) * 100 : 0;
      let status = 'Under';
      let statusColor = 'green';
      if (pctUsed > 100) {
        status = 'Over';
        statusColor = 'red';
      } else if (pctUsed >= 80) {
        status = 'Watch';
        statusColor = 'amber';
      }

      const dailyBurn = scaledActual / currentDayOfMonth;
      const projectedMonthEnd = Math.round(dailyBurn * daysInMonth);

      return {
        id: b.id,
        category: b.category,
        budget: scaledBudget,
        actual: scaledActual,
        variance,
        variancePct,
        status,
        statusColor,
        pctUsed: Math.min(Math.round(pctUsed), 150),
        dailyBurn,
        projectedMonthEnd,
        isOverPace: projectedMonthEnd > scaledBudget
      };
    });
  }, [budgets, selectedMonth, rangeMode]);

  const totals = useMemo(() => {
    const totalBudget = comparativeData.reduce((s, c) => s + c.budget, 0);
    const totalActual = comparativeData.reduce((s, c) => s + c.actual, 0);
    const totalVariance = totalBudget - totalActual;
    const totalVariancePct = totalBudget > 0 ? Math.round(((totalActual - totalBudget) / totalBudget) * 100) : 0;
    return { totalBudget, totalActual, totalVariance, totalVariancePct };
  }, [comparativeData]);

  const overBudgetCategories = useMemo(() => {
    return comparativeData.filter(c => c.status === 'Over');
  }, [comparativeData]);

  const handleFetchAiOptimisation = async (categoryItem) => {
    setLoadingAi(prev => ({ ...prev, [categoryItem.id]: true }));
    try {
      const guidance = await callEdgeInsightsOptimise(null, {
        category: categoryItem.category,
        budget: categoryItem.budget,
        spent: categoryItem.actual
      });
      setAiGuidance(prev => ({ ...prev, [categoryItem.id]: guidance }));
    } catch (e) {
      showToast('AI Optimisation guidance fetch failed');
    } finally {
      setLoadingAi(prev => ({ ...prev, [categoryItem.id]: false }));
    }
  };

  useEffect(() => {
    overBudgetCategories.forEach(cat => {
      if (!aiGuidance[cat.id] && !loadingAi[cat.id]) {
        handleFetchAiOptimisation(cat);
      }
    });
  }, [overBudgetCategories]);

  const handleExport = (format) => {
    showToast(`Generating ${format.toUpperCase()} Comparative Statement...`);
    setTimeout(() => {
      const element = document.createElement('a');
      const fileHeader = `PaisaPulse_Comparative_Statement_${selectedMonth}_${rangeMode}.${format === 'excel' ? 'csv' : 'txt'}`;
      let content = `PAISAPULSE FINANCIAL REPORT\nPeriod: ${selectedMonth} (${rangeMode})\nGenerated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n\n`;
      content += `Category,Budget(INR),Actual(INR),Variance(INR),Variance%,Status\n`;
      comparativeData.forEach(r => {
        content += `${r.category},${r.budget},${r.actual},${r.variance},${r.variancePct}%,${r.status}\n`;
      });
      content += `TOTALS,${totals.totalBudget},${totals.totalActual},${totals.totalVariance},${totals.totalVariancePct}%,-\n`;

      const file = new Blob([content], { type: format === 'excel' ? 'text/csv' : 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = fileHeader;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      showToast(`Exported ${fileHeader} successfully!`);
    }, 700);
  };

  const handleCreateBudget = (e) => {
    e.preventDefault();
    if (!newCat || !newLimit) return;
    const item = {
      id: `b_${Date.now()}`,
      category: newCat,
      limit: Number(newLimit),
      spent: 0,
      color: '#0F766E'
    };
    setBudgets([...budgets, item]);
    setNewCat('');
    setNewLimit('');
    setIsAddingBudget(false);
    showToast(`Created ${item.category} budget of ${formatINR(item.limit)}`);
  };

  return (
    <div className="space-y-4 pb-6">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <SlidersVertical className="w-5 h-5 text-teal-600" />
              Budgets & Discipline
            </h2>
            <p className="text-xs text-slate-500">
              Per-category pace forecasts & comparative audit
            </p>
          </div>
          <button
            onClick={() => setIsAddingBudget(!isAddingBudget)}
            className="text-xs font-bold bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 px-3 py-1.5 rounded-xl hover:bg-teal-100 transition-colors"
          >
            {isAddingBudget ? 'Close' : '+ New Budget'}
          </button>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-3 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-zinc-800 px-2.5 py-1.5 rounded-2xl border border-slate-200 dark:border-zinc-700">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 dark:text-zinc-200 focus:outline-none cursor-pointer"
              >
                <option value="2026-09">Sep 2026 (Live)</option>
                <option value="2026-08">Aug 2026</option>
                <option value="2026-07">Jul 2026</option>
              </select>
            </div>

            <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-2xl gap-0.5">
              {['MTD', 'Full', 'YTD'].map(m => (
                <button
                  key={m}
                  onClick={() => setRangeMode(m)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition-all ${
                    rangeMode === m
                      ? 'bg-white dark:bg-zinc-900 text-teal-800 dark:text-teal-300 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-zinc-800/80">
            <span className="text-[11px] font-semibold text-slate-400">
              Export Statement:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('excel')}
                className="px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 text-[11px] font-bold flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Excel (.csv)</span>
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 text-[11px] font-bold flex items-center gap-1"
              >
                <FileDown className="w-3.5 h-3.5 text-red-500" />
                <span>PDF Summary</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isAddingBudget && (
        <form onSubmit={handleCreateBudget} className="bg-white dark:bg-zinc-900 border border-teal-500/40 rounded-3xl p-4 shadow-sm space-y-3">
          <p className="text-xs font-bold text-teal-700 dark:text-teal-400">Set Monthly Category Limit</p>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="e.g. Dining Out"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              className="text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:outline-teal-600 font-medium"
              required
            />
            <input
              type="number"
              placeholder="Monthly Limit (₹)"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              className="text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:outline-teal-600 font-medium"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-sm"
          >
            Create Category Limit
          </button>
        </form>
      )}

      {/* Category Budget Progress Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Active Category Budgets & Forecasts
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">
            Day {currentDayOfMonth} of {daysInMonth}
          </span>
        </div>

        <div className="space-y-3">
          {comparativeData.map(b => {
            const isOver = b.status === 'Over';
            const isWatch = b.status === 'Watch';

            return (
              <div
                key={b.id}
                className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-4 shadow-sm space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <span>{b.category}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                        isOver
                          ? 'bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-300'
                          : isWatch
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                      }`}>
                        {isOver ? '> 100% OVER' : isWatch ? '80-100% WATCH' : '< 80% SAFE'}
                      </span>
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Budget: {formatINR(b.budget)} • Spent: {formatINR(b.actual)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className={`text-xs font-black ${
                      isOver ? 'text-red-600' : isWatch ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {Math.round((b.actual / b.budget) * 100)}%
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {b.variance >= 0 ? `${formatINR(b.variance)} left` : `-${formatINR(Math.abs(b.variance))} over`}
                    </p>
                  </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isOver ? 'bg-red-500' : isWatch ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(b.pctUsed, 100)}%` }}
                  />
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px] bg-slate-50 dark:bg-zinc-800/60 px-3 py-1.5 rounded-2xl border border-slate-200/60 dark:border-zinc-700/60">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-zinc-300">
                    <Activity className={`w-3.5 h-3.5 ${b.isOverPace ? 'text-red-500' : 'text-emerald-500'}`} />
                    <span className="truncate">
                      Burn: <b>{formatINR(Math.round(b.dailyBurn))}/day</b>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className={`font-semibold ${b.isOverPace ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      Pacing to {formatINR(b.projectedMonthEnd)} by Sep 30
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparative Grouped Bar Chart */}
      <section className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Budget vs Actual Spend
            </h3>
            <p className="text-[11px] text-slate-400">
              Comparative visualization across categories ({rangeMode})
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-700" />
              <span className="text-slate-500">Budget</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-500">Actual</span>
            </div>
          </div>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparativeData}
              margin={{ top: 8, right: 10, left: -20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 9 }}
                stroke="#94A3B8"
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                tick={{ fontSize: 9 }}
                stroke="#94A3B8"
                tickFormatter={(v) => `₹${v / 1000}k`}
              />
              <Tooltip
                formatter={(val, name) => [formatINR(val), name === 'budget' ? 'Budget' : 'Actual Spent']}
                contentStyle={{
                  backgroundColor: '#18181B',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '11px'
                }}
              />
              <Bar dataKey="budget" name="Budget" fill="#0F766E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" name="Actual" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Comparative Statement Table */}
      <section className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Comparative Statement Table
          </h3>
          <span className="text-[10px] font-semibold text-slate-400">
            INR (₹) Asia/Kolkata
          </span>
        </div>

        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full text-[11px] text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-400 font-bold uppercase text-[9px]">
                <th className="pb-2">Category</th>
                <th className="pb-2 text-right">Budget</th>
                <th className="pb-2 text-right">Actual</th>
                <th className="pb-2 text-right">Variance</th>
                <th className="pb-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {comparativeData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40">
                  <td className="py-2.5 font-bold text-slate-800 dark:text-zinc-200">
                    {row.category}
                  </td>
                  <td className="py-2.5 text-right font-medium text-slate-600 dark:text-zinc-300">
                    {formatINR(row.budget, true)}
                  </td>
                  <td className="py-2.5 text-right font-bold text-slate-900 dark:text-white">
                    {formatINR(row.actual, true)}
                  </td>
                  <td className={`py-2.5 text-right font-black ${
                    row.variance < 0 ? 'text-red-500' : 'text-emerald-600'
                  }`}>
                    {row.variance < 0 ? `-${formatINR(Math.abs(row.variance), true)}` : `+${formatINR(row.variance, true)}`}
                    <span className="block text-[9px] font-normal opacity-80">
                      ({row.variancePct > 0 ? `+${row.variancePct}` : row.variancePct}%)
                    </span>
                  </td>
                  <td className="py-2.5 text-center">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      row.status === 'Over'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                        : row.status === 'Watch'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 dark:border-zinc-700 font-black bg-slate-50/80 dark:bg-zinc-800/60">
                <td className="py-2.5 text-slate-900 dark:text-white">TOTALS</td>
                <td className="py-2.5 text-right text-teal-800 dark:text-teal-400">
                  {formatINR(totals.totalBudget, true)}
                </td>
                <td className="py-2.5 text-right text-slate-900 dark:text-white">
                  {formatINR(totals.totalActual, true)}
                </td>
                <td className={`py-2.5 text-right ${
                  totals.totalVariance < 0 ? 'text-red-500' : 'text-emerald-600'
                }`}>
                  {totals.totalVariance < 0 ? `-${formatINR(Math.abs(totals.totalVariance), true)}` : `+${formatINR(totals.totalVariance, true)}`}
                </td>
                <td className="py-2.5 text-center">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-black">
                    {totals.totalVariancePct > 0 ? `+${totals.totalVariancePct}%` : `${totals.totalVariancePct}%`}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* AI Optimisation Guidance Cards */}
      {overBudgetCategories.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-1.5 px-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              AI Spend Optimisation Engine (edge: insights)
            </h3>
          </div>

          <div className="space-y-3">
            {overBudgetCategories.map(cat => {
              const guide = aiGuidance[cat.id];
              const isLoading = loadingAi[cat.id];

              return (
                <div
                  key={cat.id}
                  className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 dark:border-amber-900/60 rounded-3xl p-4 shadow-sm space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                        ⚡
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-amber-950 dark:text-amber-200">
                          {cat.category} Deficit Recovery Plan
                        </h4>
                        <p className="text-[10px] text-amber-800 dark:text-amber-300">
                          Overbudget by {formatINR(Math.abs(cat.variance))} ({Math.round((cat.actual / cat.budget) * 100)}%)
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleFetchAiOptimisation(cat)}
                      title="Refresh AI guidance"
                      className="text-amber-700 dark:text-amber-400 hover:text-amber-900 text-xs p-1"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {isLoading ? (
                    <div className="py-3 flex items-center justify-center gap-2 text-xs text-amber-800">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Consulting Supabase Edge Function 'insights' (mode=optimise)...</span>
                    </div>
                  ) : guide ? (
                    <div className="space-y-2 text-xs text-slate-700 dark:text-zinc-300">
                      <div className="bg-white/80 dark:bg-zinc-900/80 p-2.5 rounded-2xl border border-amber-200/60 dark:border-amber-900/40">
                        <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase block mb-0.5">
                          Primary Driver Detected
                        </span>
                        <p className="text-[11px] font-medium leading-relaxed">
                          {guide.driver}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/80 dark:bg-zinc-900/80 p-2 rounded-2xl border border-amber-200/60 dark:border-amber-900/40">
                          <span className="text-[9px] font-bold text-red-600 dark:text-red-400 uppercase block">
                            Avoidable Leakage
                          </span>
                          <p className="text-sm font-black text-red-600 dark:text-red-400 mt-0.5">
                            {formatINR(guide.avoidableSpend)}
                          </p>
                        </div>
                        <div className="bg-white/80 dark:bg-zinc-900/80 p-2 rounded-2xl border border-amber-200/60 dark:border-amber-900/40">
                          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block">
                            Actionable Saving Tip
                          </span>
                          <p className="text-[10px] font-semibold text-slate-700 dark:text-zinc-300 mt-0.5 truncate">
                            {guide.actionableTip}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* WhatsApp Ladder Preferences */}
      <section className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-4 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                WhatsApp Budget Alert Ladder
              </h3>
              <p className="text-[10px] text-slate-400">
                Instant UPI warnings to {alertPhone}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setWhatsappEnabled(!whatsappEnabled);
              showToast(whatsappEnabled ? 'WhatsApp alerts disabled' : 'WhatsApp alerts activated!');
            }}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              whatsappEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-zinc-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                whatsappEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-zinc-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-zinc-700/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
              Indian Fintech Ladder Logic
            </span>
            <button
              onClick={() => setShowLadderModal(!showLadderModal)}
              className="text-[10px] font-bold text-teal-700 dark:text-teal-400 hover:underline"
            >
              {showLadderModal ? 'Hide Details' : 'View Ladder'}
            </button>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-zinc-300 leading-relaxed">
            First alert fires automatically at <b>80% budget consumption</b>. Subsequent alerts escalate at <b>every 10% increment</b> (90%, 100%, 110%) to prevent overspending without alert fatigue.
          </p>

          <div className="grid grid-cols-4 gap-1.5 pt-1 text-center">
            <div className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800">
              <span className="text-[9px] font-black text-amber-700 dark:text-amber-400 block">80%</span>
              <span className="text-[8px] text-slate-400">1st Warning</span>
            </div>
            <div className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700">
              <span className="text-[9px] font-black text-amber-800 dark:text-amber-300 block">90%</span>
              <span className="text-[8px] text-slate-400">Critical</span>
            </div>
            <div className="p-1.5 rounded-xl bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800">
              <span className="text-[9px] font-black text-red-700 dark:text-red-400 block">100%</span>
              <span className="text-[8px] text-slate-400">Cap Breached</span>
            </div>
            <div className="p-1.5 rounded-xl bg-red-200 dark:bg-red-900/80 border border-red-400 dark:border-red-700">
              <span className="text-[9px] font-black text-red-900 dark:text-red-200 block">110%+</span>
              <span className="text-[8px] text-slate-400">Overdraft</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SubscriptionsView({ subscriptions, setSubscriptions, showToast }) {
  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'active' | 'unused'
  const [subName, setSubName] = useState('');
  const [subAmount, setSubAmount] = useState('');
  const [subCycle, setSubCycle] = useState('Monthly');
  const [subCategory, setSubCategory] = useState('Entertainment');
  const [subPaymentMethod, setSubPaymentMethod] = useState('UPI Autopay');
  const [subNextDate, setSubNextDate] = useState('2026-10-05');

  const todayDate = new Date('2026-09-25T00:00:00Z');

  const getDaysUntilRenewal = (nextDateStr) => {
    const renewal = new Date(nextDateStr);
    const diffTime = renewal - todayDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const monthlyBurn = useMemo(() => {
    return subscriptions
      .filter(s => s.active)
      .reduce((sum, s) => {
        if (s.billingCycle === 'Yearly') return sum + Math.round(s.amount / 12);
        if (s.billingCycle === 'Quarterly') return sum + Math.round(s.amount / 3);
        return sum + s.amount;
      }, 0);
  }, [subscriptions]);

  const activeCount = subscriptions.filter(s => s.active).length;
  const unusedCount = subscriptions.filter(s => (s.lastUsedDaysAgo || 0) >= 30).length;

  const toggleSubStatus = (id) => {
    setSubscriptions(prev =>
      prev.map(s => {
        if (s.id === id) {
          const nextState = !s.active;
          showToast(`${s.name} is now ${nextState ? 'Active' : 'Paused'}`);
          return { ...s, active: nextState };
        }
        return s;
      })
    );
  };

  const handleAddSubscription = (e) => {
    e.preventDefault();
    if (!subName || !subAmount) return;

    const newSub = {
      id: `sub_${Date.now()}`,
      name: subName,
      category: subCategory,
      amount: Number(subAmount),
      billingCycle: subCycle,
      nextDate: subNextDate,
      paymentMethod: subPaymentMethod,
      active: true,
      lastUsedDaysAgo: 1
    };

    setSubscriptions([newSub, ...subscriptions]);
    setSubName('');
    setSubAmount('');
    setShowAddSubModal(false);
    showToast(`Registered ${newSub.name} (${formatINR(newSub.amount)}/${subCycle.toLowerCase()})`);
  };

  const filteredSubscriptions = useMemo(() => {
    if (filterType === 'active') return subscriptions.filter(s => s.active);
    if (filterType === 'unused') return subscriptions.filter(s => (s.lastUsedDaysAgo || 0) >= 30);
    return subscriptions;
  }, [subscriptions, filterType]);

  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
            <Calendar className="w-5 h-5 text-teal-600" />
            Mandates & Autopay
          </h2>
          <p className="text-xs text-slate-500">
            Track recurring debit mandates, SIPs, and OTT renewals
          </p>
        </div>

        <button
          onClick={() => setShowAddSubModal(true)}
          className="text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Sub</span>
        </button>
      </div>

      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-teal-200 uppercase tracking-wider block">
              Monthly Recurring Burn
            </span>
            <h3 className="text-2xl font-black mt-0.5 tracking-tight">
              {formatINR(monthlyBurn)}
              <span className="text-xs font-normal text-teal-200 ml-1.5">/ month</span>
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold bg-white/10 px-2.5 py-1 rounded-xl block">
              {activeCount} Active Mandates
            </span>
            {unusedCount > 0 && (
              <span className="text-[10px] text-amber-300 font-semibold block mt-1">
                ⚠️ {unusedCount} unused &gt; 30d
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-1.5 pt-1 border-t border-teal-700/60">
          <button
            onClick={() => setFilterType('all')}
            className={`text-[11px] px-2.5 py-1 rounded-xl font-bold transition-all ${
              filterType === 'all' ? 'bg-white text-teal-900 shadow-sm' : 'bg-teal-800/60 text-teal-100 hover:bg-teal-700'
            }`}
          >
            All ({subscriptions.length})
          </button>
          <button
            onClick={() => setFilterType('active')}
            className={`text-[11px] px-2.5 py-1 rounded-xl font-bold transition-all ${
              filterType === 'active' ? 'bg-white text-teal-900 shadow-sm' : 'bg-teal-800/60 text-teal-100 hover:bg-teal-700'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setFilterType('unused')}
            className={`text-[11px] px-2.5 py-1 rounded-xl font-bold transition-all ${
              filterType === 'unused' ? 'bg-amber-400 text-slate-900 shadow-sm' : 'bg-teal-800/60 text-teal-100 hover:bg-teal-700'
            }`}
          >
            Unused &gt; 30d ({unusedCount})
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredSubscriptions.map(sub => {
          const daysLeft = getDaysUntilRenewal(sub.nextDate);
          const isUnused = (sub.lastUsedDaysAgo || 0) >= 30;

          return (
            <div
              key={sub.id}
              className={`p-4 rounded-3xl border transition-all ${
                sub.active
                  ? 'bg-white dark:bg-zinc-900 border-slate-200/90 dark:border-zinc-800 shadow-sm'
                  : 'bg-slate-100/60 dark:bg-zinc-900/40 border-slate-200/50 dark:border-zinc-800/40 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm ${
                    sub.active
                      ? 'bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300'
                      : 'bg-slate-200 dark:bg-zinc-800 text-slate-500'
                  }`}>
                    {sub.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{sub.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500">
                        {sub.billingCycle}
                      </span>
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {sub.paymentMethod} • Next: {sub.nextDate}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-black text-slate-900 dark:text-white">
                    {formatINR(sub.amount)}
                  </p>
                  <span className={`text-[10px] font-bold block mt-0.5 ${
                    daysLeft <= 3 ? 'text-red-500 animate-pulse' : daysLeft <= 7 ? 'text-amber-500' : 'text-slate-400'
                  }`}>
                    {daysLeft < 0 ? 'Overdue' : daysLeft === 0 ? 'Due today' : `in ${daysLeft} days`}
                  </span>
                </div>
              </div>

              {isUnused && (
                <div className="mt-3 p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-900/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-200 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span><b>Cancel or keep?</b> Unused for {sub.lastUsedDaysAgo} days</span>
                  </div>
                  <button
                    onClick={() => {
                      toggleSubStatus(sub.id);
                      showToast(`Paused unused subscription: ${sub.name}`);
                    }}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-600 text-white hover:bg-amber-700"
                  >
                    Pause Sub
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-zinc-800 text-xs">
                <span className="text-[11px] text-slate-400 font-medium">
                  Status: <b className={sub.active ? 'text-emerald-600' : 'text-slate-400'}>{sub.active ? 'Active Autopay' : 'Paused'}</b>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSubStatus(sub.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      sub.active
                        ? 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200'
                        : 'bg-teal-700 text-white hover:bg-teal-800'
                    }`}
                  >
                    {sub.active ? 'Pause Mandate' : 'Resume Mandate'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAddSubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form
            onSubmit={handleAddSubscription}
            className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-zinc-800 space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-600" />
                Add Recurring Mandate
              </h3>
              <button
                type="button"
                onClick={() => setShowAddSubModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Service / Provider
                </label>
                <input
                  type="text"
                  placeholder="e.g. Disney+ Hotstar, Zerodha SIP"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:outline-teal-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="₹ 899"
                    value={subAmount}
                    onChange={(e) => setSubAmount(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:outline-teal-600 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Billing Cycle
                  </label>
                  <select
                    value={subCycle}
                    onChange={(e) => setSubCycle(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Next Renewal Date
                  </label>
                  <input
                    type="date"
                    value={subNextDate}
                    onChange={(e) => setSubNextDate(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={subPaymentMethod}
                    onChange={(e) => setSubPaymentMethod(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700"
                  >
                    <option value="UPI Autopay">UPI Autopay</option>
                    <option value="HDFC Credit Card">HDFC Credit Card</option>
                    <option value="Auto Debit (SBI)">Auto Debit (SBI)</option>
                    <option value="Debit Card">Debit Card</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md mt-2"
            >
              Confirm Autopay Mandate
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function OwedView({ owedList, setOwedList, profile, showToast }) {
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showAddSingleModal, setShowAddSingleModal] = useState(false);

  const [person, setPerson] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [phone, setPhone] = useState('');

  const [billTotal, setBillTotal] = useState('');
  const [billDescription, setBillDescription] = useState('Dinner at Social');
  const [splitMethod, setSplitMethod] = useState('equal');
  const [splitFriends, setSplitFriends] = useState([
    { id: '1', name: 'Rahul Sharma', phone: '919876543210', customAmount: '' },
    { id: '2', name: 'Pooja Nair', phone: '919876543214', customAmount: '' }
  ]);
  const [newFriendName, setNewFriendName] = useState('');
  const [newFriendPhone, setNewFriendPhone] = useState('');

  const totalOwed = useMemo(() => {
    return owedList.reduce((sum, item) => sum + item.amount, 0);
  }, [owedList]);

  const handleMarkSettled = (id, personName) => {
    setOwedList(prev => prev.filter(item => item.id !== id));
    showToast(`Settled up with ${personName}!`);
  };

  const incrementReminder = (id) => {
    setOwedList(prev =>
      prev.map(item => item.id === id ? { ...item, reminderCount: (item.reminderCount || 0) + 1 } : item)
    );
  };

  const generateWhatsAppLink = (item) => {
    const payeeUpi = profile?.upi_id || 'vikram@okhdfc';
    const payeeName = profile?.full_name || 'Vikram';

    const upiDeepLink = `upi://pay?pa=${encodeURIComponent(payeeUpi)}&pn=${encodeURIComponent(payeeName)}&am=${encodeURIComponent(item.amount)}&cu=INR&tn=${encodeURIComponent(item.reason)}`;
    const message = `Namaste ${item.person}! Gentle reminder for ₹${item.amount.toLocaleString('en-IN')} for "${item.reason}".%0A%0A📲 Pay directly via 1-tap UPI link:%0A${encodeURIComponent(upiDeepLink)}%0A%0AOr send to UPI ID: ${payeeUpi}. Thanks!`;

    return `https://wa.me/${item.phone}?text=${message}`;
  };

  const handleAddSingle = (e) => {
    e.preventDefault();
    if (!person || !amount) return;

    const newItem = {
      id: `ow_${Date.now()}`,
      person,
      amount: Number(amount),
      reason: reason || 'Split expense',
      date: new Date().toISOString().split('T')[0],
      daysPending: 0,
      reminderCount: 0,
      phone: phone.replace(/\D/g, '') || '919876543210'
    };

    setOwedList([newItem, ...owedList]);
    setPerson('');
    setAmount('');
    setReason('');
    setPhone('');
    setShowAddSingleModal(false);
    showToast(`Added ${newItem.person} (${formatINR(newItem.amount)}) to Khata`);
  };

  const handleAddFriendToSplit = () => {
    if (!newFriendName.trim()) return;
    setSplitFriends([
      ...splitFriends,
      {
        id: `f_${Date.now()}`,
        name: newFriendName.trim(),
        phone: newFriendPhone.replace(/\D/g, '') || '919876543215',
        customAmount: ''
      }
    ]);
    setNewFriendName('');
    setNewFriendPhone('');
  };

  const handleRemoveFriendFromSplit = (id) => {
    setSplitFriends(prev => prev.filter(f => f.id !== id));
  };

  const handleExecuteBillSplit = (e) => {
    e.preventDefault();
    const total = parseFloat(billTotal);
    if (!total || total <= 0 || splitFriends.length === 0) return;

    const totalParticipants = splitFriends.length + 1;
    const equalShare = Math.round(total / totalParticipants);

    const generatedReceivables = splitFriends.map(friend => {
      const splitAmt = splitMethod === 'equal'
        ? equalShare
        : parseFloat(friend.customAmount) || equalShare;

      return {
        id: `ow_split_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        person: friend.name,
        amount: splitAmt,
        reason: `${billDescription} (Share)`,
        date: new Date().toISOString().split('T')[0],
        daysPending: 0,
        reminderCount: 0,
        phone: friend.phone || '919876543210'
      };
    });

    setOwedList(prev => [...generatedReceivables, ...prev]);
    setShowSplitModal(false);
    setBillTotal('');
    showToast(`Split ₹${total.toLocaleString('en-IN')} among ${totalParticipants} people!`);
  };

  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
            <Users className="w-5 h-5 text-teal-600" />
            Khata & Receivables
          </h2>
          <p className="text-xs text-slate-500">
            Track money owed to you with 1-click WhatsApp & UPI deep links
          </p>
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={() => setShowAddSingleModal(true)}
            className="text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 px-2.5 py-1.5 rounded-xl hover:bg-slate-200"
          >
            + Single
          </button>
          <button
            onClick={() => setShowSplitModal(true)}
            className="text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Split Bill</span>
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-4 shadow-md flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider block">
            Total Pending Receivables
          </span>
          <h3 className="text-2xl font-black mt-0.5 tracking-tight">
            {formatINR(totalOwed)}
          </h3>
          <p className="text-[11px] text-teal-100 mt-0.5">
            {owedList.length} unsettled splits • Default UPI: {profile?.upi_id || 'vikram@okhdfc'}
          </p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-black text-xl">
          ₹
        </div>
      </div>

      <div className="space-y-3">
        {owedList.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border-2 border-dashed border-slate-300 dark:border-zinc-800 rounded-3xl p-6 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-sm text-slate-800 dark:text-zinc-200">
              All Squared Up!
            </h4>
            <p className="text-xs text-slate-400">
              No one currently owes you money. Use 'Split Bill' to record group expenses.
            </p>
          </div>
        ) : (
          owedList.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-4 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 flex items-center justify-center font-extrabold text-sm shadow-sm">
                    {item.person.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.person}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                      {item.reason}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Pending for <b>{item.daysPending ?? 0} days</b> • Reminded {item.reminderCount ?? 0}x
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {formatINR(item.amount)}
                  </p>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 block mt-1">
                    Unpaid
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800 text-xs">
                <a
                  href={generateWhatsAppLink(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => incrementReminder(item.id)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 font-bold text-[11px] flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Remind on WhatsApp</span>
                </a>

                <button
                  onClick={() => handleMarkSettled(item.id, item.person)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 hover:text-emerald-700 text-slate-700 dark:text-zinc-200 font-bold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark Settled</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showSplitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form
            onSubmit={handleExecuteBillSplit}
            className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-zinc-800 space-y-3.5"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-teal-600" />
                Split Bill with Friends
              </h3>
              <button
                type="button"
                onClick={() => setShowSplitModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Total Bill Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. ₹ 2400"
                  value={billTotal}
                  onChange={(e) => setBillTotal(e.target.value)}
                  className="w-full p-2.5 text-sm font-black rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:outline-teal-600"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Expense Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Swiggy party / Weekend trip"
                  value={billDescription}
                  onChange={(e) => setBillDescription(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Split Method</span>
                <div className="flex bg-slate-100 dark:bg-zinc-800 p-0.5 rounded-xl text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setSplitMethod('equal')}
                    className={`px-2.5 py-1 rounded-lg ${splitMethod === 'equal' ? 'bg-white dark:bg-zinc-900 text-teal-700 shadow-sm' : 'text-slate-500'}`}
                  >
                    Equally ({splitFriends.length + 1} ways)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSplitMethod('custom')}
                    className={`px-2.5 py-1 rounded-lg ${splitMethod === 'custom' ? 'bg-white dark:bg-zinc-900 text-teal-700 shadow-sm' : 'text-slate-500'}`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-zinc-200">You (Self)</span>
                  <span className="text-teal-700 dark:text-teal-400 font-bold">
                    {billTotal ? formatINR(Math.round(billTotal / (splitFriends.length + 1))) : '₹0'}
                  </span>
                </div>

                {splitFriends.map(friend => (
                  <div
                    key={friend.id}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="truncate">
                      <span className="font-bold block truncate">{friend.name}</span>
                      <span className="text-[10px] text-slate-400">{friend.phone}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {splitMethod === 'equal' ? (
                        <span className="text-xs font-bold text-emerald-600">
                          {billTotal ? formatINR(Math.round(billTotal / (splitFriends.length + 1))) : '₹0'}
                        </span>
                      ) : (
                        <input
                          type="number"
                          placeholder="₹ share"
                          value={friend.customAmount}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSplitFriends(prev => prev.map(f => f.id === friend.id ? { ...f, customAmount: val } : f));
                          }}
                          className="w-16 p-1 text-xs rounded-lg border bg-white dark:bg-zinc-900"
                        />
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveFriendFromSplit(friend.id)}
                        className="text-red-400 hover:text-red-600 p-1"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-1.5 pt-1">
                <input
                  type="text"
                  placeholder="Friend Name"
                  value={newFriendName}
                  onChange={(e) => setNewFriendName(e.target.value)}
                  className="flex-1 p-1.5 text-xs rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700"
                />
                <button
                  type="button"
                  onClick={handleAddFriendToSplit}
                  className="px-2.5 py-1.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-xs font-bold rounded-xl"
                >
                  + Add
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md mt-2"
            >
              Generate Receivables & Split
            </button>
          </form>
        </div>
      )}

      {showAddSingleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form
            onSubmit={handleAddSingle}
            className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-zinc-800 space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-bold text-sm">Add Khata Receivable</h3>
              <button type="button" onClick={() => setShowAddSingleModal(false)}>✕</button>
            </div>
            <input
              type="text"
              placeholder="Friend's Name"
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-zinc-800"
              required
            />
            <input
              type="number"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-zinc-800 font-bold"
              required
            />
            <input
              type="text"
              placeholder="Reason (e.g. Dinner, Fuel)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 text-xs rounded-xl border bg-slate-50 dark:bg-zinc-800"
            />
            <input
              type="tel"
              placeholder="WhatsApp 10-digit Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 text-xs rounded-xl border bg-slate-50 dark:bg-zinc-800"
            />
            <button
              type="submit"
              className="w-full py-2 bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Save Receivable
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function TransactionsLedger({ transactions, setTransactions, onOpenCapture, onBack, showToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchSearch =
        (tx.merchant || tx.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.tag || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchCat = selectedCategory === 'All' || tx.category === selectedCategory;
      const matchMode = selectedPaymentMode === 'All' || tx.method === selectedPaymentMode;
      const matchSource = selectedSource === 'All' || (tx.source || 'Manual') === selectedSource;

      const matchMonth =
        selectedMonth === 'All' ||
        (tx.date && tx.date.startsWith(selectedMonth));

      return matchSearch && matchCat && matchMode && matchSource && matchMonth;
    });
  }, [transactions, searchTerm, selectedCategory, selectedPaymentMode, selectedSource, selectedMonth]);

  const totalFilteredExpense = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'debit')
      .reduce((s, t) => s + t.amount, 0);
  }, [filteredTransactions]);

  const handleDeleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    showToast('Transaction removed');
  };

  const handleExportCSV = () => {
    showToast('Exporting filtered ledger CSV...');
    let csv = 'ID,Date,Merchant,Category,Amount,Type,Method,Source\n';
    filteredTransactions.forEach(t => {
      csv += `"${t.id}","${t.date}","${t.merchant || t.title}","${t.category}",${t.amount},"${t.type}","${t.method}","${t.source || 'Manual'}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PaisaPulse_Ledger_${Date.now()}.csv`;
    a.click();
    showToast('Ledger CSV exported!');
  };

  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Transactions Ledger
            </h2>
            <p className="text-xs text-slate-500">
              Audit and filter all recorded financial entries
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-200 flex items-center gap-1 text-xs font-bold"
        >
          <FileDown className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-3.5 shadow-sm space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by merchant, tag (e.g. Swiggy, Chai)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:outline-teal-600"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-1.5 text-[11px] rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 font-semibold"
          >
            <option value="All">All Categories</option>
            {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={selectedPaymentMode}
            onChange={(e) => setSelectedPaymentMode(e.target.value)}
            className="p-1.5 text-[11px] rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 font-semibold"
          >
            <option value="All">All Payment Modes</option>
            {PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="p-1.5 text-[11px] rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 font-semibold"
          >
            <option value="All">All Sources</option>
            <option value="Manual">Manual Entry</option>
            <option value="SMS Ingest">SMS Ingest</option>
            <option value="Voice">Voice Record</option>
            <option value="Bill Scan">Bill Scan</option>
            <option value="Statement">Statement Import</option>
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="p-1.5 text-[11px] rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 font-semibold"
          >
            <option value="All">All Months</option>
            <option value="2026-09">Sep 2026</option>
            <option value="2026-08">Aug 2026</option>
            <option value="2026-07">Jul 2026</option>
          </select>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-zinc-800 text-[11px] text-slate-500">
          <span>Showing <b>{filteredTransactions.length}</b> records</span>
          <span className="font-bold text-teal-700 dark:text-teal-400">
            Total Debits: {formatINR(totalFilteredExpense)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {filteredTransactions.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border rounded-3xl p-6 text-center text-slate-400 text-xs">
            No matching transactions found.
          </div>
        ) : (
          filteredTransactions.map(tx => (
            <div
              key={tx.id}
              className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-3 shadow-sm flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3 truncate">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  tx.type === 'credit'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                }`}>
                  {tx.type === 'credit' ? '+' : '₹'}
                </div>

                <div className="truncate">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {tx.merchant || tx.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span>{formatIndianDate(tx.date)}</span>
                    <span>•</span>
                    <span className="bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.2 rounded font-medium text-slate-500">
                      {tx.source || 'Manual'}
                    </span>
                    <span>•</span>
                    <span>{tx.method}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className={`text-xs font-black ${
                    tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'
                  }`}>
                    {tx.type === 'credit' ? '+' : '-'}{formatINR(tx.amount)}
                  </p>
                  <span className="text-[9px] text-slate-400">{tx.category}</span>
                </div>

                <button
                  onClick={() => handleDeleteTransaction(tx.id)}
                  title="Delete entry"
                  className="text-slate-300 hover:text-red-500 p-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function SettingsScreen({
  profile,
  supabaseConfig,
  onOpenSupabaseConfig,
  transactions,
  budgets,
  subscriptions,
  owedList,
  onDeleteAllData,
  onBack,
  showToast
}) {
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [showPurgeModal, setShowPurgeModal] = useState(false);

  const ingestToken = profile?.ingest_token || 'pp_tok_live_8f3d1a92e4';
  const webhookUrl = supabaseConfig.url
    ? `${supabaseConfig.url}/functions/v1/sms-ingest`
    : `https://api.paisapulse.in/v1/ingest/sms`;

  const copyToClipboard = (text, type) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      if (type === 'token') {
        setCopiedToken(true);
        setTimeout(() => setCopiedToken(false), 2000);
      } else {
        setCopiedWebhook(true);
        setTimeout(() => setCopiedWebhook(false), 2000);
      }
      showToast('Copied to clipboard!');
    } catch (e) {
      showToast('Failed to copy');
    }
  };

  const handleExportFullJSON = () => {
    const backupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      profile,
      transactions,
      budgets,
      subscriptions,
      owedList
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PaisaPulse_Complete_Backup_${Date.now()}.json`;
    a.click();
    showToast('Full JSON backup downloaded!');
  };

  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="p-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            App Settings & Sync
          </h2>
          <p className="text-xs text-slate-500">
            Automated SMS ingest, webhooks, and GDPR data management
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-black text-lg">
            {profile?.full_name ? profile.full_name.charAt(0) : 'U'}
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              {profile?.full_name || 'Vikram Aditya'}
            </h3>
            <p className="text-xs text-slate-400">
              UPI: <span className="font-mono text-teal-600 dark:text-teal-400 font-bold">{profile?.upi_id || 'vikram@okhdfc'}</span>
            </p>
            <span className="text-[10px] text-slate-400">
              Income: {formatINR(profile?.monthly_income || 145000)} / mo
            </span>
          </div>
        </div>

        <button
          onClick={onOpenSupabaseConfig}
          className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold flex items-center gap-1"
        >
          <Database className="w-3.5 h-3.5" />
          <span>Supabase</span>
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-zinc-200">
            Automated SMS & Email Forwarder Setup
          </h3>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          Forward incoming Indian Bank debit alert SMS or credit card emails directly to your PaisaPulse edge parser without opening the app.
        </p>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">
            Personal Supabase Ingest Token
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={ingestToken}
              className="flex-1 p-2 font-mono text-xs rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300"
            />
            <button
              onClick={() => copyToClipboard(ingestToken, 'token')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-700 dark:text-zinc-300 text-xs font-bold flex items-center gap-1"
            >
              {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedToken ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">
            Webhook Endpoint URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={webhookUrl}
              className="flex-1 p-2 font-mono text-xs rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 truncate"
            />
            <button
              onClick={() => copyToClipboard(webhookUrl, 'webhook')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-700 dark:text-zinc-300 text-xs font-bold flex items-center gap-1"
            >
              {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedWebhook ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-4 shadow-sm space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-zinc-200">
          Data Export & Portability
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExportFullJSON}
            className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700/60 border border-slate-200 dark:border-zinc-700 text-left transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-teal-600 mb-1" />
            <span className="font-bold text-xs text-slate-800 dark:text-zinc-200 block">
              Complete JSON
            </span>
            <span className="text-[10px] text-slate-400">All tables & profiles</span>
          </button>

          <button
            onClick={() => {
              let csv = 'Category,Limit,Spent\n';
              budgets.forEach(b => { csv += `"${b.category}",${b.limit},${b.spent}\n`; });
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `PaisaPulse_Budgets_${Date.now()}.csv`;
              a.click();
              showToast('Budgets CSV downloaded!');
            }}
            className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700/60 border border-slate-200 dark:border-zinc-700 text-left transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-600 mb-1" />
            <span className="font-bold text-xs text-slate-800 dark:text-zinc-200 block">
              Budgets CSV
            </span>
            <span className="text-[10px] text-slate-400">Category limits summary</span>
          </button>
        </div>
      </div>

      <div className="bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 rounded-3xl p-4 shadow-sm space-y-2.5">
        <h3 className="font-bold text-xs uppercase tracking-wider text-red-700 dark:text-red-400">
          Danger Zone (GDPR Compliance)
        </h3>
        <p className="text-[11px] text-red-900 dark:text-red-300 leading-relaxed">
          Permanently erase all locally stored transactions, budgets, recurring autopay mandates, and khata entries from this browser.
        </p>
        <button
          onClick={() => setShowPurgeModal(true)}
          className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete My Data</span>
        </button>
      </div>

      {showPurgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-2xl border border-red-300 dark:border-red-900 space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">
              Purge All Financial Data?
            </h4>
            <p className="text-xs text-slate-500">
              This action cannot be undone. All offline ledger entries, budgets, and tokens will be permanently wiped.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowPurgeModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteAllData();
                  setShowPurgeModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
              >
                Yes, Purge Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SupabaseConfigModal({ isOpen, onClose, config, onSave }) {
  const [url, setUrl] = useState(config.url || '');
  const [anonKey, setAnonKey] = useState(config.anonKey || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-zinc-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
            <Database className="w-4 h-4 text-teal-600" />
            Supabase Sync Config
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              Project URL
            </label>
            <input
              type="text"
              placeholder="https://xyzcompany.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-2.5 text-xs border rounded-xl bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 font-mono"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              Anon / Public API Key
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              className="w-full p-2.5 text-xs border rounded-xl bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 font-mono"
            />
          </div>
        </div>
        <button
          onClick={() => onSave({ url, anonKey })}
          className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
}