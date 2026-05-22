import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';

// Pages
import Login from '../pages/auth/Login';
import ForgotPassword from '../pages/auth/ForgotPassword';
import AdminDashboard from '../pages/admin/AdminDashboard';
import DosenDashboard from '../pages/dosen/DosenDashboard';
import MahasiswaDashboard from '../pages/mahasiswa/MahasiswaDashboard';

// --- ROUTE GUARD: CHECK LOGGED IN ---
const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-600">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-terracotta-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Memuat Portal...</span>
        </div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// --- ROUTE GUARD: CHECK USER ROLE ---
const RoleRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

// --- DASHBOARD SHELL LAYOUT ---
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return window.innerWidth >= 1024;
  });

  return (
    <div className="flex h-screen w-screen bg-[#faf8f6] text-stone-800 overflow-hidden font-sans relative">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 overflow-y-auto transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:pl-68' : 'lg:pl-0'
        }`}>
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Dashboard Pages Slot */}
        <main className="p-6 md:p-8 flex-1">
          <div className="max-w-7xl mx-auto w-full h-full">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

// --- UNAUTHORIZED / ERROR PAGE ---
const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="glass p-8 rounded-2xl max-w-sm text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-700 border border-rose-200/50 mb-4 text-xl font-bold">
          !
        </div>
        <h2 className="text-lg font-bold text-stone-850">Akses Ditolak</h2>
        <p className="text-xs text-stone-500 mt-2 leading-relaxed">
          Akun Anda tidak memiliki wewenang untuk membuka halaman ini.
        </p>
        <NavigateButton />
      </div>
    </div>
  );
};

const NavigateButton = () => {
  const { user } = useAuth();

  const getRedirectPath = () => {
    if (!user) return '/login';
    return `/${user.role}`;
  };

  return (
    <a
      href={getRedirectPath()}
      className="mt-5 inline-block w-full py-2.5 bg-stone-100 hover:bg-stone-200/80 text-stone-700 font-semibold text-xs rounded-xl border border-stone-200 transition-colors"
    >
      Kembali ke Dashboard Anda
    </a>
  );
};

// --- ALL APP ROUTING MAP ---
export const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}`} replace />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Pages */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Default redirect based on role */}
          <Route path="/" element={<Navigate to={user ? `/${user.role}` : '/login'} replace />} />

          {/* Admin routes */}
          <Route element={<RoleRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminDashboard />} />
            <Route path="/admin/courses" element={<AdminDashboard />} />
            <Route path="/admin/schedules" element={<AdminDashboard />} />
          </Route>

          {/* Dosen routes */}
          <Route element={<RoleRoute allowedRoles={['dosen']} />}>
            <Route path="/dosen" element={<DosenDashboard />} />
            <Route path="/dosen/schedules" element={<DosenDashboard />} />
            <Route path="/dosen/grades" element={<DosenDashboard />} />
            <Route path="/dosen/profile" element={<DosenDashboard />} />
          </Route>

          {/* Mahasiswa routes */}
          <Route element={<RoleRoute allowedRoles={['mahasiswa']} />}>
            <Route path="/mahasiswa" element={<MahasiswaDashboard />} />
            <Route path="/mahasiswa/krs" element={<MahasiswaDashboard />} />
            <Route path="/mahasiswa/khs" element={<MahasiswaDashboard />} />
            <Route path="/mahasiswa/ukt" element={<MahasiswaDashboard />} />
            <Route path="/mahasiswa/profile" element={<MahasiswaDashboard />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to={user ? `/${user.role}` : '/login'} replace />} />
    </Routes>
  );
};

export default AppRoutes;
