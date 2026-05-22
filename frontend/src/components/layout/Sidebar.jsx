import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BookOpen, 
  GraduationCap, 
  CreditCard, 
  UserCheck, 
  FileText, 
  Settings, 
  LogOut, 
  X,
  Award
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  // Define navigation based on roles
  const getNavLinks = () => {
    switch (user.role) {
      case 'admin':
        return [
          { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/admin/users', label: 'Kelola User', icon: Users },
          { path: '/admin/courses', label: 'Data Matakuliah', icon: BookOpen },
          { path: '/admin/schedules', label: 'Jadwal Kuliah', icon: Calendar },
        ];
      case 'dosen':
        return [
          { path: '/dosen', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/dosen/schedules', label: 'Jadwal Mengajar', icon: Calendar },
          { path: '/dosen/grades', label: 'Input Nilai', icon: UserCheck },
          { path: '/dosen/profile', label: 'Profil Saya', icon: FileText },
        ];
      case 'mahasiswa':
        return [
          { path: '/mahasiswa', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/mahasiswa/krs', label: 'Rencana Studi (KRS)', icon: BookOpen },
          { path: '/mahasiswa/khs', label: 'Hasil Studi (KHS)', icon: Award },
          { path: '/mahasiswa/ukt', label: 'Tagihan UKT', icon: CreditCard },
          { path: '/mahasiswa/profile', label: 'Profil Saya', icon: FileText },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile Sidebar Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 flex w-68 flex-col bg-slate-900/90 border-r border-slate-800/80 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header (Logo & Brand) */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
              U
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-sm text-slate-100 tracking-wider uppercase font-sans">UNIVERSITAS</span>
              <span className="text-[10px] text-indigo-400 font-semibold leading-none tracking-widest mt-0.5">SIA PORTAL</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 lg:hidden cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-left">Menu Navigasi</p>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-105 duration-200 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`} />
                <span className="truncate">{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer (Logout) */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/20">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
