import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Toast from './components/Toast';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ShopPage from './pages/ShopPage';
import PublishPage from './pages/PublishPage';
import ChatPage from './pages/ChatPage';
import AccountPage from './pages/AccountPage';

function ProtectedRoute() {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

function PublicRoute() {
  const { currentUser } = useApp();

  if (currentUser) {
    return <Navigate to="/shop" replace />;
  }

  return <Outlet />;
}

function AppRoutes() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/publish" element={<PublishPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:chatId" element={<ChatPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>

        {/* Default */}
        <Route path="*" element={<Navigate to="/shop" replace />} />
      </Routes>
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="app-container">
          <AppRoutes />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}
