import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logoUniv from '../../assets/logo_univ.png';
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
  Award,
  ChevronRight,
  BarChart3,
  Headphones,
  FolderOpen
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
          { path: '#akademik', label: 'Akademik', icon: GraduationCap, hasChevron: true },
          { path: '/mahasiswa/krs', label: 'KRS', icon: FileText },
          { path: '#perkuliahan', label: 'Perkuliahan', icon: BookOpen },
          { path: '/mahasiswa/khs', label: 'Nilai', icon: BarChart3 },
          { path: '/mahasiswa/ukt', label: 'Pembayaran', icon: CreditCard },
          { path: '#kemahasiswaan', label: 'Kemahasiswaan', icon: Users, hasChevron: true },
          { path: '#layanan', label: 'Layanan', icon: Headphones },
          { path: '#referensi', label: 'Referensi', icon: FolderOpen, hasChevron: true },
          { path: '#pengaturan', label: 'Pengaturan', icon: Settings },
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
          className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-68 flex-col bg-[#1e1b4b] transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Header (Logo & Brand) */}
        <div className="flex min-h-[4.5rem] items-center justify-between px-8 py-8 border-b border-white/10">
          <div className="flex flex-col gap-2 text-left">
            <div className="flex items-center gap-2.5">
              <img src={logoUniv} alt="Logo" className="h-10 w-10 object-contain" />
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm text-white tracking-wider uppercase font-sans leading-tight">UNIVERSITAS</span>
                <span className="font-bold text-sm text-white tracking-wider uppercase font-sans leading-tight">NUSANTARA</span>
              </div>
            </div>
            <span className="text-[12px] text-white/80 font-semibold leading-none pl-1 mt-1">Sistem Informasi Akademik</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:bg-white/10 hover:text-white lg:hidden cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto no-scrollbar">
          {navLinks.map((link, idx) => {
            const Icon = link.icon;
            const isHash = link.path.startsWith('#');
            const isActive = isHash ? false : (location.pathname === link.path || (link.path === '/mahasiswa' && location.pathname === '/mahasiswa/profile'));

            const content = (
              <>
                <Icon className={`h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-105 duration-200 ${isActive ? 'text-white' : 'text-white/80 group-hover:text-white'}`} />
                <span className="truncate flex-1 text-left">{link.label}</span>
                {link.hasChevron && <ChevronRight className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" />}
              </>
            );

            if (isHash) {
              return (
                <button
                  key={idx}
                  type="button"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white/85 hover:bg-white/10 hover:text-white transition-all duration-200 group cursor-pointer"
                >
                  {content}
                </button>
              );
            }

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/15'
                  : 'text-white/85 hover:bg-white/10 hover:text-white'
                  }`}
              >
                {content}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer Banner (Only for Mahasiswa as shown in screenshot) */}
        {user.role === 'mahasiswa' ? (
          <div className="p-4 mt-auto">
            <div className="bg-gradient-to-br from-[#312e81] to-[#1e1b4b] rounded-2xl p-4 text-left relative overflow-hidden shadow-inner">
              <h5 className="text-[12px] font-bold text-white leading-tight">
                Portal Terpadu untuk Mahasiswa Hebat
              </h5>
              <p className="text-[10px] text-white/70 mt-1 leading-snug">
                Satu akses untuk semua kebutuhan akademik.
              </p>

              {/* Campus SVG Illustration */}
              <div className="mt-3 flex justify-center">
                <svg viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-[140px]">
                  {/* Sky/Moon */}
                  <circle cx="130" cy="20" r="10" fill="#818cf8" opacity="0.3" />
                  <circle cx="133" cy="18" r="6" fill="#1e1b4b" />

                  {/* Clouds */}
                  <path d="M10 25 C15 20, 25 20, 30 25 C35 23, 42 23, 45 27 C48 27, 50 31, 48 34 L10 34 Z" fill="#ffffff" opacity="0.2" />

                  {/* Building Shadows & Ground */}
                  <rect x="35" y="35" width="90" height="35" rx="2" fill="#111827" />
                  <rect x="42" y="30" width="76" height="40" rx="3" fill="#312e81" />

                  {/* Main Tower */}
                  <rect x="70" y="10" width="20" height="25" fill="#4f46e5" />
                  <polygon points="65,10 80,0 95,10" fill="#4338ca" />
                  <circle cx="80" cy="17" r="3" fill="#ffffff" />
                  <circle cx="80" cy="17" r="1.5" fill="#4f46e5" />

                  {/* Windows */}
                  <rect x="49" y="37" width="5" height="7" rx="1" fill="#c7d2fe" />
                  <rect x="58" y="37" width="5" height="7" rx="1" fill="#c7d2fe" />
                  <rect x="97" y="37" width="5" height="7" rx="1" fill="#c7d2fe" />
                  <rect x="106" y="37" width="5" height="7" rx="1" fill="#c7d2fe" />
                  <rect x="49" y="48" width="5" height="7" rx="1" fill="#c7d2fe" />
                  <rect x="58" y="48" width="5" height="7" rx="1" fill="#c7d2fe" />
                  <rect x="97" y="48" width="5" height="7" rx="1" fill="#c7d2fe" />
                  <rect x="106" y="48" width="5" height="7" rx="1" fill="#c7d2fe" />

                  {/* Main Gate */}
                  <path d="M73 70 L73 50 C73 47, 87 47, 87 50 L87 70 Z" fill="#1e1b4b" />

                  {/* Trees */}
                  <circle cx="30" cy="55" r="8" fill="#10b981" />
                  <circle cx="22" cy="60" r="6" fill="#047857" />
                  <rect x="28" y="60" width="3" height="10" fill="#78350f" />
                  <rect x="20" y="64" width="2" height="6" fill="#78350f" />

                  <circle cx="130" cy="55" r="8" fill="#10b981" />
                  <circle cx="138" cy="60" r="6" fill="#047857" />
                  <rect x="128" y="60" width="3" height="10" fill="#78350f" />
                  <rect x="136" y="64" width="2" height="6" fill="#78350f" />
                </svg>
              </div>

              {/* Slider Dots */}
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 mt-auto">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span>Keluar Sistem</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
