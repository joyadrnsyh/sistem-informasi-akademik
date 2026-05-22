const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8000;
const JWT_SECRET = 'sia_super_secret_key_12345';
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// Helper function to read DB
function readDb() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return {
      users: [],
      courses: [],
      schedules: [],
      krsOfferings: [],
      enrolledKrs: [],
      khsRecords: [],
      studentGrades: [],
      uktBills: []
    };
  }
}

// Helper function to write DB
function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing database:', error);
  }
}

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Akses ditolak. Token tidak ditemukan.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'Sesi berakhir atau token tidak valid.' });
    }
    req.user = user;
    next();
  });
}

// Check role middleware
function authorizeRole(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Akses terlarang untuk role ini.' });
    }
    next();
  };
}

// Helper to convert grade letters to grade points
function getGradePoint(grade) {
  if (grade.startsWith('A')) return 4.0;
  if (grade.startsWith('B')) return 3.0;
  if (grade.startsWith('C')) return 2.0;
  if (grade.startsWith('D')) return 1.0;
  return 0.0;
}

// Helper to calculate grade letter from score
function getGradeLetter(score) {
  if (score >= 85) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'E';
}

// Helper to recalculate Mahasiswa GPA (IPK/IPS) based on KHS
function updateMahasiswaGPA(studentId) {
  const db = readDb();
  const student = db.users.find(u => u.id === studentId || u.nim === studentId);
  if (!student || student.role !== 'mahasiswa') return;

  const records = db.khsRecords.filter(r => r.studentId === student.id || r.studentId === student.nim);
  if (records.length === 0) return;

  let totalSks = 0;
  let totalGradePoints = 0;

  records.forEach(rec => {
    const sks = rec.sks || 3;
    totalSks += sks;
    totalGradePoints += getGradePoint(rec.grade) * sks;
  });

  const ip = totalSks > 0 ? parseFloat((totalGradePoints / totalSks).toFixed(2)) : 0.0;
  
  // Update student stats
  student.ips = ip;
  student.ipk = ip; // For simplicity in mock data, let IPK match current cumulative average
  student.sksTaken = totalSks;

  writeDb(db);
}

// ==========================================
// 1. AUTHENTICATION ROUTERS
// ==========================================

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(450).json({ error: 'Email dan password wajib diisi.' });
  }

  const db = readDb();
  const trimmedEmail = email.trim().toLowerCase();
  const user = db.users.find(u => u.email.toLowerCase() === trimmedEmail);

  if (!user || user.password !== password) {
    return res.status(400).json({ error: 'Email atau password salah!' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Exclude password from output
  const { password: _, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const db = readDb();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User tidak ditemukan.' });
  }

  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});


// ==========================================
// 2. ADMIN CRUD ROUTERS
// ==========================================

// Users management
app.get('/api/admin/users', authenticateToken, authorizeRole(['admin']), (req, res) => {
  const db = readDb();
  const safeUsers = db.users.map(({ password: _, ...u }) => u);
  res.json(safeUsers);
});

app.post('/api/admin/users', authenticateToken, authorizeRole(['admin']), (req, res) => {
  const { name, email, role, password, number } = req.body;
  if (!name || !email || !role || !password || !number) {
    return res.status(400).json({ error: 'Kolom name, email, role, password, dan nomor induk wajib diisi.' });
  }

  const db = readDb();
  if (db.users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
    return res.status(400).json({ error: 'Email sudah terdaftar.' });
  }

  const newId = role === 'admin' ? `adm-${Date.now()}` : role === 'dosen' ? `dsn-${Date.now()}` : `mhs-${Date.now()}`;
  const newUser = {
    id: newId,
    name,
    email: email.trim().toLowerCase(),
    password,
    role,
    avatar: role === 'admin' 
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' 
      : role === 'dosen' 
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' 
        : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
  };

  if (role === 'admin') {
    newUser.departement = 'Bagian Administrasi Akademik (BAA)';
  } else if (role === 'dosen') {
    newUser.nidn = number;
    newUser.faculty = 'Fakultas Ilmu Komputer';
    newUser.department = 'Teknik Informatika';
  } else if (role === 'mahasiswa') {
    newUser.nim = number;
    newUser.faculty = 'Fakultas Ilmu Komputer';
    newUser.department = 'Teknik Informatika';
    newUser.semester = 1;
    newUser.academicYear = '2025/2026 Ganjil';
    newUser.ips = 0.0;
    newUser.ipk = 0.0;
    newUser.sksTaken = 0;

    // Create an initial UKT bill for this student
    db.uktBills.push({
      studentId: newId,
      amount: 5500000,
      dueDate: '2026-06-15',
      status: 'BELUM BAYAR',
      vaNumber: `98804${number}`,
      bank: 'Bank Mandiri'
    });
  }

  db.users.push(newUser);
  writeDb(db);

  const { password: _, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});

app.delete('/api/admin/users/:id', authenticateToken, authorizeRole(['admin']), (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const initialCount = db.users.length;
  db.users = db.users.filter(u => u.id !== id);

  if (db.users.length === initialCount) {
    return res.status(404).json({ error: 'User tidak ditemukan.' });
  }

  writeDb(db);
  res.json({ success: true, message: 'User berhasil dihapus.' });
});

// Courses management
app.get('/api/admin/courses', authenticateToken, authorizeRole(['admin']), (req, res) => {
  const db = readDb();
  res.json(db.courses);
});

app.post('/api/admin/courses', authenticateToken, authorizeRole(['admin']), (req, res) => {
  const { code, name, sks, semester } = req.body;
  if (!code || !name || !sks || !semester) {
    return res.status(400).json({ error: 'Kode, nama, SKS, dan semester wajib diisi.' });
  }

  const db = readDb();
  if (db.courses.some(c => c.code.toLowerCase() === code.trim().toLowerCase())) {
    return res.status(400).json({ error: 'Kode matakuliah sudah ada.' });
  }

  const newCourse = {
    id: `MK-${Date.now()}`,
    code: code.trim().toUpperCase(),
    name,
    sks: parseInt(sks),
    semester: parseInt(semester)
  };

  db.courses.push(newCourse);
  writeDb(db);
  res.status(201).json(newCourse);
});

app.delete('/api/admin/courses/:id', authenticateToken, authorizeRole(['admin']), (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.courses = db.courses.filter(c => c.id !== id && c.code !== id);
  writeDb(db);
  res.json({ success: true, message: 'Matakuliah berhasil dihapus.' });
});

// Schedules management
app.get('/api/admin/schedules', authenticateToken, authorizeRole(['admin']), (req, res) => {
  const db = readDb();
  res.json(db.schedules);
});

app.post('/api/admin/schedules', authenticateToken, authorizeRole(['admin']), (req, res) => {
  const { courseId, lecturerId, day, time, room, class: className } = req.body;
  if (!courseId || !lecturerId || !day || !time || !room) {
    return res.status(400).json({ error: 'Semua kolom jadwal wajib diisi.' });
  }

  const db = readDb();
  const course = db.courses.find(c => c.id === courseId || c.code === courseId);
  const lecturer = db.users.find(u => u.id === lecturerId && u.role === 'dosen');

  if (!course) return res.status(400).json({ error: 'Matakuliah tidak valid.' });
  if (!lecturer) return res.status(400).json({ error: 'Dosen tidak valid.' });

  const newSchedule = {
    id: `S-${Date.now()}`,
    courseId: course.id,
    courseName: course.name,
    lecturerId: lecturer.id,
    lecturer: lecturer.name,
    day,
    time,
    room,
    class: className || 'Reguler',
    studentsCount: 0
  };

  db.schedules.push(newSchedule);
  writeDb(db);
  res.status(201).json(newSchedule);
});

app.delete('/api/admin/schedules/:id', authenticateToken, authorizeRole(['admin']), (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.schedules = db.schedules.filter(s => s.id !== id);
  writeDb(db);
  res.json({ success: true, message: 'Jadwal berhasil dihapus.' });
});


// ==========================================
// 3. INSTRUCTOR (DOSEN) ROUTERS
// ==========================================

// Get courses taught by logged-in instructor
app.get('/api/dosen/classes', authenticateToken, authorizeRole(['dosen']), (req, res) => {
  const db = readDb();
  const classes = db.schedules.filter(s => s.lecturerId === req.user.id).map(s => {
    const course = db.courses.find(c => c.id === s.courseId);
    return {
      ...s,
      id: s.courseId,
      code: course ? course.code : 'MK-XX',
      sks: course ? course.sks : 3,
      name: course ? course.name : s.courseName
    };
  });
  res.json(classes);
});

// Get student list for a particular course
app.get('/api/dosen/classes/:courseId/students', authenticateToken, authorizeRole(['dosen']), (req, res) => {
  const { courseId } = req.params;
  const db = readDb();

  // Find students grades for this course
  let grades = db.studentGrades.filter(g => g.courseId === courseId);
  
  // If empty, pre-populate from students database for display purposes
  if (grades.length === 0) {
    const students = db.users.filter(u => u.role === 'mahasiswa');
    grades = students.map(s => ({
      courseId,
      studentId: s.id,
      name: s.name,
      tugas: 0,
      uts: 0,
      uas: 0
    }));
    db.studentGrades = [...db.studentGrades, ...grades];
    writeDb(db);
  }

  const enrichedGrades = grades.map(g => {
    const student = db.users.find(u => u.id === g.studentId);
    return {
      ...g,
      id: student ? student.nim : g.studentId,
      studentId: g.studentId,
      nim: student ? student.nim : ''
    };
  });

  res.json(enrichedGrades);
});

// Update student grades
app.post('/api/dosen/grades', authenticateToken, authorizeRole(['dosen']), (req, res) => {
  const { courseId, studentId, tugas, uts, uas } = req.body;
  if (!courseId || !studentId) {
    return res.status(400).json({ error: 'courseId dan studentId wajib diisi.' });
  }

  const db = readDb();
  let gradeEntry = db.studentGrades.find(g => g.courseId === courseId && (g.studentId === studentId || g.studentId.toString() === studentId.toString()));

  const tVal = Math.min(100, Math.max(0, parseInt(tugas) || 0));
  const utVal = Math.min(100, Math.max(0, parseInt(uts) || 0));
  const uaVal = Math.min(100, Math.max(0, parseInt(uas) || 0));

  if (gradeEntry) {
    gradeEntry.tugas = tVal;
    gradeEntry.uts = utVal;
    gradeEntry.uas = uaVal;
  } else {
    const student = db.users.find(u => u.id === studentId || u.nim === studentId);
    gradeEntry = {
      courseId,
      studentId,
      name: student ? student.name : 'Mahasiswa',
      tugas: tVal,
      uts: utVal,
      uas: uaVal
    };
    db.studentGrades.push(gradeEntry);
  }

  // Calculate score & letter
  const finalScore = Math.round((tVal * 0.3) + (utVal * 0.3) + (uaVal * 0.4));
  const gradeLetter = getGradeLetter(finalScore);

  // Sync to KHS records of the student
  // Find schedule/course info
  const schedule = db.schedules.find(s => s.courseId === courseId || s.id === courseId);
  const course = db.courses.find(c => c.id === courseId || c.id === (schedule ? schedule.courseId : ''));
  const courseName = course ? course.name : (schedule ? schedule.courseName : 'Studi Terarah');
  const courseCode = course ? course.code : (schedule ? schedule.id : 'MK-XX');
  const courseSks = course ? course.sks : 3;

  const studentObj = db.users.find(u => u.id === studentId || u.nim === studentId);
  const mhsId = studentObj ? studentObj.id : studentId;

  let khsEntry = db.khsRecords.find(k => k.studentId === mhsId && k.code === courseCode);
  if (khsEntry) {
    khsEntry.score = finalScore;
    khsEntry.grade = gradeLetter;
  } else {
    khsEntry = {
      studentId: mhsId,
      code: courseCode,
      name: courseName,
      sks: courseSks,
      grade: gradeLetter,
      score: finalScore
    };
    db.khsRecords.push(khsEntry);
  }

  writeDb(db);

  // Dynamically recalculate GPA
  updateMahasiswaGPA(mhsId);

  res.json({ success: true, gradeEntry });
});


// ==========================================
// 4. STUDENT (MAHASISWA) ROUTERS
// ==========================================

// Student profile
app.get('/api/mahasiswa/profile', authenticateToken, authorizeRole(['mahasiswa']), (req, res) => {
  const db = readDb();
  const student = db.users.find(u => u.id === req.user.id);
  if (!student) {
    return res.status(404).json({ error: 'Data profil mahasiswa tidak ditemukan.' });
  }

  const { password: _, ...safeStudent } = student;
  res.json(safeStudent);
});

// KRS Available offerings
app.get('/api/mahasiswa/krs/offerings', authenticateToken, authorizeRole(['mahasiswa']), (req, res) => {
  const db = readDb();
  res.json(db.krsOfferings);
});

// KRS Currently selected
app.get('/api/mahasiswa/krs/selected', authenticateToken, authorizeRole(['mahasiswa']), (req, res) => {
  const db = readDb();
  const selectedLinks = db.enrolledKrs.filter(e => e.studentId === req.user.id);
  
  // Map selected courses ids to course object details
  const selectedDetails = selectedLinks.map(link => {
    return db.krsOfferings.find(offering => offering.id === link.courseId || offering.code === link.courseId);
  }).filter(Boolean);

  res.json(selectedDetails);
});

// Select course in KRS
app.post('/api/mahasiswa/krs/select', authenticateToken, authorizeRole(['mahasiswa']), (req, res) => {
  const { courseId } = req.body;
  if (!courseId) return res.status(400).json({ error: 'courseId wajib diisi.' });

  const db = readDb();
  const student = db.users.find(u => u.id === req.user.id);
  const offering = db.krsOfferings.find(o => o.id === courseId || o.code === courseId);

  if (!offering) return res.status(404).json({ error: 'Matakuliah tidak ditemukan.' });

  // Check duplicate
  const isEnrolled = db.enrolledKrs.some(e => e.studentId === req.user.id && e.courseId === offering.id);
  if (isEnrolled) {
    return res.status(400).json({ error: 'Matakuliah sudah ada di KRS Anda.' });
  }

  // SKS limit check
  const maxSks = student.ips >= 3.0 ? 24 : student.ips >= 2.0 ? 20 : 18;
  const currentSelected = db.enrolledKrs.filter(e => e.studentId === req.user.id);
  const currentSksTotal = currentSelected.reduce((sum, link) => {
    const off = db.krsOfferings.find(o => o.id === link.courseId);
    return sum + (off ? off.sks : 0);
  }, 0);

  if (currentSksTotal + offering.sks > maxSks) {
    return res.status(400).json({ error: `Batas maksimal SKS Anda (${maxSks} SKS) terlampaui.` });
  }

  db.enrolledKrs.push({
    studentId: req.user.id,
    courseId: offering.id
  });

  writeDb(db);
  res.json({ success: true, message: 'Matakuliah berhasil ditambahkan ke KRS.' });
});

// Drop course from KRS
app.delete('/api/mahasiswa/krs/select/:courseId', authenticateToken, authorizeRole(['mahasiswa']), (req, res) => {
  const { courseId } = req.params;
  const db = readDb();

  const initialLength = db.enrolledKrs.length;
  db.enrolledKrs = db.enrolledKrs.filter(e => !(e.studentId === req.user.id && (e.courseId === courseId || e.courseId.replace('MK-','') === courseId)));

  if (db.enrolledKrs.length === initialLength) {
    return res.status(404).json({ error: 'Matakuliah tidak ditemukan di KRS Anda.' });
  }

  writeDb(db);
  res.json({ success: true, message: 'Matakuliah berhasil dihapus dari KRS.' });
});

// KHS list
app.get('/api/mahasiswa/khs', authenticateToken, authorizeRole(['mahasiswa']), (req, res) => {
  const db = readDb();
  const records = db.khsRecords.filter(r => r.studentId === req.user.id || r.studentId === db.users.find(u => u.id === req.user.id)?.nim);
  res.json(records);
});

// UKT Bill details
app.get('/api/mahasiswa/ukt', authenticateToken, authorizeRole(['mahasiswa']), (req, res) => {
  const db = readDb();
  const bill = db.uktBills.find(b => b.studentId === req.user.id);
  if (!bill) {
    return res.json({
      amount: 5500000,
      dueDate: '2026-06-15',
      status: 'BELUM BAYAR',
      vaNumber: `9880422010100450`,
      bank: 'Bank Mandiri'
    });
  }
  res.json(bill);
});

// Simulate UKT Bill payment
app.post('/api/mahasiswa/ukt/pay', authenticateToken, authorizeRole(['mahasiswa']), (req, res) => {
  const db = readDb();
  const bill = db.uktBills.find(b => b.studentId === req.user.id);
  
  if (!bill) {
    // If somehow not found, create one
    db.uktBills.push({
      studentId: req.user.id,
      amount: 5500000,
      dueDate: '2026-06-15',
      status: 'LUNAS',
      vaNumber: '9880422010100450',
      bank: 'Bank Mandiri'
    });
  } else {
    bill.status = 'LUNAS';
  }

  writeDb(db);
  res.json({ success: true, message: 'Pembayaran UKT berhasil diproses.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Academic Info System API backend running on http://localhost:${PORT}`);
});
