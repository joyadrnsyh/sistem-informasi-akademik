import React from 'react';
import { Megaphone } from 'lucide-react';

/**
 * Lists the academic announcements on the dashboard.
 */
export const AnnouncementList = ({ announcements, onViewAll }) => {
  const defaultAnnouncements = [
    {
      title: 'Pembayaran UKT Semester Genap 2023/2024',
      description: 'Pembayaran dapat dilakukan hingga 10 Juni 2024.',
      date: '20 Mei 2024',
      badgeBg: 'bg-indigo-50 text-indigo-600'
    },
    {
      title: 'Pengisian KRS Semester Genap 2023/2024',
      description: 'Periode pengisian KRS telah dibuka. Segera lakukan pengisian KRS Anda.',
      date: '18 Mei 2024',
      badgeBg: 'bg-emerald-50 text-emerald-600'
    },
    {
      title: 'Jadwal Ujian Akhir Semester',
      description: 'Jadwal UAS dapat dilihat pada menu Perkuliahan.',
      date: '15 Mei 2024',
      badgeBg: 'bg-purple-50 text-purple-600'
    }
  ];

  const dataList = announcements || defaultAnnouncements;

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs flex flex-col text-left h-full">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <h3 className="text-sm font-bold text-stone-800">Pengumuman Terbaru</h3>
        <button 
          onClick={onViewAll} 
          className="text-[11px] text-indigo-600 hover:underline font-bold cursor-pointer"
        >
          Lihat Semua
        </button>
      </div>

      <div className="space-y-4 mt-4 text-left flex-1">
        {dataList.map((item, idx) => (
          <div key={idx} className="flex items-start justify-between gap-3 text-left">
            <div className={`p-2 rounded-full mt-0.5 flex-shrink-0 ${item.badgeBg}`}>
              <Megaphone className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h4 className="text-xs font-bold text-stone-800 leading-snug">
                {item.title}
              </h4>
              <p className="text-[10px] text-stone-400 mt-1 leading-snug">
                {item.description}
              </p>
            </div>
            <span className="text-[10px] text-stone-400 font-semibold whitespace-nowrap ml-2">
              {item.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementList;
