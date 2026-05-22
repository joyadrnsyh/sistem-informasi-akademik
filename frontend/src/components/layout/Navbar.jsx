import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Bell, LogOut, User, Shield, GraduationCap, BookOpen, Menu } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  // Icon depending on role
  const getRoleIcon = () => {
    switch (user.role) {
      case 'admin': return Shield;
      case 'dosen': return BookOpen;
      case 'mahasiswa': return GraduationCap;
      default: return User;
    }
  };

  const RoleIcon = getRoleIcon();

  // Role Badge Styling
  const roleBadgeStyles = {
    admin: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    dosen: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    mahasiswa: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-slate-800/80 px-6 py-3 flex items-center justify-between text-slate-100">
      {/* Left side: Hamburger (mobile) and Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 lg:hidden cursor-pointer"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs text-slate-500 font-medium">Sistem Informasi Akademik</span>
          <span className="text-sm font-semibold text-slate-200 tracking-wide">
            {user.role === 'mahasiswa' ? `Semester ${user.semester} • TA ${user.academicYear}` : 'Portal Akademik'}
          </span>
        </div>
      </div>

      {/* Right side: Notifications & User Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Button */}
        <button className="relative p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-indigo-500 rounded-full ring-2 ring-slate-900" />
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-1.5 pr-3.5 rounded-xl bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/55 transition-all duration-200 cursor-pointer"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-700"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-200 leading-none mb-1">{user.name}</span>
              <span className="text-[10px] text-slate-500 font-medium leading-none">
                {user.role === 'mahasiswa' ? user.nim : user.role === 'dosen' ? user.nidn : 'Administrator'}
              </span>
            </div>
          </button>

          {showDropdown && (
            <>
              {/* Overlay to close */}
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2.5 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-2 z-50 animate-fade-in" style={{ animationDuration: '0.15s' }}>
                <div className="px-4 py-3 border-b border-slate-800/60 text-left">
                  <p className="text-xs text-slate-500 font-medium">Masuk Sebagai</p>
                  <p className="text-sm font-bold text-slate-200 mt-0.5 truncate">{user.name}</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${roleBadgeStyles[user.role]}`}>
                      <RoleIcon className="h-3 w-3" />
                      {user.role.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-1">
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                    Keluar Sesi
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
