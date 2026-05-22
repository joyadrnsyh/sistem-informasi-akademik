import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  CreditCard, 
  FileText, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle,
  HelpCircle,
  QrCode,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

export const MahasiswaDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // --- MOCK DATABASE STATE ---
  // KRS course offerings available to enroll
  const [krsOfferings, setKrsOfferings] = useState([
    { id: 'MK-2201', code: 'IF2204', name: 'Pemrograman Web Lanjut', sks: 3, day: 'Senin', time: '08:00 - 10:30', lecturer: 'Dr. Ahmad Fauzi, M.T.', room: 'Lab Komputer 3' },
    { id: 'MK-2202', code: 'IF2205', name: 'Basis Data Lanjut', sks: 3, day: 'Selasa', time: '13:00 - 15:30', lecturer: 'Dr. Retno Wahyuni', room: 'Ruang Teori 204' },
    { id: 'MK-2203', code: 'IF2206', name: 'Pemrograman Berorientasi Objek', sks: 4, day: 'Rabu', time: '10:00 - 13:20', lecturer: 'Ir. Hermawan, M.Kom.', room: 'Lab Komputer 1' },
    { id: 'MK-2204', code: 'IF2207', name: 'Jaringan Komputer', sks: 3, day: 'Jumat', time: '08:00 - 10:30', lecturer: 'Eko Prasetyo, M.T.', room: 'Lab Jaringan' },
    { id: 'MK-2205', code: 'IF2208', name: 'Grafika Komputer', sks: 3, day: 'Kamis', time: '13:00 - 15:30', lecturer: 'Indra Gunawan, M.T.', room: 'Ruang Teori 302' },
  ]);

  // Student's enrolled KRS list
  const [enrolledKrs, setEnrolledKrs] = useState([
    { id: 'MK-2201', code: 'IF2204', name: 'Pemrograman Web Lanjut', sks: 3, day: 'Senin', time: '08:00 - 10:30', lecturer: 'Dr. Ahmad Fauzi, M.T.', room: 'Lab Komputer 3' },
  ]);

  // Previous Semester KHS records
  const [khsRecords] = useState([
    { code: 'IF1201', name: 'Pemrograman Dasar', sks: 3, grade: 'A', score: 92 },
    { code: 'IF1202', name: 'Logika Informatika', sks: 3, grade: 'B+', score: 82 },
    { code: 'IF1203', name: 'Arsitektur Komputer', sks: 3, grade: 'A', score: 88 },
    { code: 'IF1204', name: 'Kalkulus I', sks: 3, grade: 'B', score: 76 },
    { code: 'IF1205', name: 'Interaksi Manusia Komputer', sks: 2, grade: 'A', score: 95 },
  ]);

  // UKT Status State
  const [uktBill, setUktBill] = useState({
    amount: 5500000,
    dueDate: '2026-06-15',
    status: 'BELUM BAYAR', // or 'LUNAS'
    vaNumber: '9880422010100450',
    bank: 'Bank Mandiri'
  });

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isKrsAlert, setIsKrsAlert] = useState('');
  const [isPaySuccess, setIsPaySuccess] = useState(false);

  // Constants
  const maxSksLimit = user?.ips >= 3.0 ? 24 : user?.ips >= 2.0 ? 20 : 18;
  const currentSksTotal = enrolledKrs.reduce((acc, curr) => acc + curr.sks, 0);

  // --- KRS ACTIONS ---
  const handleEnrollKrs = (course) => {
    setIsKrsAlert('');
    // Check duplicate
    if (enrolledKrs.some(item => item.id === course.id)) {
      setIsKrsAlert('Matakuliah sudah ditambahkan ke KRS Anda!');
      return;
    }
    // Check SKS limit
    if (currentSksTotal + course.sks > maxSksLimit) {
      setIsKrsAlert(`Total SKS melebihi batas maksimal SKS Anda (${maxSksLimit} SKS)!`);
      return;
    }
    setEnrolledKrs([...enrolledKrs, course]);
  };

  const handleDropKrs = (id) => {
    setIsKrsAlert('');
    setEnrolledKrs(enrolledKrs.filter(item => item.id !== id));
  };

  // --- UKT ACTIONS ---
  const handlePayUktSubmit = () => {
    setUktBill(prev => ({ ...prev, status: 'LUNAS' }));
    setIsPaySuccess(true);
    setIsPayModalOpen(false);
    setTimeout(() => setIsPaySuccess(false), 5000);
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 m-0">Dashboard Mahasiswa</h1>
          <p className="text-sm text-slate-400 mt-1">
            Portal Akademik Universitas. Halo, <strong>{user?.name}</strong> (NIM: {user?.nim}).
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800 self-start">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Profil & Studi
          </button>
          <button
            onClick={() => setActiveTab('krs')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'krs' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Rencana Studi (KRS)
          </button>
          <button
            onClick={() => setActiveTab('khs')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'khs' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Hasil Studi (KHS)
          </button>
          <button
            onClick={() => setActiveTab('ukt')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'ukt' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Tagihan UKT
          </button>
        </div>
      </div>

      {/* --- OVERVIEW TAB --- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="glass p-5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">IPK Kumulatif</span>
                <h3 className="text-2xl font-bold text-slate-100 mt-1">{user?.ipk}</h3>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> Sangat Memuaskan
                </span>
              </div>
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                <Award className="h-6 w-6" />
              </div>
            </div>

            <div className="glass p-5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">IPS Semester Lalu</span>
                <h3 className="text-2xl font-bold text-slate-100 mt-1">{user?.ips}</h3>
                <span className="text-[10px] text-indigo-400 font-medium mt-1 inline-block">Jatah SKS: {maxSksLimit} SKS</span>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>

            <div className="glass p-5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">SKS Diambil</span>
                <h3 className="text-2xl font-bold text-slate-100 mt-1">{currentSksTotal} SKS</h3>
                <span className="text-[10px] text-slate-500 font-medium mt-1 inline-block">Batas semester: {maxSksLimit} SKS</span>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                <FileText className="h-6 w-6" />
              </div>
            </div>

            <div className="glass p-5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Tagihan UKT</span>
                <h3 className="text-xl font-bold text-slate-100 mt-1.5">{formatCurrency(uktBill.amount)}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 mt-1.5 inline-block rounded-md border ${
                  uktBill.status === 'LUNAS' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse'
                }`}>
                  {uktBill.status}
                </span>
              </div>
              <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400">
                <CreditCard className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Profile details */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="font-bold text-slate-200 tracking-wide mb-4">Biodata Akademik Mahasiswa</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5 text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-500">Nama Lengkap</span>
                <span className="font-medium text-slate-200">{user?.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-500">Nomor Induk Mahasiswa</span>
                <span className="font-medium font-mono text-slate-200">{user?.nim}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-500">Fakultas / Departemen</span>
                <span className="font-medium text-slate-200">{user?.faculty} / {user?.department}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-500">Semester Berjalan</span>
                <span className="font-medium text-slate-200">Semester {user?.semester} ({user?.academicYear})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-500">Dosen Wali</span>
                <span className="font-medium text-slate-200">Dr. Ahmad Fauzi, M.T.</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-500">Status Keaktifan</span>
                <span className="font-semibold text-emerald-400">AKTIF</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- KRS TAB --- */}
      {activeTab === 'krs' && (
        <div className="space-y-6">
          {/* Alerts */}
          {isKrsAlert && (
            <div className="flex items-center gap-2.5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs animate-fade-in">
              <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
              <span>{isKrsAlert}</span>
            </div>
          )}

          {/* SKS Summary Header */}
          <div className="glass p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h3 className="font-bold text-slate-200">Rencana Studi Semester {user?.semester}</h3>
              <p className="text-xs text-slate-400 mt-1">Batas SKS Maksimum: <strong>{maxSksLimit} SKS</strong> (Berdasarkan IPS Semester lalu: {user?.ips})</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-500 block">SKS Terpilih</span>
                <span className="text-lg font-extrabold text-indigo-400">{currentSksTotal} / {maxSksLimit} SKS</span>
              </div>
              <div className="h-10 w-px bg-slate-800" />
              <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1.5">
                <FileText className="h-4 w-4" /> Cetak KRS
              </Button>
            </div>
          </div>

          {/* KRS Enrollment Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Offerings List */}
            <div className="lg:col-span-7 space-y-4">
              <h4 className="font-bold text-slate-300">Daftar Matakuliah Ditawarkan</h4>
              <Table
                columns={[
                  { header: 'Kode / Nama', key: 'name', render: (_, row) => (
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">{row.code}</span>
                      <span className="font-semibold text-slate-200 block">{row.name}</span>
                      <span className="text-[10px] text-slate-400">{row.lecturer}</span>
                    </div>
                  )},
                  { header: 'SKS', key: 'sks', render: (val) => `${val} SKS`, className: 'font-semibold' },
                  { header: 'Jadwal', key: 'day', render: (_, row) => (
                    <div className="text-[11px] text-slate-400">
                      <div>{row.day}, {row.time}</div>
                      <div className="text-slate-500 font-mono text-[10px] mt-0.5">{row.room}</div>
                    </div>
                  )},
                  { header: 'Aksi', key: 'id', className: 'text-right', render: (_, row) => (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEnrollKrs(row)}
                      className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 p-1.5 rounded-lg"
                    >
                      <Plus className="h-4.5 w-4.5" />
                    </Button>
                  )}
                ]}
                data={krsOfferings}
              />
            </div>

            {/* Right: Enrolled List */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className="font-bold text-slate-300">KRS Sementara Anda ({enrolledKrs.length} MK)</h4>
              <div className="glass p-5 rounded-2xl space-y-3.5 max-h-[500px] overflow-y-auto">
                {enrolledKrs.length === 0 ? (
                  <p className="text-xs text-slate-500 py-10 text-center font-medium">Belum ada matakuliah diambil.</p>
                ) : (
                  enrolledKrs.map((item) => (
                    <div key={item.id} className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between gap-3 animate-fade-in">
                      <div className="text-left flex-1 min-w-0">
                        <span className="text-[9px] font-bold text-indigo-400 font-mono block uppercase">{item.code} • {item.sks} SKS</span>
                        <h5 className="font-bold text-slate-200 mt-1 text-xs truncate">{item.name}</h5>
                        <p className="text-[10px] text-slate-500 mt-0.5 truncate">{item.day}, {item.time} ({item.room})</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDropKrs(item.id)}
                        className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-1.5 rounded-lg flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- KHS TAB --- */}
      {activeTab === 'khs' && (
        <div className="space-y-4">
          <div className="glass p-5 rounded-2xl flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-200">Kartu Hasil Studi (KHS)</h3>
              <p className="text-xs text-slate-400 mt-1">Menampilkan transkrip nilai akademik dari semester sebelumnya.</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">IPS Semester Lalu</span>
              <span className="text-lg font-extrabold text-emerald-400">{user?.ips}</span>
            </div>
          </div>

          <Table
            columns={[
              { header: 'Kode MK', key: 'code', className: 'font-mono text-slate-400' },
              { header: 'Matakuliah', key: 'name', className: 'font-semibold text-slate-200' },
              { header: 'SKS', key: 'sks', className: 'font-semibold' },
              { header: 'Nilai Angka', key: 'score', className: 'font-mono' },
              { header: 'Grade Huruf', key: 'grade', render: (val) => (
                <span className={`inline-block font-bold px-2 py-0.5 rounded text-xs ${
                  val.startsWith('A') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                }`}>
                  {val}
                </span>
              )}
            ]}
            data={khsRecords}
          />
        </div>
      )}

      {/* --- UKT BILLING TAB --- */}
      {activeTab === 'ukt' && (
        <div className="space-y-5">
          {/* Pay Success Alerts */}
          {isPaySuccess && (
            <div className="flex items-center gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs animate-fade-in">
              <Check className="h-4.5 w-4.5 flex-shrink-0" />
              <span>Pembayaran UKT Sukses! Status tagihan Anda diperbarui menjadi LUNAS.</span>
            </div>
          )}

          {/* Billing card details */}
          <div className="glass p-6 rounded-2xl max-w-xl">
            <h3 className="font-bold text-slate-200 tracking-wide mb-5">Rincian Uang Kuliah Tunggal (UKT)</h3>
            
            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex justify-between py-2 border-b border-slate-800/60">
                <span className="text-slate-500">Nama Penerima</span>
                <span className="font-semibold text-slate-200">{user?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/60">
                <span className="text-slate-500">NIM Mahasiswa</span>
                <span className="font-mono font-medium text-slate-200">{user?.nim}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/60">
                <span className="text-slate-500">Tahun Akademik</span>
                <span className="font-medium text-slate-200">{user?.academicYear}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/60">
                <span className="text-slate-500">Tanggal Jatuh Tempo</span>
                <span className="font-medium text-slate-200">{formatDate(uktBill.dueDate)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/60">
                <span className="text-slate-500">Jumlah Tagihan</span>
                <span className="font-extrabold text-slate-100">{formatCurrency(uktBill.amount)}</span>
              </div>
              <div className="flex justify-between py-2.5 items-center">
                <span className="text-slate-500">Status Pembayaran</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${
                  uktBill.status === 'LUNAS' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {uktBill.status}
                </span>
              </div>
            </div>

            {uktBill.status === 'BELUM BAYAR' && (
              <div className="mt-6 pt-6 border-t border-slate-800/60">
                <Button 
                  variant="primary" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => setIsPayModalOpen(true)}
                >
                  <CreditCard className="h-4.5 w-4.5" />
                  Bayar UKT Sekarang
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- PAY UKT SIMULATOR MODAL --- */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Pembayaran UKT (Virtual Account)"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsPayModalOpen(false)}>Batal</Button>
            <Button variant="success" onClick={handlePayUktSubmit}>Simulasikan Pembayaran Sukses</Button>
          </>
        }
      >
        <div className="space-y-4 text-left">
          <p className="text-xs text-slate-400 leading-relaxed">
            Gunakan rincian Virtual Account (VA) di bawah ini untuk mentransfer via Mobile Banking, Internet Banking, atau ATM Anda.
          </p>
          
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Metode Pembayaran</span>
              <span className="font-semibold text-slate-200">{uktBill.bank} VA</span>
            </div>
            
            <div className="flex items-center justify-between py-1 border-t border-b border-slate-850/60">
              <span className="text-xs text-slate-400">Nomor Virtual Account</span>
              <span className="font-mono font-bold text-indigo-400 tracking-wider text-sm select-all">
                {uktBill.vaNumber}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Jumlah Transfer</span>
              <span className="font-bold text-slate-200">{formatCurrency(uktBill.amount)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-xs">
            <QrCode className="h-8 w-8 flex-shrink-0" />
            <span>Pembayaran ini akan langsung terverifikasi secara instan di portal SIA setelah transfer sukses disimulasikan.</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MahasiswaDashboard;
