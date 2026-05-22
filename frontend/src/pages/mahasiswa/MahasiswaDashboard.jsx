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
  ExternalLink,
  CheckCircle,
  Star,
  Wallet,
  Megaphone,
  ChevronDown,
  GraduationCap
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
      {/* --- OVERVIEW TAB --- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Welcome Banner Card */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
            <div className="text-left">
              <h2 className="text-xl md:text-2xl font-bold text-stone-850">
                Selamat pagi, {activeStudent?.name || 'Andi Pratama'}! 👋
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Berikut informasi aktivitas akademik Anda hari ini.
              </p>
            </div>
            <div>
              <div className="relative inline-block">
                <select className="appearance-none bg-white border border-stone-200 hover:border-stone-300 px-4 py-2 pr-10 rounded-xl text-xs font-bold text-stone-600 shadow-sm focus:outline-none cursor-pointer">
                  <option>Semester Genap 2023/2024</option>
                  <option>Semester Ganjil 2023/2024</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-400">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          {/* 4 Stats Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Widget 1: Mata Kuliah Diambil */}
            <div className="bg-white border border-stone-200/80 p-5 rounded-2xl flex items-center gap-4 shadow-xs">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Mata Kuliah Diambil</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-stone-800">20</span>
                  <span className="text-[10px] text-stone-400 font-bold uppercase">SKS</span>
                </div>
              </div>
            </div>

            {/* Widget 2: Mata Kuliah Lulus */}
            <div className="bg-white border border-stone-200/80 p-5 rounded-2xl flex items-center gap-4 shadow-xs">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Mata Kuliah Lulus</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-stone-800">45</span>
                  <span className="text-[10px] text-stone-400 font-bold uppercase">SKS</span>
                </div>
              </div>
            </div>

            {/* Widget 3: IPK */}
            <div className="bg-white border border-stone-200/80 p-5 rounded-2xl flex items-center gap-4 shadow-xs">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                <Star className="h-6 w-6 fill-purple-100" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">IPK</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-stone-800">{activeStudent?.ipk || '3.72'}</span>
                  <span className="text-[9px] text-stone-400 font-bold">/ 4.00</span>
                </div>
              </div>
            </div>

            {/* Widget 4: Tagihan */}
            <div className="bg-white border border-stone-200/80 p-5 rounded-2xl flex items-center gap-4 shadow-xs">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <Wallet className="h-6 w-6" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Tagihan</span>
                <span className="text-lg font-extrabold text-stone-800 mt-1 block">
                  {formatCurrency(uktBill.amount)}
                </span>
                <span className="text-[9px] text-stone-400 font-semibold block mt-0.5">Belum dibayar</span>
              </div>
            </div>
          </div>

          {/* Main Content Area: 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column (Wide) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Row 1: KRS Doughnut Chart & IPK Line Chart */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* KRS Doughnut Chart Card */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <h3 className="text-sm font-bold text-stone-850">KRS Semester Ini</h3>
                    <button 
                      onClick={() => setActiveTab('krs')}
                      className="text-[10px] text-[#1d6cf0] hover:text-[#1d6cf0]/80 border border-blue-200 px-2.5 py-1 rounded-lg font-bold transition-colors"
                    >
                      Lihat Detail
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-5">
                    {/* Doughnut SVG Chart */}
                    <div className="relative flex items-center justify-center w-32 h-32 flex-shrink-0">
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        {/* Track circle */}
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="11" />
                        
                        {/* Wajib Segment (12 SKS = 60% of 20 SKS) -> strokeDasharray="251.2" (2 * pi * 40)
                            60% = 150.72 stroke length
                        */}
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="40" 
                          fill="transparent" 
                          stroke="#1d6cf0" 
                          strokeWidth="11" 
                          strokeDasharray="251.2" 
                          strokeDashoffset="100.48" // 251.2 * (1 - 0.6)
                        />

                        {/* Pilihan Segment (6 SKS = 30%)
                            30% = 75.36 stroke length.
                            Starts after Wajib (60%). Rotate 216 deg (360 * 0.6)
                        */}
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="40" 
                          fill="transparent" 
                          stroke="#10b981" 
                          strokeWidth="11" 
                          strokeDasharray="251.2" 
                          strokeDashoffset="175.84" // 251.2 * (1 - 0.3)
                          transform="rotate(216 50 50)"
                        />

                        {/* Praktikum Segment (2 SKS = 10%)
                            10% = 25.12 stroke length.
                            Starts after Pilihan (90%). Rotate 324 deg (360 * 0.9)
                        */}
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="40" 
                          fill="transparent" 
                          stroke="#8b5cf6" 
                          strokeWidth="11" 
                          strokeDasharray="251.2" 
                          strokeDashoffset="226.08" // 251.2 * (1 - 0.1)
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
                    <div className="flex-1 space-y-2.5 text-[11px] w-full">
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

                {/* IPK per Semester Chart Card */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <h3 className="text-sm font-bold text-stone-850">IPK per Semester</h3>
                    <div className="relative">
                      <select className="appearance-none bg-stone-50 border border-stone-200/80 px-2 py-0.5 pr-6 rounded-lg text-[9px] font-bold text-stone-500 focus:outline-none cursor-pointer">
                        <option>5 Semester Terakhir</option>
                      </select>
                      <ChevronDown className="absolute right-1.5 top-1.5 h-3 w-3 text-stone-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* SVG Line Chart */}
                  <div className="mt-5 relative w-full h-32">
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

              </div>

              {/* Row 2: Pengumuman Terbaru & Tagihan & Pembayaran */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Pengumuman Terbaru Card */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <h3 className="text-sm font-bold text-stone-850">Pengumuman Terbaru</h3>
                    <button className="text-[11px] text-[#1d6cf0] hover:underline font-bold">Lihat Semua</button>
                  </div>

                  <div className="space-y-4 mt-4 text-left">
                    {/* Item 1 */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-full mt-0.5">
                        <Megaphone className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-stone-800 leading-snug">
                          Pembayaran UKT Semester Genap 2023/2024
                        </h4>
                        <p className="text-[10px] text-stone-400 mt-1 leading-snug">
                          Pembayaran dapat dilakukan hingga 10 Juni 2024.
                        </p>
                      </div>
                      <span className="text-[10px] text-stone-400 font-semibold whitespace-nowrap ml-2">20 Mei 2024</span>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-full mt-0.5">
                        <Megaphone className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-stone-800 leading-snug">
                          Pengisian KRS Semester Genap 2023/2024
                        </h4>
                        <p className="text-[10px] text-stone-400 mt-1 leading-snug">
                          Periode pengisian KRS telah dibuka. Segera lakukan pengisian KRS Anda.
                        </p>
                      </div>
                      <span className="text-[10px] text-stone-400 font-semibold whitespace-nowrap ml-2">18 Mei 2024</span>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-full mt-0.5">
                        <Megaphone className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-stone-800 leading-snug">
                          Jadwal Ujian Akhir Semester
                        </h4>
                        <p className="text-[10px] text-stone-400 mt-1 leading-snug">
                          Jadwal UAS dapat dilihat pada menu Perkuliahan.
                        </p>
                      </div>
                      <span className="text-[10px] text-stone-400 font-semibold whitespace-nowrap ml-2">15 Mei 2024</span>
                    </div>
                  </div>
                </div>

                {/* Tagihan & Pembayaran Card */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <h3 className="text-sm font-bold text-stone-850">Tagihan & Pembayaran</h3>
                    <button 
                      onClick={() => setActiveTab('ukt')}
                      className="text-[11px] text-[#1d6cf0] hover:underline font-bold"
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
                          Rp 2.450.000
                        </span>
                      </div>
                      <span className="bg-[#fef3c7] text-[#b45309] border border-[#fde68a] text-[9px] font-bold px-2 py-0.5 rounded-md">
                        Belum Dibayar
                      </span>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="space-y-2.5 text-xs text-stone-600">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-500">UKT Semester Genap 2023/2024</span>
                        <span className="font-semibold text-stone-700">Rp 2.000.000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-500">Biaya Praktikum</span>
                        <span className="font-semibold text-stone-700">Rp 300.000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-500">Biaya Lainnya</span>
                        <span className="font-semibold text-stone-700">Rp 150.000</span>
                      </div>
                    </div>

                    {/* Pay Button */}
                    <button
                      onClick={() => setIsPayModalOpen(true)}
                      className="w-full py-2.5 bg-[#1d6cf0] hover:bg-[#1a5ebf] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Lakukan Pembayaran
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Column (Narrow) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Jadwal Hari Ini Card */}
              <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs text-left">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="text-sm font-bold text-stone-850">Jadwal Hari Ini</h3>
                  <button className="text-[11px] text-[#1d6cf0] hover:underline font-bold">Lihat Semua</button>
                </div>

                <div className="mt-4 space-y-4">
                  {/* Schedule 1 */}
                  <div className="flex items-center gap-3 bg-white border border-stone-150 rounded-xl p-3.5 relative overflow-hidden">
                    {/* Left Colored Accent */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                    
                    <div className="flex flex-col text-xs font-bold text-stone-500 w-12 flex-shrink-0">
                      <span>08:00</span>
                      <span className="text-[10px] text-stone-400 font-normal mt-0.5">09:40</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-stone-850 truncate">Struktur Data</h4>
                      <p className="text-[10px] text-stone-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> IF-202 • R. 302
                      </p>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-150 text-[9px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap">
                      Berlangsung
                    </span>
                  </div>

                  {/* Schedule 2 */}
                  <div className="flex items-center gap-3 bg-white border border-stone-150 rounded-xl p-3.5 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
                    
                    <div className="flex flex-col text-xs font-bold text-stone-500 w-12 flex-shrink-0">
                      <span>10:00</span>
                      <span className="text-[10px] text-stone-400 font-normal mt-0.5">11:40</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-stone-850 truncate">Basis Data</h4>
                      <p className="text-[10px] text-stone-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> IF-204 • R. 305
                      </p>
                    </div>
                    <span className="bg-blue-50 text-blue-700 border border-blue-150 text-[9px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap">
                      Mendatang
                    </span>
                  </div>

                  {/* Schedule 3 */}
                  <div className="flex items-center gap-3 bg-white border border-stone-150 rounded-xl p-3.5 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1d6cf0]" />
                    
                    <div className="flex flex-col text-xs font-bold text-stone-500 w-12 flex-shrink-0">
                      <span>13:00</span>
                      <span className="text-[10px] text-stone-400 font-normal mt-0.5">14:40</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-stone-850 truncate">Rekayasa Perangkat Lunak</h4>
                      <p className="text-[10px] text-stone-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> IF-205 • R. 301
                      </p>
                    </div>
                    <span className="bg-blue-50 text-blue-700 border border-blue-150 text-[9px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap">
                      Mendatang
                    </span>
                  </div>

                  {/* Schedule 4 */}
                  <div className="flex items-center gap-3 bg-white border border-stone-150 rounded-xl p-3.5 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
                    
                    <div className="flex flex-col text-xs font-bold text-stone-500 w-12 flex-shrink-0">
                      <span>15:00</span>
                      <span className="text-[10px] text-stone-400 font-normal mt-0.5">16:40</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-stone-850 truncate">Kecerdasan Buatan</h4>
                      <p className="text-[10px] text-stone-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> IF-208 • R. 306
                      </p>
                    </div>
                    <span className="bg-blue-50 text-blue-700 border border-blue-150 text-[9px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap">
                      Mendatang
                    </span>
                  </div>
                </div>
              </div>

              {/* Akses Cepat Card */}
              <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs text-left">
                <h3 className="text-sm font-bold text-stone-850 pb-3 border-b border-stone-100 mb-4">Akses Cepat</h3>

                <div className="grid grid-cols-3 gap-3">
                  {/* KRS */}
                  <button 
                    onClick={() => setActiveTab('krs')}
                    className="flex flex-col items-center justify-center p-2.5 bg-white hover:bg-stone-50 border border-stone-150 rounded-xl shadow-2xs transition-all cursor-pointer group"
                  >
                    <div className="p-2 bg-blue-55 text-[#1d6cf0] rounded-xl group-hover:scale-105 transition-transform">
                      <FileText className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-bold text-stone-600 mt-2 text-center leading-tight">KRS</span>
                  </button>

                  {/* KHS */}
                  <button 
                    onClick={() => setActiveTab('khs')}
                    className="flex flex-col items-center justify-center p-2.5 bg-white hover:bg-stone-50 border border-stone-150 rounded-xl shadow-2xs transition-all cursor-pointer group"
                  >
                    <div className="p-2 bg-emerald-55 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-bold text-stone-600 mt-2 text-center leading-tight">Kartu Hasil Studi</span>
                  </button>

                  {/* Transkrip Sementara */}
                  <button 
                    onClick={() => setActiveTab('khs')}
                    className="flex flex-col items-center justify-center p-2.5 bg-white hover:bg-stone-50 border border-stone-150 rounded-xl shadow-2xs transition-all cursor-pointer group"
                  >
                    <div className="p-2 bg-purple-55 text-purple-600 rounded-xl group-hover:scale-105 transition-transform">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-bold text-stone-600 mt-2 text-center leading-tight">Transkrip Sementara</span>
                  </button>

                  {/* Presensi */}
                  <button 
                    className="flex flex-col items-center justify-center p-2.5 bg-white hover:bg-stone-50 border border-stone-150 rounded-xl shadow-2xs transition-all cursor-pointer group"
                  >
                    <div className="p-2 bg-indigo-55 text-indigo-600 rounded-xl group-hover:scale-105 transition-transform">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-bold text-stone-600 mt-2 text-center leading-tight">Presensi</span>
                  </button>

                  {/* Pembayaran */}
                  <button 
                    onClick={() => setActiveTab('ukt')}
                    className="flex flex-col items-center justify-center p-2.5 bg-white hover:bg-stone-50 border border-stone-150 rounded-xl shadow-2xs transition-all cursor-pointer group"
                  >
                    <div className="p-2 bg-amber-55 text-amber-600 rounded-xl group-hover:scale-105 transition-transform">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-bold text-stone-600 mt-2 text-center leading-tight">Pembayaran</span>
                  </button>

                  {/* Buku Pedoman */}
                  <button 
                    className="flex flex-col items-center justify-center p-2.5 bg-white hover:bg-stone-50 border border-stone-150 rounded-xl shadow-2xs transition-all cursor-pointer group"
                  >
                    <div className="p-2 bg-amber-55 text-amber-600 rounded-xl group-hover:scale-105 transition-transform">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-bold text-stone-600 mt-2 text-center leading-tight">Buku Pedoman</span>
                  </button>
                </div>
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
            <div className="lg:col-span-5 space-y-4">
              <h4 className="font-bold text-stone-750">KRS Sementara Anda ({enrolledKrs.length} MK)</h4>
              <div className="glass p-5 rounded-2xl space-y-3.5 max-h-[500px] overflow-y-auto">
                {enrolledKrs.length === 0 ? (
                  <p className="text-xs text-stone-450 py-10 text-center font-medium">Belum ada matakuliah diambil.</p>
                ) : (
                  enrolledKrs.map((item) => (
                    <div key={item.id} className="p-3.5 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-3 animate-fade-in">
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
                  <span className={`inline-block font-bold px-2 py-0.5 rounded text-xs border ${val.startsWith('A') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
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
