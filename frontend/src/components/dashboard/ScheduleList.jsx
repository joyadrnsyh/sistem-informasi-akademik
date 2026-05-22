import React from 'react';
import { MapPin } from 'lucide-react';

/**
 * Today's schedule list display.
 */
export const ScheduleList = ({ schedules, onViewAll }) => {
  const defaultSchedules = [
    {
      startTime: '08:00',
      endTime: '09:40',
      name: 'Struktur Data',
      code: 'IF-202',
      room: 'R. 302',
      status: 'Berlangsung',
      accentColor: 'bg-emerald-500',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-150'
    },
    {
      startTime: '10:00',
      endTime: '11:40',
      name: 'Basis Data',
      code: 'IF-204',
      room: 'R. 305',
      status: 'Mendatang',
      accentColor: 'bg-amber-500',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-150'
    },
    {
      startTime: '13:00',
      endTime: '14:40',
      name: 'Rekayasa Perangkat Lunak',
      code: 'IF-205',
      room: 'R. 301',
      status: 'Mendatang',
      accentColor: 'bg-[#1d6cf0]',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-150'
    },
    {
      startTime: '15:00',
      endTime: '16:40',
      name: 'Kecerdasan Buatan',
      code: 'IF-208',
      room: 'R. 306',
      status: 'Mendatang',
      accentColor: 'bg-purple-500',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-150'
    }
  ];

  const dataList = schedules || defaultSchedules;

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs text-left h-full flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <h3 className="text-sm font-bold text-stone-850">Jadwal Hari Ini</h3>
        <button 
          onClick={onViewAll}
          className="text-[11px] text-[#1d6cf0] hover:underline font-bold cursor-pointer"
        >
          Lihat Semua
        </button>
      </div>

      <div className="mt-4 space-y-4 flex-1">
        {dataList.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 bg-white border border-stone-150 rounded-xl p-3.5 relative overflow-hidden text-left"
          >
            {/* Left Colored Accent */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.accentColor}`} />
            
            <div className="flex flex-col text-xs font-bold text-stone-500 w-12 flex-shrink-0">
              <span>{item.startTime}</span>
              <span className="text-[10px] text-stone-400 font-normal mt-0.5">{item.endTime}</span>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h4 className="text-xs font-bold text-stone-850 truncate">{item.name}</h4>
              <p className="text-[10px] text-stone-400 mt-0.5 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {item.code} • {item.room}
              </p>
            </div>
            <span className={`border text-[9px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap ${item.badgeClass}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleList;
