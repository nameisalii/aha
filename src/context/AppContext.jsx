import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

const demoUsers = [
  { id: '1', name: 'Alex Johnson', email: 'alex.johnson@duke.edu', phone: '555-0101', points: 4500, password: 'demo123' },
  { id: '2', name: 'Sarah Chen', email: 'sarah.chen@duke.edu', phone: '555-0102', points: 3200, password: 'demo123' },
  { id: '3', name: 'Marcus Williams', email: 'marcus.w@duke.edu', phone: '555-0103', points: 2800, password: 'demo123' },
  { id: '4', name: 'Emily Rodriguez', email: 'emily.r@duke.edu', phone: '555-0104', points: 1500, password: 'demo123' },
  { id: '5', name: 'Gudrun', email: 'gudrun@duke.edu', phone: '555-0105', points: 1000, password: 'demo123' },
  { id: '6', name: 'Kaddy', email: 'kaddy@duke.edu', phone: '555-0106', points: 1200, password: 'demo123' },
  { id: '7', name: 'Kashvi', email: 'kashvi@duke.edu', phone: '555-0107', points: 1100, password: 'demo123' },
  { id: '8', name: 'Mad', email: 'mad@duke.edu', phone: '555-0108', points: 900, password: 'demo123' },
];

const demoListings = [
  // RUN category - EXACT MATCH FOR IMAGE
  { id: 'r1', category: 'run', type: 'offer', title: 'Naan Stop', sellerId: '5', sellerName: 'Gudrun', status: 'active', hashtags: ['restaurants', 'time-sensitive'], location: 'Naan Stop', timeInfo: '20 min', createdAt: new Date() },
  { id: 'r2', category: 'run', type: 'offer', title: 'Pizzeria Toro', sellerId: '6', sellerName: 'Kaddy', status: 'active', hashtags: ['restaurants', 'time-sensitive'], location: 'Pizzeria Toro', timeInfo: '1hr 40 min', createdAt: new Date(Date.now() - 1000) },
  { id: 'r3', category: 'run', type: 'offer', title: "Ideal's", sellerId: '7', sellerName: 'Kashvi', status: 'active', hashtags: ['restaurants', 'time-sensitive'], location: "Ideal's", timeInfo: '2hr 30 min', createdAt: new Date(Date.now() - 2000) },
  { id: 'r4', category: 'run', type: 'request', title: 'Whole Foods', sellerId: '1', sellerName: 'Alex', status: 'active', hashtags: ['groceries', 'time-sensitive'], location: 'Whole Foods', timeInfo: 'by 5pm today', createdAt: new Date(Date.now() - 3000) },
  { id: 'r6', category: 'run', type: 'request', title: '9th Street', sellerId: '3', sellerName: 'Marcus', status: 'active', hashtags: ['bakery', 'time-sensitive'], location: '9th Street', timeInfo: 'Tomorrow 9am', createdAt: new Date(Date.now() - 4000) },
  { id: 'r7', category: 'run', type: 'request', title: 'Erwin Rd', sellerId: '4', sellerName: 'Emily', status: 'active', hashtags: ['groceries'], location: 'Erwin Rd', timeInfo: 'Tonight', createdAt: new Date(Date.now() - 5000) },
  { id: 'r8', category: 'run', type: 'offer', title: 'Durham Co-op', sellerId: '8', sellerName: 'Mad', status: 'active', hashtags: ['groceries'], location: 'West Chapel Hill St', timeInfo: 'Saturday', createdAt: new Date() },

  // RIDE category
  { id: 'rid1', category: 'ride', type: 'offer', title: 'RDU Airport', sellerId: '2', sellerName: 'Sarah', status: 'active', hashtags: ['airport'], location: 'RDU Airport', timeInfo: 'Monday morning', createdAt: new Date(Date.now() - 6000) },
  { id: 'rid2', category: 'ride', type: 'offer', title: 'Southpoint Mall', sellerId: '4', sellerName: 'Emily', status: 'active', hashtags: ['mall'], location: 'Southpoint Mall', timeInfo: 'Saturday 2pm', createdAt: new Date(Date.now() - 7000) },
  { id: 'rid3', category: 'ride', type: 'offer', title: 'Costco', sellerId: '6', sellerName: 'Kaddy', status: 'active', hashtags: ['groceries'], location: 'Costco', timeInfo: 'Sunday morning', createdAt: new Date(Date.now() - 8000) },
  { id: 'rid4', category: 'ride', type: 'request', title: 'Duke Campus Farm', sellerId: '5', sellerName: 'Gudrun', status: 'active', hashtags: ['university-event'], location: 'Duke Campus Farm', timeInfo: 'Sunday 2/1, 4pm', createdAt: new Date() },

  // REUSE category
  { id: 'reu1', category: 'reuse', type: 'give', title: 'Blue Hoodie', description: 'Size Large, slightly worn but very comfy.', sellerId: '8', sellerName: 'Mad', status: 'active', hashtags: ['clothing'], location: 'West Campus', timeInfo: 'Pickup Tonight', createdAt: new Date(Date.now() - 9000) },
  { id: 'reu2', category: 'reuse', type: 'give', title: 'Calculus Textbook', description: 'Borrow it for the semester!', sellerId: '4', sellerName: 'Emily', status: 'active', hashtags: ['books'], location: 'Student Union', timeInfo: 'Semester-long', createdAt: new Date() },
  { id: 'reu3', category: 'reuse', type: 'give', title: 'Used Microwave', description: 'Works great, just upgraded.', sellerId: '6', sellerName: 'Kaddy', status: 'active', hashtags: ['electronics'], location: 'East Campus', timeInfo: 'Pickup ASAP', createdAt: new Date() },
  { id: 'reu4', category: 'reuse', type: 'lend', title: 'Winter Jacket', description: 'Size Medium, very warm.', sellerId: '7', sellerName: 'Kashvi', status: 'active', hashtags: ['clothing'], location: 'East Campus', timeInfo: 'Weekly lend', createdAt: new Date() },
  { id: 'reu5', category: 'reuse', type: 'give', title: 'Desk Chair', description: 'Good condition, slightly squeaky.', sellerId: '3', sellerName: 'Marcus', status: 'active', hashtags: ['furniture'], location: 'Apartment', timeInfo: 'Weekend pickup', createdAt: new Date() },
  { id: 'reu6', category: 'reuse', type: 'lend', title: 'Camping Tent', description: 'Fits 2-3 people, easy setup.', sellerId: '2', sellerName: 'Sarah', status: 'active', hashtags: ['university-event'], location: 'Duke Forest', timeInfo: '3 days max', createdAt: new Date() },
  { id: 'reu7', category: 'reuse', type: 'give', title: 'Nike Sneakers', description: 'Size 10, worn once.', sellerId: '1', sellerName: 'Alex', status: 'active', hashtags: ['clothing'], location: 'K-Ville', timeInfo: 'Today only', createdAt: new Date() },
  { id: 'reu8', category: 'reuse', type: 'lend', title: 'Iron & Board', sellerId: '5', sellerName: 'Gudrun', status: 'active', hashtags: ['furniture'], location: 'Dorm', timeInfo: '1 hour', createdAt: new Date() },
];

const demoRewards = [
  { id: '1', company: 'Naan Stop', description: '$5 off your next bowl', points: 500, logo: '🍛', category: 'food' },
  { id: '2', company: 'Pizzeria Toro', description: 'Free garlic knots with any order', points: 300, logo: '🍕', category: 'food' },
  { id: '3', company: 'Foster Street Coffee', description: 'Buy one get one free coffee', points: 200, logo: '☕', category: 'drink' },
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
    const parsed = saved ? JSON.parse(saved) : demoListings;
    // Force reset if specific new demo items are missing to ensure user sees updates
    if (!parsed.find(l => l.id === 'r8')) return demoListings;
    return parsed;
  });
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('dukeswap_chats');
    return saved ? JSON.parse(saved) : [];
  });
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('dukeswap_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [userRewards, setUserRewards] = useState(() => {
    const saved = localStorage.getItem('dukeswap_user_rewards');
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
  useEffect(() => { localStorage.setItem('dukeswap_user_rewards', JSON.stringify(userRewards)); }, [userRewards]);

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
    const newUser = { id: uuidv4(), ...userData, points: 1000 };
    setUsers(prev => [...prev, newUser]);
    const { password: _, ...safeUser } = newUser;
    setCurrentUser(safeUser);
    showToast('Welcome to AHA! +1000 bonus points! 🎉');
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
    showToast('Published successfully! 🌱');
    return listing;
  };

  const updateListing = (id, updates) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    showToast('Updated successfully');
  };

  const deleteListing = (id) => { setListings(prev => prev.filter(l => l.id !== id)); showToast('Removed'); };

  const redeemReward = (rewardId) => {
    const reward = demoRewards.find(r => r.id === rewardId);
    if (!reward) return { success: false, error: 'Reward not found' };
    if (currentUser.points < reward.points) return { success: false, error: 'Insufficient points' };

    const newUserReward = { ...reward, id: uuidv4(), demoId: reward.id, redeemedAt: new Date() };
    setUserRewards(prev => [newUserReward, ...prev]);

    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, points: u.points - reward.points } : u));
    setCurrentUser(prev => ({ ...prev, points: prev.points - reward.points }));

    showToast(`Redeemed ${reward.company} reward! 🎉`);
    return { success: true };
  };

  const startChat = (targetId, listingId) => {
    if (!currentUser) return null;
    let chat = chats.find(c => c.listingId === listingId && ((c.buyerId === currentUser.id && c.sellerId === targetId) || (c.sellerId === currentUser.id && c.buyerId === targetId)));
    if (chat) return chat.id;
    const listing = listings.find(l => l.id === listingId);
    const seller = users.find(u => u.id === targetId);
    const newChat = { id: uuidv4(), listingId, listingTitle: listing?.title || 'Ride/Run Request', listingImage: listing?.images?.[0], sellerId: targetId, sellerName: seller?.name, buyerId: currentUser.id, buyerName: currentUser.name, messages: [], createdAt: new Date() };
    setChats(prev => [newChat, ...prev]);
    return newChat.id;
  };

  const sendMessage = (chatId, content) => {
    const msg = { id: uuidv4(), senderId: currentUser.id, senderName: currentUser.name, content, timestamp: new Date() };
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, messages: [...c.messages, msg], lastMessage: content, lastMessageAt: new Date() } : c));
  };

  const getUserChats = () => currentUser ? chats.filter(c => c.buyerId === currentUser.id || c.sellerId === currentUser.id).sort((a, b) => new Date(b.lastMessageAt || b.createdAt) - new Date(a.lastMessageAt || a.createdAt)) : [];

  const getUserStats = () => {
    if (!currentUser) return { active: 0, shared: 0 };
    return {
      active: listings.filter(l => l.sellerId === currentUser.id && l.status === 'active').length,
      shared: transactions.filter(t => t.sellerId === currentUser.id).length,
    };
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, listings, chats, transactions, userRewards, demoRewards, toasts,
      login, signup, logout, updateUser, createListing, updateListing, deleteListing,
      redeemReward, startChat, sendMessage, getUserChats, getUserStats, showToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
