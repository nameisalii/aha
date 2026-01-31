import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

const demoUsers = [
  { id: '1', name: 'Alex Johnson', email: 'alex.johnson@duke.edu', phone: '555-0101', points: 45, password: 'demo123' },
  { id: '2', name: 'Sarah Chen', email: 'sarah.chen@duke.edu', phone: '555-0102', points: 32, password: 'demo123' },
  { id: '3', name: 'Marcus Williams', email: 'marcus.w@duke.edu', phone: '555-0103', points: 28, password: 'demo123' },
  { id: '4', name: 'Emily Rodriguez', email: 'emily.r@duke.edu', phone: '555-0104', points: 15, password: 'demo123' },
];

const demoListings = [
  { id: '1', title: 'Vintage Duke Hoodie', description: 'Classic Duke blue hoodie, size M. Excellent condition.', images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'], sellerId: '2', sellerName: 'Sarah Chen', status: 'active', createdAt: new Date('2024-01-15') },
  { id: '2', title: 'MacBook Pro Stand', description: 'Ergonomic laptop stand, adjustable height.', images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'], sellerId: '3', sellerName: 'Marcus Williams', status: 'active', createdAt: new Date('2024-01-14') },
  { id: '3', title: 'Calculus Textbook', description: 'Stewart Calculus 8th Edition. Some highlighting.', images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'], sellerId: '4', sellerName: 'Emily Rodriguez', status: 'active', createdAt: new Date('2024-01-13') },
  { id: '4', title: 'Desk Lamp LED', description: 'Modern LED desk lamp with adjustable brightness.', images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400'], sellerId: '1', sellerName: 'Alex Johnson', status: 'active', createdAt: new Date('2024-01-12') },
  { id: '5', title: 'Nike Running Shoes', description: 'Nike Air Zoom size 10. Used for one semester.', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'], sellerId: '2', sellerName: 'Sarah Chen', status: 'active', createdAt: new Date('2024-01-11') },
  { id: '6', title: 'Mini Fridge', description: 'Compact dorm fridge, works perfectly.', images: ['https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400'], sellerId: '3', sellerName: 'Marcus Williams', status: 'active', createdAt: new Date('2024-01-10') },
  { id: '7', title: 'Wireless Earbuds', description: 'Sony WF-1000XM4 with noise cancellation.', images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400'], sellerId: '4', sellerName: 'Emily Rodriguez', status: 'active', createdAt: new Date('2024-01-09') },
  { id: '8', title: 'Yoga Mat', description: 'Purple yoga mat, 6mm thick.', images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400'], sellerId: '1', sellerName: 'Alex Johnson', status: 'active', createdAt: new Date('2024-01-08') },
];

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('dukeswap_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('dukeswap_users');
    return saved ? JSON.parse(saved) : demoUsers;
  });
  const [listings, setListings] = useState(() => {
    const saved = localStorage.getItem('dukeswap_listings');
    return saved ? JSON.parse(saved) : demoListings;
  });
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('dukeswap_chats');
    return saved ? JSON.parse(saved) : [];
  });
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('dukeswap_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (currentUser) localStorage.setItem('dukeswap_user', JSON.stringify(currentUser));
    else localStorage.removeItem('dukeswap_user');
  }, [currentUser]);
  useEffect(() => { localStorage.setItem('dukeswap_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('dukeswap_listings', JSON.stringify(listings)); }, [listings]);
  useEffect(() => { localStorage.setItem('dukeswap_chats', JSON.stringify(chats)); }, [chats]);
  useEffect(() => { localStorage.setItem('dukeswap_transactions', JSON.stringify(transactions)); }, [transactions]);

  const showToast = (message, type = 'success') => {
    const id = uuidv4();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...safeUser } = user;
      setCurrentUser(safeUser);
      showToast(`Welcome back, ${user.name}!`);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = (userData) => {
    if (users.some(u => u.email === userData.email)) {
      return { success: false, error: 'Email already registered' };
    }
    const newUser = { id: uuidv4(), ...userData, points: 10 };
    setUsers(prev => [...prev, newUser]);
    const { password: _, ...safeUser } = newUser;
    setCurrentUser(safeUser);
    showToast('Welcome to DukeSwap! +10 bonus points! 🎉');
    return { success: true };
  };

  const logout = () => { setCurrentUser(null); showToast('Logged out'); };
  const updateUser = (updates) => {
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updates } : u));
    setCurrentUser(prev => ({ ...prev, ...updates }));
  };

  const createListing = (data) => {
    const listing = { id: uuidv4(), ...data, sellerId: currentUser.id, sellerName: currentUser.name, status: 'active', createdAt: new Date() };
    setListings(prev => [listing, ...prev]);
    showToast('Item published! 🌱');
    return listing;
  };

  const updateListing = (id, updates) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    showToast('Listing updated');
  };

  const deleteListing = (id) => { setListings(prev => prev.filter(l => l.id !== id)); showToast('Listing removed'); };

  const completeSale = (listingId, buyerNickname) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return { success: false, error: 'Listing not found' };
    if (!buyerNickname.trim()) return { success: false, error: 'Please enter a buyer name' };

    // Try to find existing user, but allow any name
    const buyer = users.find(u => u.name.toLowerCase().includes(buyerNickname.toLowerCase()) && u.id !== currentUser.id);
    const buyerId = buyer?.id || uuidv4();
    const buyerName = buyer?.name || buyerNickname.trim();

    const transaction = { id: uuidv4(), listingId, listingTitle: listing.title, listingImage: listing.images?.[0], sellerId: currentUser.id, sellerName: currentUser.name, buyerId, buyerName, completedAt: new Date() };
    setTransactions(prev => [...prev, transaction]);
    setListings(prev => prev.map(l => l.id === listingId ? { ...l, status: 'sold' } : l));
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) return { ...u, points: u.points + 5 };
      if (buyer && u.id === buyer.id) return { ...u, points: u.points + 3 };
      return u;
    }));
    setCurrentUser(prev => ({ ...prev, points: prev.points + 5 }));
    showToast('Sale completed! +5 points! 🎉');
    return { success: true, transaction };
  };

  const startChat = (sellerId, listingId) => {
    if (!currentUser) return null;
    let chat = chats.find(c => c.listingId === listingId && ((c.buyerId === currentUser.id && c.sellerId === sellerId) || (c.sellerId === currentUser.id && c.buyerId === sellerId)));
    if (chat) return chat.id;
    const listing = listings.find(l => l.id === listingId);
    const seller = users.find(u => u.id === sellerId);
    const newChat = { id: uuidv4(), listingId, listingTitle: listing?.title, listingImage: listing?.images?.[0], sellerId, sellerName: seller?.name, buyerId: currentUser.id, buyerName: currentUser.name, messages: [], createdAt: new Date() };
    setChats(prev => [newChat, ...prev]);
    return newChat.id;
  };

  const sendMessage = (chatId, content) => {
    const msg = { id: uuidv4(), senderId: currentUser.id, senderName: currentUser.name, content, timestamp: new Date() };
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, messages: [...c.messages, msg], lastMessage: content, lastMessageAt: new Date() } : c));
  };

  const getUserChats = () => currentUser ? chats.filter(c => c.buyerId === currentUser.id || c.sellerId === currentUser.id).sort((a, b) => new Date(b.lastMessageAt || b.createdAt) - new Date(a.lastMessageAt || a.createdAt)) : [];

  const convertPoints = (amount) => {
    if (currentUser.points < amount) return { success: false, error: 'Insufficient points' };
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, points: u.points - amount } : u));
    setCurrentUser(prev => ({ ...prev, points: prev.points - amount }));
    showToast(`Converted ${amount} points to food points! 🍕`);
    return { success: true };
  };

  const getUserStats = () => {
    if (!currentUser) return { sold: 0, bought: 0, active: 0 };
    return {
      sold: transactions.filter(t => t.sellerId === currentUser.id).length,
      bought: transactions.filter(t => t.buyerId === currentUser.id).length,
      active: listings.filter(l => l.sellerId === currentUser.id && l.status === 'active').length,
    };
  };

  return (
    <AppContext.Provider value={{ currentUser, users, listings, chats, transactions, toasts, login, signup, logout, updateUser, createListing, updateListing, deleteListing, completeSale, startChat, sendMessage, getUserChats, convertPoints, getUserStats, showToast }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
