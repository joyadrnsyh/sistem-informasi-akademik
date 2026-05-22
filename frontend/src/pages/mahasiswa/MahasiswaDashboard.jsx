import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CreditCard,
  FileText,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  QrCode,
  CheckCircle,
  Star,
  Wallet
} from 'lucide-react';
import { useMahasiswaData } from '../../hooks/useMahasiswaData';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { StatsCard } from '../../components/ui/StatsCard';
import { WelcomeBanner } from '../../components/dashboard/WelcomeBanner';
import { QuickAccess } from '../../components/dashboard/QuickAccess';
import { ScheduleList } from '../../components/dashboard/ScheduleList';
import { AnnouncementList } from '../../components/dashboard/AnnouncementList';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

export const MahasiswaDashboard = () => {
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

  const {
    krsOfferings,
    enrolledKrs,
    khsRecords,
    uktBill,
    isPayModalOpen,
    setIsPayModalOpen,
    isKrsAlert,
    isPaySuccess,
    activeStudent,
    maxSksLimit,
    currentSksTotal,
    handleEnrollKrs,
    handleDropKrs,
    handlePayUktSubmit
  } = useMahasiswaData();

  return (
    <div className="space-y-2 animate-fade-in text-left">
      {/* --- OVERVIEW TAB --- */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Welcome Banner Card */}
          <WelcomeBanner studentName={activeStudent?.name} />

          {/* 4 Stats Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatsCard
              icon={BookOpen}
              label="Mata Kuliah Diambil"
              value="20"
              subLabel="SKS"
              iconBgClassName="bg-blue-50 text-blue-600"
            />
            <StatsCard
              icon={CheckCircle}
              label="Mata Kuliah Lulus"
              value="45"
              subLabel="SKS"
              iconBgClassName="bg-emerald-50 text-emerald-600"
            />
            <StatsCard
              icon={Star}
              label="IPK"
              value={activeStudent?.ipk || '3.72'}
              subLabel="/ 4.00"
              iconBgClassName="bg-purple-50 text-purple-600"
              iconClassName="fill-purple-100"
            />
            <StatsCard
              icon={Wallet}
              label="Tagihan"
              value={formatCurrency(uktBill.amount)}
              subLabel={uktBill.status === 'LUNAS' ? 'Lunas' : 'Belum dibayar'}
              subLabelPosition="block"
              iconBgClassName="bg-amber-50 text-amber-600"
            />
          </div>

          {/* Main Content Area: Unified 12-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

            {/* KRS Doughnut Chart Card - Row 1, Col 1-4 */}
            <div className="lg:col-span-4 md:col-span-6 bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="text-sm font-bold text-stone-850">KRS Semester Ini</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('krs')}
                  className="text-[10px] text-[#1d6cf0] border-blue-200 px-2.5 py-1"
                >
                  Lihat Detail
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-5 flex-1">
                {/* Doughnut SVG Chart */}
                <div className="relative flex items-center justify-center w-32 h-32 flex-shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {/* Track circle */}
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="11" />

                    {/* Wajib Segment (12 SKS = 60% of 20 SKS) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#1d6cf0"
                      strokeWidth="11"
                      strokeDasharray="251.2"
                      strokeDashoffset="100.48"
                    />

                    {/* Pilihan Segment (6 SKS = 30%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="11"
                      strokeDasharray="251.2"
                      strokeDashoffset="175.84"
                      transform="rotate(216 50 50)"
                    />

                    {/* Praktikum Segment (2 SKS = 10%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#8b5cf6"
                      strokeWidth="11"
                      strokeDasharray="251.2"
                      strokeDashoffset="226.08"
                      transform="rotate(324 50 50)"
                    />
                  </svg>
                  {/* Inside Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-extrabold text-stone-800 leading-none">20</span>
                    <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider mt-1">SKS</span>
                  </div>
                </div>

                {/* Legends */}
                <div className="flex-1 space-y-2.5 text-[11px] w-full text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#1d6cf0]" />
                      <span className="text-stone-500 font-medium">Mata Kuliah Wajib</span>
                    </div>
                    <span className="font-bold text-stone-700">12 SKS</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                      <span className="text-stone-500 font-medium">Mata Kuliah Pilihan</span>
                    </div>
                    <span className="font-bold text-stone-700">6 SKS</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
                      <span className="text-stone-500 font-medium">Mata Kuliah Praktikum</span>
                    </div>
                    <span className="font-bold text-stone-700">2 SKS</span>
                  </div>
                  <div className="h-px bg-stone-100 my-1.5" />
                  <div className="flex items-center justify-between font-bold text-stone-800">
                    <span>Total</span>
                    <span>20 SKS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* IPK per Semester Chart Card - Row 1, Col 5-8 */}
            <div className="lg:col-span-4 md:col-span-6 bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="text-sm font-bold text-stone-850">IPK per Semester</h3>
                <Select
                  options={['5 Semester Terakhir']}
                  selectSize="sm"
                  variant="flat"
                />
              </div>

              {/* SVG Line Chart */}
              <div className="mt-5 relative w-full h-32 flex-1 flex items-center">
                <svg viewBox="0 0 320 140" className="w-full h-full">
                  {/* Grid Lines */}
                  <line x1="20" y1="20" x2="300" y2="20" stroke="#f8fafc" strokeWidth="1" />
                  <line x1="20" y1="50" x2="300" y2="50" stroke="#f8fafc" strokeWidth="1" />
                  <line x1="20" y1="80" x2="300" y2="80" stroke="#f8fafc" strokeWidth="1" />
                  <line x1="20" y1="110" x2="300" y2="110" stroke="#f8fafc" strokeWidth="1" />

                  {/* Blue Line Graph */}
                  <path
                    d="M 30 75 L 95 62 L 160 56 L 225 44 L 290 32"
                    fill="none"
                    stroke="#1d6cf0"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Dots and Value Labels */}
                  {/* Pt 1 */}
                  <circle cx="30" cy="75" r="4.5" fill="#1d6cf0" stroke="#ffffff" strokeWidth="2.5" />
                  <text x="30" y="63" textAnchor="middle" className="text-[10px] font-extrabold fill-stone-850">3.10</text>
                  <text x="30" y="125" textAnchor="middle" className="text-[8px] font-bold fill-stone-400">2021/2022</text>
                  <text x="30" y="133" textAnchor="middle" className="text-[8px] font-bold fill-stone-400">Ganjil</text>

                  {/* Pt 2 */}
                  <circle cx="95" cy="62" r="4.5" fill="#1d6cf0" stroke="#ffffff" strokeWidth="2.5" />
                  <text x="95" y="50" textAnchor="middle" className="text-[10px] font-extrabold fill-stone-850">3.35</text>
                  <text x="95" y="125" textAnchor="middle" className="text-[8px] font-bold fill-stone-400">2021/2022</text>
                  <text x="95" y="133" textAnchor="middle" className="text-[8px] font-bold fill-stone-400">Genap</text>

                  {/* Pt 3 */}
                  <circle cx="160" cy="56" r="4.5" fill="#1d6cf0" stroke="#ffffff" strokeWidth="2.5" />
                  <text x="160" y="44" textAnchor="middle" className="text-[10px] font-extrabold fill-stone-850">3.45</text>
                  <text x="160" y="125" textAnchor="middle" className="text-[8px] font-bold fill-stone-400">2022/2023</text>
                  <text x="160" y="133" textAnchor="middle" className="text-[8px] font-bold fill-stone-400">Ganjil</text>

                  {/* Pt 4 */}
                  <circle cx="225" cy="44" r="4.5" fill="#1d6cf0" stroke="#ffffff" strokeWidth="2.5" />
                  <text x="225" y="32" textAnchor="middle" className="text-[10px] font-extrabold fill-stone-850">3.60</text>
                  <text x="225" y="125" textAnchor="middle" className="text-[8px] font-bold fill-stone-400">2022/2023</text>
                  <text x="225" y="133" textAnchor="middle" className="text-[8px] font-bold fill-stone-400">Genap</text>

                  {/* Pt 5 */}
                  <circle cx="290" cy="32" r="4.5" fill="#1d6cf0" stroke="#ffffff" strokeWidth="2.5" />
                  <text x="290" y="20" textAnchor="middle" className="text-[10px] font-extrabold fill-stone-850">3.72</text>
                  <text x="290" y="125" textAnchor="middle" className="text-[8px] font-bold fill-stone-400">2023/2024</text>
                  <text x="290" y="133" textAnchor="middle" className="text-[8px] font-bold fill-stone-400">Ganjil</text>
                </svg>
              </div>
            </div>

            {/* Jadwal Hari Ini Card - Row 1, Col 9-12 */}
            <div className="lg:col-span-4 md:col-span-12 h-full flex flex-col">
              <ScheduleList onViewAll={() => { }} />
            </div>

            {/* Pengumuman Terbaru Card - Row 2, Col 1-4 */}
            <div className="lg:col-span-4 md:col-span-6 h-full flex flex-col">
              <AnnouncementList onViewAll={() => { }} />
            </div>

            {/* Tagihan & Pembayaran Card - Row 2, Col 5-8 */}
            <div className="lg:col-span-4 md:col-span-6 bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between text-left h-full">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="text-sm font-bold text-stone-850">Tagihan & Pembayaran</h3>
                <button
                  onClick={() => setActiveTab('ukt')}
                  className="text-[11px] text-[#1d6cf0] hover:underline font-bold cursor-pointer"
                >
                  Lihat Semua
                </button>
              </div>

              <div className="mt-4 flex-1 flex flex-col justify-between gap-4">
                {/* Orange Total Box */}
                <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-xl p-4 flex items-center justify-between text-left">
                  <div>
                    <span className="text-[10px] text-stone-500 font-bold block">Total Tagihan</span>
                    <span className="text-lg font-extrabold text-stone-850 mt-0.5 block">
                      {formatCurrency(uktBill.amount)}
                    </span>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${uktBill.status === 'LUNAS'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]'
                    }`}>
                    {uktBill.status === 'LUNAS' ? 'Lunas' : 'Belum Dibayar'}
                  </span>
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-2.5 text-xs text-stone-600">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500">UKT Semester Genap 2023/2024</span>
                    <span className="font-semibold text-stone-700">{formatCurrency(uktBill.amount > 450000 ? uktBill.amount - 450000 : uktBill.amount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500">Biaya Praktikum</span>
                    <span className="font-semibold text-stone-700">{uktBill.status === 'LUNAS' ? 'Rp 0' : 'Rp 300.000'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500">Biaya Lainnya</span>
                    <span className="font-semibold text-stone-700">{uktBill.status === 'LUNAS' ? 'Rp 0' : 'Rp 150.000'}</span>
                  </div>
                </div>

                {/* Pay Button */}
                {uktBill.status === 'BELUM BAYAR' ? (
                  <Button
                    variant="primary"
                    className="w-full py-2.5"
                    onClick={() => setIsPayModalOpen(true)}
                  >
                    Lakukan Pembayaran
                  </Button>
                ) : (
                  <div className="w-full py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl text-center">
                    Tagihan Sudah Lunas
                  </div>
                )}
              </div>
            </div>

            {/* Akses Cepat Card - Row 2, Col 9-12 */}
            <div className="lg:col-span-4 md:col-span-12 h-full flex flex-col">
              <QuickAccess onNavigate={setActiveTab} />
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
          <div className="glass p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="text-left">
              <h3 className="font-bold text-stone-800">Rencana Studi Semester {activeStudent?.semester}</h3>
              <p className="text-xs text-stone-500 mt-1">Batas SKS Maksimum: <strong>{maxSksLimit} SKS</strong> (Berdasarkan IPS Semester lalu: {activeStudent?.ips})</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-stone-400 block">SKS Terpilih</span>
                <span className="text-lg font-extrabold text-indigo-600">{currentSksTotal} / {maxSksLimit} SKS</span>
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
            <div className="lg:col-span-7 space-y-4 text-left">
              <h4 className="font-bold text-stone-750">Daftar Matakuliah Ditawarkan</h4>
              <Table
                columns={[
                  {
                    header: 'Kode / Nama', key: 'name', render: (_, row) => (
                      <div className="text-left">
                        <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">{row.code}</span>
                        <span className="font-semibold text-stone-800 block">{row.name}</span>
                        <span className="text-[10px] text-stone-500">{row.lecturer}</span>
                      </div>
                    )
                  },
                  { header: 'SKS', key: 'sks', render: (val) => `${val} SKS`, className: 'font-semibold text-stone-700' },
                  {
                    header: 'Jadwal', key: 'day', render: (_, row) => (
                      <div className="text-[11px] text-stone-550 text-left">
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
                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-1.5 rounded-lg"
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
            <div className="lg:col-span-5 space-y-4 text-left">
              <h4 className="font-bold text-stone-750">KRS Sementara Anda ({enrolledKrs.length} MK)</h4>
              <div className="glass p-5 rounded-2xl space-y-3.5 max-h-[500px] overflow-y-auto">
                {enrolledKrs.length === 0 ? (
                  <p className="text-xs text-stone-450 py-10 text-center font-medium">Belum ada matakuliah diambil.</p>
                ) : (
                  enrolledKrs.map((item) => (
                    <div key={item.id} className="p-3.5 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-3 animate-fade-in text-left">
                      <div className="text-left flex-1 min-w-0">
                        <span className="text-[9px] font-bold text-indigo-600 font-mono block uppercase">{item.code} • {item.sks} SKS</span>
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
        <div className="space-y-4 text-left">
          <div className="glass p-5 rounded-2xl flex justify-between items-center text-left">
            <div className="text-left">
              <h3 className="font-bold text-stone-800">Kartu Hasil Studi (KHS)</h3>
              <p className="text-xs text-stone-500 mt-1">Menampilkan transkrip nilai akademik dari semester sebelumnya.</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-400 block">IPS Semester Lalu</span>
              <span className="text-lg font-extrabold text-emerald-600">{activeStudent?.ips}</span>
            </div>
          </div>

          <Table
            columns={[
              { header: 'Kode MK', key: 'code', className: 'font-mono text-stone-400 text-left' },
              { header: 'Matakuliah', key: 'name', className: 'font-semibold text-stone-800 text-left' },
              { header: 'SKS', key: 'sks', className: 'font-semibold text-stone-705 text-left' },
              { header: 'Nilai Angka', key: 'score', className: 'font-mono text-stone-705 text-left' },
              {
                header: 'Grade Huruf', key: 'grade', className: 'text-left', render: (val) => (
                  <span className={`inline-block font-bold px-2 py-0.5 rounded text-xs border ${val.startsWith('A') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
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
        <div className="space-y-5 text-left">
          {/* Pay Success Alerts */}
          {isPaySuccess && (
            <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs animate-fade-in">
              <Check className="h-4.5 w-4.5 flex-shrink-0" />
              <span>Pembayaran UKT Sukses! Status tagihan Anda diperbarui menjadi LUNAS.</span>
            </div>
          )}

          {/* Billing card details */}
          <div className="glass p-6 rounded-2xl max-w-xl text-left">
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
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-250'
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
          <p className="text-xs text-stone-505 leading-relaxed">
            Gunakan rincian Virtual Account (VA) di bawah ini untuk mentransfer via Mobile Banking, Internet Banking, atau ATM Anda.
          </p>

          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Metode Pembayaran</span>
              <span className="font-semibold text-stone-800">{uktBill.bank} VA</span>
            </div>

            <div className="flex items-center justify-between py-1 border-t border-b border-stone-200/60">
              <span className="text-xs text-stone-500">Nomor Virtual Account</span>
              <span className="font-mono font-bold text-indigo-600 tracking-wider text-sm select-all">
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
