import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import api from '../../services/api';

export const MahasiswaDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.endsWith('/krs')) return 'krs';
    if (path.endsWith('/khs')) return 'khs';
    if (path.endsWith('/ukt')) return 'ukt';
    return 'overview';
  };
  const activeTab = getActiveTab();

  const setActiveTab = (tab) => {
    if (tab === 'overview') navigate('/mahasiswa');
    else navigate(`/mahasiswa/${tab}`);
  };

  // --- DATABASE STATE ---
  const [profile, setProfile] = useState(null);
  const [krsOfferings, setKrsOfferings] = useState([]);
  const [enrolledKrs, setEnrolledKrs] = useState([]);
  const [khsRecords, setKhsRecords] = useState([]);
  const [uktBill, setUktBill] = useState({
    amount: 5500000,
    dueDate: '2026-06-15',
    status: 'BELUM BAYAR',
    vaNumber: '',
    bank: 'Bank Mandiri'
  });

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isKrsAlert, setIsKrsAlert] = useState('');
  const [isPaySuccess, setIsPaySuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch all mahasiswa portal data
  const fetchMahasiswaData = async () => {
    setLoading(true);
    try {
      const [profileRes, offeringsRes, selectedRes, khsRes, uktRes] = await Promise.all([
        api.get('/mahasiswa/profile'),
        api.get('/mahasiswa/krs/offerings'),
        api.get('/mahasiswa/krs/selected'),
        api.get('/mahasiswa/khs'),
        api.get('/mahasiswa/ukt')
      ]);
      setProfile(profileRes.data);
      setKrsOfferings(offeringsRes.data);
      setEnrolledKrs(selectedRes.data);
      setKhsRecords(khsRes.data);
      setUktBill(uktRes.data);
    } catch (err) {
      console.error('Error fetching mahasiswa data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMahasiswaData();
  }, []);

  // Constants
  const activeStudent = profile || user;
  const maxSksLimit = activeStudent?.ips >= 3.0 ? 24 : activeStudent?.ips >= 2.0 ? 20 : 18;
  const currentSksTotal = enrolledKrs.reduce((acc, curr) => acc + curr.sks, 0);

  // --- KRS ACTIONS ---
  const handleEnrollKrs = async (course) => {
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

    try {
      await api.post('/mahasiswa/krs/select', { courseId: course.id });
      // Reload enrolled KRS
      const selectedRes = await api.get('/mahasiswa/krs/selected');
      setEnrolledKrs(selectedRes.data);
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Gagal menambahkan KRS.';
      setIsKrsAlert(errMsg);
    }
  };

  const handleDropKrs = async (id) => {
    setIsKrsAlert('');
    try {
      await api.delete(`/mahasiswa/krs/select/${id}`);
      // Reload enrolled KRS
      const selectedRes = await api.get('/mahasiswa/krs/selected');
      setEnrolledKrs(selectedRes.data);
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Gagal menghapus KRS.';
      setIsKrsAlert(errMsg);
    }
  };

  // --- UKT ACTIONS ---
  const handlePayUktSubmit = async () => {
    try {
      await api.post('/mahasiswa/ukt/pay');
      // Reload UKT status
      const uktRes = await api.get('/mahasiswa/ukt');
      setUktBill(uktRes.data);
      setIsPaySuccess(true);
      setIsPayModalOpen(false);
      setTimeout(() => setIsPaySuccess(false), 5000);
    } catch (err) {
      alert('Gagal memproses pembayaran UKT.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-850 m-0">Dashboard Mahasiswa</h1>
          <p className="text-sm text-stone-500 mt-1">
            Portal Akademik Universitas. Halo, <strong>{activeStudent?.name}</strong> (NIM: {activeStudent?.nim}).
          </p>
        </div>

      </div>

      {/* --- OVERVIEW TAB --- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="glass p-5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-550 font-semibold tracking-wider uppercase">IPK Kumulatif</span>
                <h3 className="text-2xl font-bold text-stone-800 mt-1">{activeStudent?.ipk}</h3>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> Sangat Memuaskan
                </span>
              </div>
              <div className="p-3 bg-terracotta-50 rounded-xl text-terracotta-600">
                <Award className="h-6 w-6" />
              </div>
            </div>

            <div className="glass p-5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-550 font-semibold tracking-wider uppercase">IPS Semester Lalu</span>
                <h3 className="text-2xl font-bold text-stone-800 mt-1">{activeStudent?.ips}</h3>
                <span className="text-[10px] text-terracotta-600 font-medium mt-1 inline-block">Jatah SKS: {maxSksLimit} SKS</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>

            <div className="glass p-5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-550 font-semibold tracking-wider uppercase">SKS Diambil</span>
                <h3 className="text-2xl font-bold text-stone-800 mt-1">{currentSksTotal} SKS</h3>
                <span className="text-[10px] text-stone-505 font-medium mt-1 inline-block">Batas semester: {maxSksLimit} SKS</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                <FileText className="h-6 w-6" />
              </div>
            </div>

            <div className="glass p-5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-550 font-semibold tracking-wider uppercase">Tagihan UKT</span>
                <h3 className="text-xl font-bold text-stone-800 mt-1.5">{formatCurrency(uktBill.amount)}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 mt-1.5 inline-block rounded-md border ${uktBill.status === 'LUNAS'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200/50 animate-pulse'
                  }`}>
                  {uktBill.status}
                </span>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
                <CreditCard className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Profile details */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="font-bold text-stone-800 tracking-wide mb-4">Biodata Akademik Mahasiswa</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5 text-sm">
              <div className="flex justify-between py-1.5 border-b border-stone-200/60">
                <span className="text-stone-500">Nama Lengkap</span>
                <span className="font-medium text-stone-700">{activeStudent?.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-200/60">
                <span className="text-stone-550">Nomor Induk Mahasiswa</span>
                <span className="font-medium font-mono text-stone-700">{activeStudent?.nim}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-200/60">
                <span className="text-stone-500">Fakultas / Departemen</span>
                <span className="font-medium text-stone-700">{activeStudent?.faculty} / {activeStudent?.department}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-200/60">
                <span className="text-stone-500">Semester Berjalan</span>
                <span className="font-medium text-stone-700">Semester {activeStudent?.semester} ({activeStudent?.academicYear})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-200/60">
                <span className="text-stone-500">Dosen Wali</span>
                <span className="font-medium text-stone-700">Dr. Ahmad Fauzi, M.T.</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-200/60">
                <span className="text-stone-500">Status Keaktifan</span>
                <span className="font-semibold text-emerald-600">AKTIF</span>
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
            <div className="flex items-center gap-2.5 p-3.5 bg-rose-55 border border-rose-200 rounded-xl text-rose-700 text-xs animate-fade-in">
              <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
              <span>{isKrsAlert}</span>
            </div>
          )}

          {/* SKS Summary Header */}
          <div className="glass p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h3 className="font-bold text-stone-800">Rencana Studi Semester {activeStudent?.semester}</h3>
              <p className="text-xs text-stone-500 mt-1">Batas SKS Maksimum: <strong>{maxSksLimit} SKS</strong> (Berdasarkan IPS Semester lalu: {activeStudent?.ips})</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-stone-400 block">SKS Terpilih</span>
                <span className="text-lg font-extrabold text-terracotta-600">{currentSksTotal} / {maxSksLimit} SKS</span>
              </div>
              <div className="h-10 w-px bg-stone-200" />
              <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1.5">
                <FileText className="h-4 w-4" /> Cetak KRS
              </Button>
            </div>
          </div>

          {/* KRS Enrollment Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Offerings List */}
            <div className="lg:col-span-7 space-y-4">
              <h4 className="font-bold text-stone-750">Daftar Matakuliah Ditawarkan</h4>
              <Table
                columns={[
                  {
                    header: 'Kode / Nama', key: 'name', render: (_, row) => (
                      <div>
                        <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">{row.code}</span>
                        <span className="font-semibold text-stone-800 block">{row.name}</span>
                        <span className="text-[10px] text-stone-500">{row.lecturer}</span>
                      </div>
                    )
                  },
                  { header: 'SKS', key: 'sks', render: (val) => `${val} SKS`, className: 'font-semibold text-stone-700' },
                  {
                    header: 'Jadwal', key: 'day', render: (_, row) => (
                      <div className="text-[11px] text-stone-500">
                        <div>{row.day}, {row.time}</div>
                        <div className="text-stone-400 font-mono text-[10px] mt-0.5">{row.room}</div>
                      </div>
                    )
                  },
                  {
                    header: 'Aksi', key: 'id', className: 'text-right', render: (_, row) => (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEnrollKrs(row)}
                        className="text-terracotta-600 hover:text-terracotta-700 hover:bg-terracotta-50 p-1.5 rounded-lg"
                      >
                        <Plus className="h-4.5 w-4.5" />
                      </Button>
                    )
                  }
                ]}
                data={krsOfferings}
              />
            </div>

            {/* Right: Enrolled List */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className="font-bold text-stone-750">KRS Sementara Anda ({enrolledKrs.length} MK)</h4>
              <div className="glass p-5 rounded-2xl space-y-3.5 max-h-[500px] overflow-y-auto">
                {enrolledKrs.length === 0 ? (
                  <p className="text-xs text-stone-450 py-10 text-center font-medium">Belum ada matakuliah diambil.</p>
                ) : (
                  enrolledKrs.map((item) => (
                    <div key={item.id} className="p-3.5 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-3 animate-fade-in">
                      <div className="text-left flex-1 min-w-0">
                        <span className="text-[9px] font-bold text-terracotta-600 font-mono block uppercase">{item.code} • {item.sks} SKS</span>
                        <h5 className="font-bold text-stone-850 mt-1 text-xs truncate">{item.name}</h5>
                        <p className="text-[10px] text-stone-500 mt-0.5 truncate">{item.day}, {item.time} ({item.room})</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDropKrs(item.id)}
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg flex-shrink-0"
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
              <h3 className="font-bold text-stone-800">Kartu Hasil Studi (KHS)</h3>
              <p className="text-xs text-stone-505 mt-1">Menampilkan transkrip nilai akademik dari semester sebelumnya.</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-400 block">IPS Semester Lalu</span>
              <span className="text-lg font-extrabold text-emerald-600">{activeStudent?.ips}</span>
            </div>
          </div>

          <Table
            columns={[
              { header: 'Kode MK', key: 'code', className: 'font-mono text-stone-400' },
              { header: 'Matakuliah', key: 'name', className: 'font-semibold text-stone-800' },
              { header: 'SKS', key: 'sks', className: 'font-semibold text-stone-700' },
              { header: 'Nilai Angka', key: 'score', className: 'font-mono text-stone-700' },
              {
                header: 'Grade Huruf', key: 'grade', render: (val) => (
                  <span className={`inline-block font-bold px-2 py-0.5 rounded text-xs border ${val.startsWith('A') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-terracotta-50 text-terracotta-700 border border-terracotta-200'
                    }`}>
                    {val}
                  </span>
                )
              }
            ]}
            data={khsRecords}
          />
        </div>
      )}

      {/* --- UKT BILLING TAB --- */}
      {activeTab === 'ukt' && (
        <div className="space-y-5">          {/* Pay Success Alerts */}
          {isPaySuccess && (
            <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs animate-fade-in">
              <Check className="h-4.5 w-4.5 flex-shrink-0" />
              <span>Pembayaran UKT Sukses! Status tagihan Anda diperbarui menjadi LUNAS.</span>
            </div>
          )}

          {/* Billing card details */}
          <div className="glass p-6 rounded-2xl max-w-xl">
            <h3 className="font-bold text-stone-800 tracking-wide mb-5">Rincian Uang Kuliah Tunggal (UKT)</h3>

            <div className="space-y-4 text-sm text-stone-600">
              <div className="flex justify-between py-2 border-b border-stone-200/60">
                <span className="text-stone-500">Nama Penerima</span>
                <span className="font-semibold text-stone-700">{activeStudent?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-200/60">
                <span className="text-stone-500">NIM Mahasiswa</span>
                <span className="font-mono font-medium text-stone-700">{activeStudent?.nim}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-200/60">
                <span className="text-stone-550">Tahun Akademik</span>
                <span className="font-medium text-stone-700">{activeStudent?.academicYear}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-200/60">
                <span className="text-stone-500">Tanggal Jatuh Tempo</span>
                <span className="font-medium text-stone-700">{formatDate(uktBill.dueDate)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-200/60">
                <span className="text-stone-500">Jumlah Tagihan</span>
                <span className="font-extrabold text-stone-800">{formatCurrency(uktBill.amount)}</span>
              </div>
              <div className="flex justify-between py-2.5 items-center">
                <span className="text-stone-500">Status Pembayaran</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${uktBill.status === 'LUNAS'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200/50'
                  }`}>
                  {uktBill.status}
                </span>
              </div>
            </div>

            {uktBill.status === 'BELUM BAYAR' && (
              <div className="mt-6 pt-6 border-t border-stone-200/60">
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
          <p className="text-xs text-stone-500 leading-relaxed">
            Gunakan rincian Virtual Account (VA) di bawah ini untuk mentransfer via Mobile Banking, Internet Banking, atau ATM Anda.
          </p>

          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Metode Pembayaran</span>
              <span className="font-semibold text-stone-800">{uktBill.bank} VA</span>
            </div>

            <div className="flex items-center justify-between py-1 border-t border-b border-stone-200/60">
              <span className="text-xs text-stone-500">Nomor Virtual Account</span>
              <span className="font-mono font-bold text-terracotta-600 tracking-wider text-sm select-all">
                {uktBill.vaNumber}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Jumlah Transfer</span>
              <span className="font-bold text-stone-800">{formatCurrency(uktBill.amount)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs">
            <QrCode className="h-8 w-8 flex-shrink-0" />
            <span>Pembayaran ini akan langsung terverifikasi secara instan di portal SIA setelah transfer sukses disimulasikan.</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MahasiswaDashboard;
