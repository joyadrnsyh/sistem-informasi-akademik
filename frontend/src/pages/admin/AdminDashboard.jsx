import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Plus, 
  Trash2, 
  Search, 
  TrendingUp, 
  UserCheck, 
  FileText,
  Clock,
  MapPin,
  Mail,
  UserPlus
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { InputForm } from '../../components/ui/InputForm';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // --- MOCK DATABASE WITH STATE FOR CRUD ---
  const [users, setUsers] = useState([
    { id: '1', name: 'Dr. Ahmad Fauzi, M.T.', email: 'dosen@sia.ac.id', role: 'dosen', detail: 'NIDN: 0420088501 • Informatika' },
    { id: '2', name: 'Reza Hendrawan', email: 'mhs@sia.ac.id', role: 'mahasiswa', detail: 'NIM: 2201010045 • Informatika' },
    { id: '3', name: 'Lia Safitri', email: 'lia.safitri@sia.ac.id', role: 'mahasiswa', detail: 'NIM: 2201010080 • Sistem Informasi' },
    { id: '4', name: 'Dr. Retno Wahyuni', email: 'retno.w@sia.ac.id', role: 'dosen', detail: 'NIDN: 0412097802 • Sistem Informasi' },
  ]);

  const [courses, setCourses] = useState([
    { id: 'MK-101', name: 'Pemrograman Web', sks: 3, semester: 4, code: 'IF2204' },
    { id: 'MK-102', name: 'Basis Data Lanjut', sks: 3, semester: 4, code: 'IF2205' },
    { id: 'MK-103', name: 'Kecerdasan Buatan', sks: 4, semester: 6, code: 'IF3201' },
    { id: 'MK-104', name: 'Interaksi Manusia & Komputer', sks: 2, semester: 2, code: 'IF1205' },
  ]);

  const [schedules, setSchedules] = useState([
    { id: 'S-01', courseName: 'Pemrograman Web', lecturer: 'Dr. Ahmad Fauzi, M.T.', day: 'Senin', time: '08:00 - 10:30', room: 'Lab Komputer 3' },
    { id: 'S-02', courseName: 'Basis Data Lanjut', lecturer: 'Dr. Retno Wahyuni', day: 'Selasa', time: '13:00 - 15:30', room: 'Ruang Teori 204' },
    { id: 'S-03', courseName: 'Kecerdasan Buatan', lecturer: 'Dr. Ahmad Fauzi, M.T.', day: 'Kamis', time: '10:00 - 12:30', room: 'Ruang Teori 301' },
  ]);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Form states
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'mahasiswa', number: '' });
  const [courseForm, setCourseForm] = useState({ code: '', name: '', sks: 3, semester: 1 });
  const [scheduleForm, setScheduleForm] = useState({ courseId: '', lecturerId: '', day: 'Senin', time: '', room: '' });

  // --- CRUD ACTIONS ---
  const handleAddUser = (e) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email || !userForm.number) return;
    
    const newUser = {
      id: String(users.length + 1),
      name: userForm.name,
      email: userForm.email,
      role: userForm.role,
      detail: userForm.role === 'dosen' 
        ? `NIDN: ${userForm.number} • Teknik Informatika` 
        : `NIM: ${userForm.number} • Teknik Informatika`
    };
    
    setUsers([...users, newUser]);
    setUserForm({ name: '', email: '', role: 'mahasiswa', number: '' });
    setIsUserModalOpen(false);
  };

  const handleDeleteUser = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!courseForm.code || !courseForm.name) return;

    const newCourse = {
      id: courseForm.code,
      code: courseForm.code,
      name: courseForm.name,
      sks: Number(courseForm.sks),
      semester: Number(courseForm.semester)
    };

    setCourses([...courses, newCourse]);
    setCourseForm({ code: '', name: '', sks: 3, semester: 1 });
    setIsCourseModalOpen(false);
  };

  const handleDeleteCourse = (id) => {
    if (confirm('Hapus matakuliah ini?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleAddSchedule = (e) => {
    e.preventDefault();
    if (!scheduleForm.courseId || !scheduleForm.lecturerId || !scheduleForm.time || !scheduleForm.room) return;

    const selectedCourse = courses.find(c => c.id === scheduleForm.courseId);
    const selectedLecturer = users.find(u => u.id === scheduleForm.lecturerId);

    const newSchedule = {
      id: String(schedules.length + 1),
      courseName: selectedCourse ? selectedCourse.name : 'Unknown Course',
      lecturer: selectedLecturer ? selectedLecturer.name : 'Unknown Lecturer',
      day: scheduleForm.day,
      time: scheduleForm.time,
      room: scheduleForm.room
    };

    setSchedules([...schedules, newSchedule]);
    setScheduleForm({ courseId: '', lecturerId: '', day: 'Senin', time: '', room: '' });
    setIsScheduleModalOpen(false);
  };

  const handleDeleteSchedule = (id) => {
    if (confirm('Batalkan jadwal kuliah ini?')) {
      setSchedules(schedules.filter(s => s.id !== id));
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 m-0">Admin Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Kelola data master pengguna, matakuliah, dan jadwal perkuliahan.</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800 self-start">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Ikhtisar
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Kelola User
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'courses' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Matakuliah
          </button>
          <button
            onClick={() => setActiveTab('schedules')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'schedules' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Jadwal Kuliah
          </button>
        </div>
      </div>

      {/* --- OVERVIEW TAB --- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="glass p-5 rounded-2xl flex items-center justify-between text-left">
              <div>
                <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Mahasiswa Aktif</span>
                <h3 className="text-2xl font-bold text-slate-100 mt-1">2,482</h3>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> +12% semester ini
                </span>
              </div>
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                <Users className="h-6 w-6" />
              </div>
            </div>

            <div className="glass p-5 rounded-2xl flex items-center justify-between text-left">
              <div>
                <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Dosen Pengajar</span>
                <h3 className="text-2xl font-bold text-slate-100 mt-1">128</h3>
                <span className="text-[10px] text-slate-500 font-medium mt-1 inline-block">Rasio ideal 1:19</span>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>

            <div className="glass p-5 rounded-2xl flex items-center justify-between text-left">
              <div>
                <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Matakuliah</span>
                <h3 className="text-2xl font-bold text-slate-100 mt-1">{courses.length}</h3>
                <span className="text-[10px] text-slate-500 font-medium mt-1 inline-block">Tersebar di 8 Semester</span>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                <FileText className="h-6 w-6" />
              </div>
            </div>

            <div className="glass p-5 rounded-2xl flex items-center justify-between text-left">
              <div>
                <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Jadwal Aktif</span>
                <h3 className="text-2xl font-bold text-slate-100 mt-1">{schedules.length}</h3>
                <span className="text-[10px] text-emerald-400 font-medium mt-1 inline-block">Hari Senin - Jumat</span>
              </div>
              <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Quick Logs / Info panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
            <div className="glass p-6 rounded-2xl">
              <h4 className="font-bold text-slate-200 tracking-wide mb-4">Aktivitas Sistem Terbaru</h4>
              <div className="space-y-4">
                {[
                  { time: '10 menit lalu', text: 'Admin menambahkan mahasiswa baru: Lia Safitri (NIM: 2201010080)', type: 'user' },
                  { time: '1 jam lalu', text: 'Dr. Ahmad Fauzi melakukan approval KRS mahasiswa Informatika', type: 'grade' },
                  { time: '3 jam lalu', text: 'Perubahan jadwal kuliah Pemrograman Web oleh admin', type: 'schedule' }
                ].map((act, idx) => (
                  <div key={idx} className="flex gap-3 text-xs leading-relaxed">
                    <div className="mt-0.5 p-1 rounded-md bg-slate-800 text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-slate-300">{act.text}</p>
                      <span className="text-[10px] text-slate-500 font-medium mt-0.5 inline-block">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-200 tracking-wide mb-2">Informasi Penting Akademik</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pengisian Kartu Rencana Studi (KRS) untuk Semester Genap akan dibuka mulai tanggal 1 Juni 2026. 
                  Pastikan semua dosen wali telah memvalidasi nilai KHS semester sebelumnya untuk masing-masing bimbingan.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800/60 flex justify-between items-center text-xs text-slate-400">
                <span>Periode: 2025/2026 Genap</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold uppercase tracking-wider text-[10px]">
                  Aktif
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- USERS TAB --- */}
      {activeTab === 'users' && (
        <div className="space-y-4 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
              <input
                type="text"
                placeholder="Cari user berdasarkan nama atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <Button 
              variant="primary" 
              icon={UserPlus} 
              onClick={() => setIsUserModalOpen(true)}
              className="shadow-md"
            >
              Tambah Pengguna
            </Button>
          </div>

          <Table
            columns={[
              { header: 'Nama Lengkap', key: 'name', render: (val, row) => (
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-indigo-600/10 text-indigo-400 font-bold flex items-center justify-center text-sm uppercase">
                    {val.charAt(0)}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200 block">{val}</span>
                    <span className="text-[10px] text-slate-500">{row.email}</span>
                  </div>
                </div>
              )},
              { header: 'Peran', key: 'role', render: (val) => (
                <span className={`inline-flex px-2 py-0.5 text-[10px] font-semibold border rounded-md uppercase tracking-wider ${
                  val === 'dosen' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                }`}>
                  {val}
                </span>
              )},
              { header: 'Keterangan/NIM/NIDN', key: 'detail' },
              { header: 'Aksi', key: 'id', className: 'text-right', render: (val) => (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteUser(val)}
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-1.5 rounded-lg"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </Button>
              )}
            ]}
            data={filteredUsers}
          />
        </div>
      )}

      {/* --- COURSES TAB --- */}
      {activeTab === 'courses' && (
        <div className="space-y-4 text-left">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-200">Daftar Matakuliah Master</h3>
            <Button 
              variant="primary" 
              icon={Plus} 
              onClick={() => setIsCourseModalOpen(true)}
            >
              Tambah Matakuliah
            </Button>
          </div>

          <Table
            columns={[
              { header: 'Kode MK', key: 'code', className: 'font-mono text-slate-400' },
              { header: 'Nama Matakuliah', key: 'name', className: 'font-semibold text-slate-200' },
              { header: 'Bobot SKS', key: 'sks', render: (val) => `${val} SKS` },
              { header: 'Rekomendasi Semester', key: 'semester', render: (val) => `Semester ${val}` },
              { header: 'Aksi', key: 'id', className: 'text-right', render: (val) => (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteCourse(val)}
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-1.5 rounded-lg"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </Button>
              )}
            ]}
            data={courses}
          />
        </div>
      )}

      {/* --- SCHEDULES TAB --- */}
      {activeTab === 'schedules' && (
        <div className="space-y-4 text-left">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-200">Jadwal Kuliah Aktif</h3>
            <Button 
              variant="primary" 
              icon={Plus} 
              onClick={() => setIsScheduleModalOpen(true)}
            >
              Buat Jadwal Kuliah
            </Button>
          </div>

          <Table
            columns={[
              { header: 'Matakuliah', key: 'courseName', className: 'font-semibold text-slate-200' },
              { header: 'Dosen Pengajar', key: 'lecturer' },
              { header: 'Waktu Perkulihan', key: 'day', render: (_, row) => (
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span>{row.day}, {row.time}</span>
                </div>
              )},
              { header: 'Ruangan', key: 'room', render: (val) => (
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="h-4 w-4 text-slate-600" />
                  <span>{val}</span>
                </div>
              )},
              { header: 'Aksi', key: 'id', className: 'text-right', render: (val) => (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteSchedule(val)}
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-1.5 rounded-lg"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </Button>
              )}
            ]}
            data={schedules}
          />
        </div>
      )}

      {/* --- ADD USER MODAL --- */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title="Tambah Pengguna Baru"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsUserModalOpen(false)}>Batal</Button>
            <Button variant="primary" type="submit" form="user-form">Simpan User</Button>
          </>
        }
      >
        <form id="user-form" onSubmit={handleAddUser}>
          <InputForm
            label="Nama Lengkap"
            name="name"
            placeholder="Masukkan nama lengkap dengan gelar..."
            value={userForm.name}
            onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
            required
          />
          <InputForm
            label="Alamat Email"
            name="email"
            type="email"
            placeholder="nama@sia.ac.id"
            value={userForm.email}
            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <InputForm
              label="Peran Pengguna"
              name="role"
              type="select"
              options={[
                { label: 'Mahasiswa', value: 'mahasiswa' },
                { label: 'Dosen Pengajar', value: 'dosen' }
              ]}
              value={userForm.role}
              onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
            />
            <InputForm
              label={userForm.role === 'dosen' ? 'NIDN' : 'NIM'}
              name="number"
              placeholder={userForm.role === 'dosen' ? 'Contoh: 0420088501' : 'Contoh: 2201010045'}
              value={userForm.number}
              onChange={(e) => setUserForm({ ...userForm, number: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>

      {/* --- ADD COURSE MODAL --- */}
      <Modal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        title="Tambah Matakuliah Baru"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCourseModalOpen(false)}>Batal</Button>
            <Button variant="primary" type="submit" form="course-form">Simpan Matakuliah</Button>
          </>
        }
      >
        <form id="course-form" onSubmit={handleAddCourse}>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <InputForm
                label="Kode MK"
                name="code"
                placeholder="IF2204"
                value={courseForm.code}
                onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                required
              />
            </div>
            <div className="col-span-2">
              <InputForm
                label="Nama Matakuliah"
                name="name"
                placeholder="Contoh: Pemrograman Web Lanjut"
                value={courseForm.name}
                onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputForm
              label="Bobot SKS"
              name="sks"
              type="select"
              options={[
                { label: '1 SKS', value: 1 },
                { label: '2 SKS', value: 2 },
                { label: '3 SKS', value: 3 },
                { label: '4 SKS', value: 4 }
              ]}
              value={courseForm.sks}
              onChange={(e) => setCourseForm({ ...courseForm, sks: e.target.value })}
            />
            <InputForm
              label="Rekomendasi Semester"
              name="semester"
              type="select"
              options={[...Array(8)].map((_, i) => ({ label: `Semester ${i + 1}`, value: i + 1 }))}
              value={courseForm.semester}
              onChange={(e) => setCourseForm({ ...courseForm, semester: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* --- ADD SCHEDULE MODAL --- */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Buat Jadwal Kuliah Baru"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsScheduleModalOpen(false)}>Batal</Button>
            <Button variant="primary" type="submit" form="schedule-form">Jadwalkan Kuliah</Button>
          </>
        }
      >
        <form id="schedule-form" onSubmit={handleAddSchedule}>
          <InputForm
            label="Pilih Matakuliah"
            name="courseId"
            type="select"
            options={[
              { label: '-- Pilih Matakuliah --', value: '' },
              ...courses.map(c => ({ label: `${c.code} - ${c.name}`, value: c.id }))
            ]}
            value={scheduleForm.courseId}
            onChange={(e) => setScheduleForm({ ...scheduleForm, courseId: e.target.value })}
            required
          />
          <InputForm
            label="Dosen Pengajar"
            name="lecturerId"
            type="select"
            options={[
              { label: '-- Pilih Dosen --', value: '' },
              ...users.filter(u => u.role === 'dosen').map(d => ({ label: d.name, value: d.id }))
            ]}
            value={scheduleForm.lecturerId}
            onChange={(e) => setScheduleForm({ ...scheduleForm, lecturerId: e.target.value })}
            required
          />
          <div className="grid grid-cols-3 gap-4">
            <InputForm
              label="Hari"
              name="day"
              type="select"
              options={[
                { label: 'Senin', value: 'Senin' },
                { label: 'Selasa', value: 'Selasa' },
                { label: 'Rabu', value: 'Rabu' },
                { label: 'Kamis', value: 'Kamis' },
                { label: 'Jumat', value: 'Jumat' },
                { label: 'Sabtu', value: 'Sabtu' }
              ]}
              value={scheduleForm.day}
              onChange={(e) => setScheduleForm({ ...scheduleForm, day: e.target.value })}
            />
            <InputForm
              label="Jam Kuliah"
              name="time"
              placeholder="08:00 - 10:30"
              value={scheduleForm.time}
              onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
              required
            />
            <InputForm
              label="Ruangan"
              name="room"
              placeholder="Lab 3 / R-304"
              value={scheduleForm.room}
              onChange={(e) => setScheduleForm({ ...scheduleForm, room: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
