import React from 'react';
import { FileText, CheckCircle, GraduationCap, Wallet, BookOpen } from 'lucide-react';

/**
 * Quick access quick links button grid card.
 */
export const QuickAccess = ({ onNavigate }) => {
  const items = [
    {
      label: 'KRS',
      icon: FileText,
      iconBg: 'bg-blue-55 text-[#1d6cf0]',
      onClick: () => onNavigate('krs')
    },
    {
      label: 'Kartu Hasil Studi',
      icon: CheckCircle,
      iconBg: 'bg-emerald-55 text-emerald-600',
      onClick: () => onNavigate('khs')
    },
    {
      label: 'Transkrip Sementara',
      icon: GraduationCap,
      iconBg: 'bg-purple-55 text-purple-600',
      onClick: () => onNavigate('khs')
    },
    {
      label: 'Presensi',
      icon: CheckCircle,
      iconBg: 'bg-indigo-55 text-indigo-600',
      onClick: () => {}
    },
    {
      label: 'Pembayaran',
      icon: Wallet,
      iconBg: 'bg-amber-55 text-amber-600',
      onClick: () => onNavigate('ukt')
    },
    {
      label: 'Buku Pedoman',
      icon: BookOpen,
      iconBg: 'bg-amber-55 text-amber-600',
      onClick: () => {}
    }
  ];

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs text-left h-full flex flex-col">
      <h3 className="text-sm font-bold text-stone-850 pb-3 border-b border-stone-100 mb-4">Akses Cepat</h3>

      <div className="grid grid-cols-3 gap-3 flex-1">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={item.onClick}
              className="flex flex-col items-center justify-center p-2.5 bg-white hover:bg-stone-50 border border-stone-150 rounded-xl shadow-2xs transition-all cursor-pointer group"
            >
              <div className={`p-2 rounded-xl group-hover:scale-105 transition-transform ${item.iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[9px] font-bold text-stone-600 mt-2 text-center leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickAccess;
