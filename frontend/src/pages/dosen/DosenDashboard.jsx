import React, { useState, useEffect } from 'react';
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
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { InputForm } from '../../components/ui/InputForm';
import api from '../../services/api';

export const DosenDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.endsWith('/schedules')) return 'overview';
    if (path.endsWith('/grades')) return 'grading';
    if (path.endsWith('/profile')) return 'profile';
    return 'overview';
  };
  const activeTab = getActiveTab();

  const setActiveTab = (tab) => {
    if (tab === 'overview') navigate('/dosen');
    else navigate(`/dosen/${tab === 'grading' ? 'grades' : tab}`);
  };

  // Active course selected for grading
  const [selectedCourse, setSelectedCourse] = useState('');
  const [gradeSuccessMessage, setGradeSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- DATABASE WITH STATE ---
  const [schedules, setSchedules] = useState([]);
  const [studentGrades, setStudentGrades] = useState({});

  // Fetch teaching schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/dosen/classes');
        setSchedules(response.data);
        if (response.data.length > 0) {
          setSelectedCourse(response.data[0].id);
        }
      } catch (err) {
        console.error('Error fetching schedules:', err);
        setError('Gagal memuat jadwal mengajar dari server.');
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  // Fetch student list & grades for the selected course
  useEffect(() => {
    if (!selectedCourse) return;
    const fetchStudents = async () => {
      try {
        const response = await api.get(`/dosen/classes/${selectedCourse}/students`);
        setStudentGrades(prev => ({
          ...prev,
          [selectedCourse]: response.data
        }));
      } catch (err) {
        console.error('Error fetching student grades:', err);
      }
    };
    fetchStudents();
  }, [selectedCourse]);

  // Calculate final score and grade letter
  const calculateFinalScore = (tugas, uts, uas) => {
    return Math.round((tugas * 0.3) + (uts * 0.3) + (uas * 0.4));
  };

  const getGradeLetter = (score) => {
    if (score >= 85) return { letter: 'A', style: 'text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200' };
    if (score >= 75) return { letter: 'B', style: 'text-terracotta-700 font-bold bg-terracotta-50 px-2 py-0.5 rounded border border-terracotta-200' };
    if (score >= 60) return { letter: 'C', style: 'text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200' };
    if (score >= 50) return { letter: 'D', style: 'text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200' };
    return { letter: 'E', style: 'text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200' };
  };

  // Handle grade change locally
  const handleGradeChange = (studentId, field, value) => {
    const parsedValue = Math.min(100, Math.max(0, parseInt(value) || 0));

    setStudentGrades(prev => {
      const courseGrades = prev[selectedCourse]?.map(student => {
        if (student.id === studentId) {
          return { ...student, [field]: parsedValue };
        }
        return student;
      }) || [];
      return { ...prev, [selectedCourse]: courseGrades };
    });
  };

  // Submit / Save Grades
  const handleSaveGrades = async () => {
    const currentStudents = studentGrades[selectedCourse] || [];
    if (currentStudents.length === 0) return;

    setLoading(true);
    try {
      await Promise.all(
        currentStudents.map(student =>
          api.post('/dosen/grades', {
            courseId: selectedCourse,
            studentId: student.studentId || student.id,
            tugas: student.tugas,
            uts: student.uts,
            uas: student.uas
          })
        )
      );
      setGradeSuccessMessage('Nilai berhasil disimpan dan dikirim ke sistem akademik BAA.');
      setTimeout(() => setGradeSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Error saving grades:', err);
      alert('Gagal menyimpan nilai ke server.');
    } finally {
      setLoading(false);
    }
  };

  const currentGradingStudents = studentGrades[selectedCourse] || [];
  const activeCourseData = schedules.find(c => c.id === selectedCourse);

  const totalSks = schedules.reduce((sum, s) => sum + (s.sks || 0), 0);
  const totalStudents = schedules.reduce((sum, s) => sum + (s.studentsCount || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-850 m-0">Dashboard Dosen</h1>
          <p className="text-sm text-stone-500 mt-1">Selamat datang kembali, <strong>{user?.name}</strong>. Silakan kelola jadwal mengajar dan nilai mahasiswa.</p>
        </div>
      </div>

      {/* --- OVERVIEW TAB --- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass p-5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 font-semibold tracking-wider uppercase">Beban SKS</span>
                <h3 className="text-2xl font-bold text-stone-800 mt-1">{totalSks} SKS</h3>
                <span className="text-[10px] text-terracotta-600 font-medium mt-1 inline-block">{schedules.length} Matakuliah Diampu</span>
              </div>
              <div className="p-3 bg-terracotta-50 rounded-xl text-terracotta-600">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>

            <div className="glass p-5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 font-semibold tracking-wider uppercase">Total Mahasiswa Ajar</span>
                <h3 className="text-2xl font-bold text-stone-800 mt-1">{totalStudents} Mahasiswa</h3>
                <span className="text-[10px] text-emerald-600 font-medium mt-1 inline-block">Aktif di {schedules.length} Kelas</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>

            <div className="glass p-5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 font-semibold tracking-wider uppercase">Kehadiran Mengajar</span>
                <h3 className="text-2xl font-bold text-stone-800 mt-1">94%</h3>
                <span className="text-[10px] text-amber-600 font-medium mt-1 inline-block">15 dari 16 Pertemuan</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Schedule list */}
          <div className="space-y-4">
            <h3 className="font-bold text-stone-700">Jadwal Mengajar Semester Ini</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {schedules.map((sched) => (
                <div key={sched.id} className="glass p-5 rounded-2xl border-l-4 border-l-terracotta-500 flex flex-col justify-between gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-terracotta-600 uppercase tracking-wide bg-terracotta-50 border border-terracotta-100 px-2 py-0.5 rounded">
                        {sched.code} • {sched.class}
                      </span>
                      <h4 className="font-bold text-stone-800 mt-2 text-base">{sched.name}</h4>
                      <p className="text-xs text-stone-500 mt-0.5">{sched.sks} SKS • Kurikulum 2024</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-stone-200/60 pt-3 text-xs text-stone-550 gap-2">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-stone-400" />
                      <span>{sched.day}, {sched.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-stone-400" />
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
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">Pilih Matakuliah</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-sm text-stone-800 focus:outline-none focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/20"
              >
                {schedules.map(s => (
                  <option key={s.id} value={s.id}>{s.code} - {s.name} ({s.class})</option>
                ))}
              </select>
            </div>

            <div className="text-right self-stretch sm:self-center flex flex-col items-end justify-center">
              <span className="text-xs text-stone-550">Bobot Evaluasi</span>
              <span className="text-xs text-stone-600 font-semibold mt-0.5">Tugas (30%) • UTS (30%) • UAS (40%)</span>
            </div>
          </div>

          {/* Success Alerts */}
          {gradeSuccessMessage && (
            <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs animate-fade-in">
              <Check className="h-4.5 w-4.5 flex-shrink-0" />
              <span>{gradeSuccessMessage}</span>
            </div>
          )}

          {/* Grade spreadsheet-style table */}
          <div className="glass p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-stone-800">Daftar Nilai Mahasiswa - {activeCourseData?.name} ({activeCourseData?.class})</h4>
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
                { header: 'NIM', key: 'id', className: 'font-mono text-stone-500' },
                { header: 'Nama Lengkap', key: 'name', className: 'font-semibold text-stone-800' },
                {
                  header: 'Tugas (30%)', key: 'tugas', render: (val, row) => (
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={val}
                      onChange={(e) => handleGradeChange(row.id, 'tugas', e.target.value)}
                      className="w-16 px-2 py-1 bg-white border border-stone-200 focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/20 rounded text-center text-xs text-stone-800 focus:outline-none"
                    />
                  )
                },
                {
                  header: 'UTS (30%)', key: 'uts', render: (val, row) => (
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={val}
                      onChange={(e) => handleGradeChange(row.id, 'uts', e.target.value)}
                      className="w-16 px-2 py-1 bg-white border border-stone-200 focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/20 rounded text-center text-xs text-stone-800 focus:outline-none"
                    />
                  )
                },
                {
                  header: 'UAS (40%)', key: 'uas', render: (val, row) => (
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={val}
                      onChange={(e) => handleGradeChange(row.id, 'uas', e.target.value)}
                      className="w-16 px-2 py-1 bg-white border border-stone-200 focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/20 rounded text-center text-xs text-stone-800 focus:outline-none"
                    />
                  )
                },
                {
                  header: 'Nilai Akhir', key: 'tugas', render: (_, row) => {
                    const score = calculateFinalScore(row.tugas, row.uts, row.uas);
                    return <span className="font-semibold text-stone-800">{score}</span>;
                  }
                },
                {
                  header: 'Huruf', key: 'tugas', render: (_, row) => {
                    const score = calculateFinalScore(row.tugas, row.uts, row.uas);
                    const grade = getGradeLetter(score);
                    return <span className={grade.style}>{grade.letter}</span>;
                  }
                }
              ]}
              data={currentGradingStudents}
            />
          </div>
        </div>
      )}

      {/* --- PROFILE TAB --- */}
      {activeTab === 'profile' && (
        <div className="glass p-6 rounded-2xl max-w-2xl text-left">
          <h3 className="font-bold text-stone-850 tracking-wide mb-4">Biodata Pengajar</h3>
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b border-stone-200/60">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="h-20 w-20 rounded-2xl object-cover ring-2 ring-stone-200"
            />
            <div>
              <h4 className="font-bold text-lg text-stone-850">{user?.name}</h4>
              <p className="text-xs text-stone-500 font-medium mt-1">NIDN: {user?.nidn || 'N/A'}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200/50 text-[10px] font-bold uppercase tracking-wider">
                Dosen Pengajar
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5 text-sm">
            <div className="flex justify-between py-1.5 border-b border-stone-200/60">
              <span className="text-stone-550">Nama Lengkap</span>
              <span className="font-medium text-stone-700">{user?.name}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-200/60">
              <span className="text-stone-550">Nomor Induk Dosen (NIDN)</span>
              <span className="font-medium font-mono text-stone-700">{user?.nidn || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-200/60">
              <span className="text-stone-550">Alamat Email</span>
              <span className="font-medium text-stone-700">{user?.email}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-200/60">
              <span className="text-stone-550">Fakultas / Departemen</span>
              <span className="font-medium text-stone-700">{user?.faculty || 'N/A'} / {user?.department || 'N/A'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DosenDashboard;
