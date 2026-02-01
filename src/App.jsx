import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RunPage from './pages/RunPage';
import RidePage from './pages/RidePage';
import ReusePage from './pages/ReusePage';
import RewardsPage from './pages/RewardsPage';
import PublishPage from './pages/PublishPage';
import ChatPage from './pages/ChatPage';

function ProtectedRoute() {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
}

function PublicRoute() {
  const { currentUser } = useApp();

  if (currentUser) {
    return <Navigate to="/run" replace />;
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
          <Route path="/run" element={<RunPage />} />
          <Route path="/ride" element={<RidePage />} />
          <Route path="/reuse" element={<ReusePage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/publish" element={<PublishPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:chatId" element={<ChatPage />} />
        </Route>

        {/* Default */}
        <Route path="*" element={<Navigate to="/run" replace />} />
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
