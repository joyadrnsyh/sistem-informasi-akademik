import React from 'react';
import Select from '../ui/Select';

/**
 * Renders the dashboard welcome banner with student name and semester select.
 */
export const WelcomeBanner = ({ studentName }) => {
  const semesterOptions = [
    { value: 'genap_23_24', label: 'Semester Genap 2023/2024' },
    { value: 'ganjil_23_24', label: 'Semester Ganjil 2023/2024' }
  ];

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs text-left">
      <div className="text-left">
        <h2 className="text-xl md:text-2xl font-bold text-stone-850">
          Selamat pagi, {studentName || 'Andi Pratama'}! 👋
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Berikut informasi aktivitas akademik Anda hari ini.
        </p>
      </div>
      <div>
        <Select options={semesterOptions} selectSize="md" variant="default" />
      </div>
    </div>
  );
};

export default WelcomeBanner;
