import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Bell, LogOut, User, Shield, GraduationCap, BookOpen, Menu, MessageSquare, Calendar, ChevronDown } from 'lucide-react';
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
    mahasiswa: 'bg-indigo-50 text-indigo-700 border-indigo-200/50',
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
          <span className="text-xl font-semibold text-stone-800 tracking-wide">Dashboard</span>

        </div>
      </div>

      {/* Right side: Notifications & User Profile */}
      <div className="flex items-center gap-5">
        {/* Notification Button */}
        <button className="relative p-1.5 text-stone-500 hover:text-stone-850 hover:bg-stone-50 rounded-xl transition-colors cursor-pointer">
          <Bell className="h-5.5 w-5.5" />
          <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-[#faf8f6]">
            3
          </span>
        </button>

        {/* Chat Button */}
        <button className="p-1.5 text-stone-500 hover:text-stone-850 hover:bg-stone-50 rounded-xl transition-colors cursor-pointer">
          <MessageSquare className="h-5.5 w-5.5" />
        </button>

        {/* Calendar Button */}
        <button className="p-1.5 text-stone-500 hover:text-stone-850 hover:bg-stone-50 rounded-xl transition-colors cursor-pointer">
          <Calendar className="h-5.5 w-5.5" />
        </button>

        {/* User Dropdown */}
        <div className="relative flex items-center">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-stone-50 transition-all duration-200 cursor-pointer"
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-9 w-9 rounded-full object-cover ring-1 ring-stone-200"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full ring-2 ring-[#faf8f6]" />
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-stone-800 leading-none">
                {user.role === 'mahasiswa' ? `Hallo, ${user.name}` : user.name}
              </span>
              <span className="text-[10px] text-stone-500 font-semibold leading-none mt-1.5 flex items-center gap-1">
                {user.role === 'mahasiswa' ? 'Mahasiswa' : user.role === 'dosen' ? 'Dosen' : 'Admin'}
                <ChevronDown className="h-3 w-3 text-stone-400" />
              </span>
            </div>
          </button>

          {showDropdown && (
            <>
              {/* Overlay to close */}
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white border border-stone-200 shadow-lg py-1 z-50 animate-fade-in" style={{ animationDuration: '0.15s' }}>
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
                    <LogOut className="h-4 w-4" />
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
