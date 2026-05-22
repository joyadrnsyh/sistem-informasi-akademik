import React, { useState } from 'react';
import { 
  Calendar, 
  BookOpen, 
  UserCheck, 
  Award, 
  Check, 
  AlertCircle,
  FileSpreadsheet,
  Clock,
  MapPin,
  TrendingUp,
  Save
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { InputForm } from '../../components/ui/InputForm';

export const DosenDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Active course selected for grading
  const [selectedCourse, setSelectedCourse] = useState('MK-101');
  const [gradeSuccessMessage, setGradeSuccessMessage] = useState('');

  // --- MOCK DATABASE WITH STATE ---
  const [schedules] = useState([
    { id: 'MK-101', name: 'Pemrograman Web', code: 'IF2204', class: 'TI-4A', day: 'Senin', time: '08:00 - 10:30', room: 'Lab Komputer 3', studentsCount: 28, sks: 3 },
    { id: 'MK-103', name: 'Kecerdasan Buatan', code: 'IF3201', class: 'TI-6B', day: 'Kamis', time: '10:00 - 12:30', room: 'Ruang Teori 301', studentsCount: 32, sks: 4 },
  ]);

  const [studentGrades, setStudentGrades] = useState({
    'MK-101': [
      { id: '2201010045', name: 'Reza Hendrawan', tugas: 85, uts: 80, uas: 88 },
      { id: '2201010080', name: 'Lia Safitri', tugas: 90, uts: 85, uas: 92 },
      { id: '2201010012', name: 'Budi Darmawan', tugas: 70, uts: 75, uas: 68 },
      { id: '2201010099', name: 'Siti Rahma', tugas: 60, uts: 65, uas: 72 },
    ],
    'MK-103': [
      { id: '2201010045', name: 'Reza Hendrawan', tugas: 80, uts: 78, uas: 82 },
      { id: '2201010012', name: 'Budi Darmawan', tugas: 75, uts: 70, uas: 80 },
    ]
  });

  // Calculate final score and grade letter
  const calculateFinalScore = (tugas, uts, uas) => {
    return Math.round((tugas * 0.3) + (uts * 0.3) + (uas * 0.4));
  };

  const getGradeLetter = (score) => {
    if (score >= 85) return { letter: 'A', style: 'text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20' };
    if (score >= 75) return { letter: 'B', style: 'text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20' };
    if (score >= 60) return { letter: 'C', style: 'text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20' };
    if (score >= 50) return { letter: 'D', style: 'text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20' };
    return { letter: 'E', style: 'text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20' };
  };

  // Handle grade change locally
  const handleGradeChange = (studentId, field, value) => {
    const parsedValue = Math.min(100, Math.max(0, parseInt(value) || 0));
    
    setStudentGrades(prev => {
      const courseGrades = prev[selectedCourse].map(student => {
        if (student.id === studentId) {
          return { ...student, [field]: parsedValue };
        }
        return student;
      });
      return { ...prev, [selectedCourse]: courseGrades };
    });
  };

  // Submit / Save Grades simulator
  const handleSaveGrades = () => {
    setGradeSuccessMessage('Nilai berhasil disimpan dan dikirim ke sistem akademik BAA.');
    setTimeout(() => setGradeSuccessMessage(''), 4000);
  };

  const currentGradingStudents = studentGrades[selectedCourse] || [];
  const activeCourseData = schedules.find(c => c.id === selectedCourse);

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 m-0">Dashboard Dosen</h1>
          <p className="text-sm text-slate-400 mt-1">Selamat datang kembali, <strong>{user?.name}</strong>. Silakan kelola jadwal mengajar dan nilai mahasiswa.</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800 self-start">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Mengajar & Jadwal
          </button>
          <button
            onClick={() => setActiveTab('grading')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'grading' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Input Nilai Mahasiswa
          </button>
        </div>
      </div>

      {/* --- OVERVIEW TAB --- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass p-5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Beban SKS</span>
                <h3 className="text-2xl font-bold text-slate-100 mt-1">7 SKS</h3>
                <span className="text-[10px] text-indigo-400 font-medium mt-1 inline-block">2 Matakuliah Diampu</span>
              </div>
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>

            <div className="glass p-5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Total Mahasiswa Ajar</span>
                <h3 className="text-2xl font-bold text-slate-100 mt-1">60 Mahasiswa</h3>
                <span className="text-[10px] text-emerald-400 font-medium mt-1 inline-block">Aktif di 2 Kelas</span>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>

            <div className="glass p-5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Kehadiran Mengajar</span>
                <h3 className="text-2xl font-bold text-slate-100 mt-1">94%</h3>
                <span className="text-[10px] text-amber-400 font-medium mt-1 inline-block">15 dari 16 Pertemuan</span>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Schedule list */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-200">Jadwal Mengajar Semester Ini</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {schedules.map((sched) => (
                <div key={sched.id} className="glass p-5 rounded-2xl border-l-4 border-l-indigo-500 flex flex-col justify-between gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                        {sched.code} • {sched.class}
                      </span>
                      <h4 className="font-bold text-slate-200 mt-2 text-base">{sched.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{sched.sks} SKS • Kurikulum 2024</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400 gap-2">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <span>{sched.day}, {sched.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <span>{sched.room}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- GRADING TAB --- */}
      {activeTab === 'grading' && (
        <div className="space-y-5">
          {/* Selector header */}
          <div className="glass p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:max-w-xs">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Pilih Matakuliah</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {schedules.map(s => (
                  <option key={s.id} value={s.id}>{s.code} - {s.name} ({s.class})</option>
                ))}
              </select>
            </div>
            
            <div className="text-right self-stretch sm:self-center flex flex-col items-end justify-center">
              <span className="text-xs text-slate-500">Bobot Evaluasi</span>
              <span className="text-xs text-slate-300 font-semibold mt-0.5">Tugas (30%) • UTS (30%) • UAS (40%)</span>
            </div>
          </div>

          {/* Success Alerts */}
          {gradeSuccessMessage && (
            <div className="flex items-center gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs animate-fade-in">
              <Check className="h-4.5 w-4.5 flex-shrink-0" />
              <span>{gradeSuccessMessage}</span>
            </div>
          )}

          {/* Grade spreadsheet-style table */}
          <div className="glass p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-200">Daftar Nilai Mahasiswa - {activeCourseData?.name} ({activeCourseData?.class})</h4>
              <Button 
                variant="success" 
                icon={Save} 
                onClick={handleSaveGrades}
              >
                Simpan & Rilis Nilai
              </Button>
            </div>

            <Table
              columns={[
                { header: 'NIM', key: 'id', className: 'font-mono text-slate-400' },
                { header: 'Nama Lengkap', key: 'name', className: 'font-semibold text-slate-200' },
                { header: 'Tugas (30%)', key: 'tugas', render: (val, row) => (
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={val}
                    onChange={(e) => handleGradeChange(row.id, 'tugas', e.target.value)}
                    className="w-16 px-2 py-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded text-center text-xs text-slate-200"
                  />
                )},
                { header: 'UTS (30%)', key: 'uts', render: (val, row) => (
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={val}
                    onChange={(e) => handleGradeChange(row.id, 'uts', e.target.value)}
                    className="w-16 px-2 py-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded text-center text-xs text-slate-200"
                  />
                )},
                { header: 'UAS (40%)', key: 'uas', render: (val, row) => (
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={val}
                    onChange={(e) => handleGradeChange(row.id, 'uas', e.target.value)}
                    className="w-16 px-2 py-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded text-center text-xs text-slate-200"
                  />
                )},
                { header: 'Nilai Akhir', key: 'tugas', render: (_, row) => {
                  const score = calculateFinalScore(row.tugas, row.uts, row.uas);
                  return <span className="font-semibold text-slate-100">{score}</span>;
                }},
                { header: 'Huruf', key: 'tugas', render: (_, row) => {
                  const score = calculateFinalScore(row.tugas, row.uts, row.uas);
                  const grade = getGradeLetter(score);
                  return <span className={grade.style}>{grade.letter}</span>;
                }}
              ]}
              data={currentGradingStudents}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DosenDashboard;
