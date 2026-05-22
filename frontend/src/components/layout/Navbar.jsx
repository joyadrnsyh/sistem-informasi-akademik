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
    admin: 'bg-rose-50 text-rose-700 border-rose-200/50',
    dosen: 'bg-amber-50 text-amber-700 border-amber-200/50',
    mahasiswa: 'bg-terracotta-50 text-terracotta-700 border-terracotta-200/50',
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-stone-200/80 px-6 py-3 flex items-center justify-between text-stone-800">
      {/* Left side: Hamburger and Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700 cursor-pointer"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs text-stone-400 font-medium">Sistem Informasi Akademik</span>
          <span className="text-sm font-semibold text-stone-700 tracking-wide">
            {user.role === 'mahasiswa' ? `Semester ${user.semester} • TA ${user.academicYear}` : 'Portal Akademik'}
          </span>
        </div>
      </div>

      {/* Right side: Notifications & User Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Button */}
        <button className="relative p-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-500 hover:text-stone-850 transition-colors cursor-pointer">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-terracotta-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-1.5 pr-3.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 transition-all duration-200 cursor-pointer"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="h-8 w-8 rounded-lg object-cover ring-1 ring-stone-200"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-stone-800 leading-none mb-1">{user.name}</span>
              <span className="text-[10px] text-stone-450 font-medium leading-none">
                {user.role === 'mahasiswa' ? user.nim : user.role === 'dosen' ? user.nidn : 'Administrator'}
              </span>
            </div>
          </button>

          {showDropdown && (
            <>
              {/* Overlay to close */}
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2.5 w-56 rounded-xl bg-white border border-stone-200 shadow-xl py-2 z-50 animate-fade-in" style={{ animationDuration: '0.15s' }}>
                <div className="px-4 py-3 border-b border-stone-100 text-left">
                  <p className="text-xs text-stone-400 font-medium">Masuk Sebagai</p>
                  <p className="text-sm font-bold text-stone-800 mt-0.5 truncate">{user.name}</p>
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
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-lg transition-colors text-left cursor-pointer"
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
