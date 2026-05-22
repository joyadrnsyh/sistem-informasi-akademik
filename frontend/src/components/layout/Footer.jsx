import React from 'react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-4 px-6 border-t border-slate-800/80 bg-slate-950/20 text-slate-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
      <div>
        &copy; {currentYear} Universitas SIA. All rights reserved.
      </div>
      <div className="flex items-center gap-4">
        <span>Sistem Informasi Akademik v2.1.0</span>
        <span className="h-3 w-px bg-slate-800" />
        <span>Bantuan & Support</span>
      </div>
    </footer>
  );
};

export default Footer;
