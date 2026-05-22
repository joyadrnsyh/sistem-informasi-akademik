import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './useAuth';

/**
 * Custom hook to manage student-specific academic state and actions (KRS, KHS, UKT).
 */
export const useMahasiswaData = () => {
  const { user } = useAuth();

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

  // Calculations
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

  return {
    profile,
    krsOfferings,
    enrolledKrs,
    khsRecords,
    uktBill,
    isPayModalOpen,
    setIsPayModalOpen,
    isKrsAlert,
    setIsKrsAlert,
    isPaySuccess,
    setIsPaySuccess,
    loading,
    fetchMahasiswaData,
    activeStudent,
    maxSksLimit,
    currentSksTotal,
    handleEnrollKrs,
    handleDropKrs,
    handlePayUktSubmit
  };
};

export default useMahasiswaData;
