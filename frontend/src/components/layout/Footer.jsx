import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full py-4 px-6 border-t border-stone-200/80 bg-white/40 text-stone-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
      <div>
        &copy; 2024 Universitas Nusantara. All rights reserved.
      </div>
      <div className="flex items-center gap-4 font-medium">
        <span>SIA v2.1.0</span>
      </div>
    </footer>
  );
};

export default Footer;
