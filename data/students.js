// ═══════════════════════════════════════════════════════════════
//  CALIPH LIFE SCHOOL — Official Student Result Data
//  Exact Student Names and Roll Numbers Verified from Register Sheet
//  Official Batches: C2B, C2A, S2B, S2A
// ═══════════════════════════════════════════════════════════════

const SUBJECT_NAMES = [
  "CEE",
  "FIQH",
  "PRACTICAL ISLAM",
  "THE MOST BEAUTIFUL NAMES",
  "LIFE OF PROPHET"
];

// Helper to create subject object
function makeSubj(name, obtained, max = 100, pass = 35) {
  const val = parseFloat(obtained);
  return {
    name: name,
    maxMarks: max,
    passingMarks: pass,
    obtainedMarks: val,
    status: val >= pass ? "Pass" : "Fail"
  };
}

const rawStudents = [
  // ─────────────────────────────────────────────────────────────
  // CLASS C2B
  // ─────────────────────────────────────────────────────────────
  { roll: "C2B-05", slNo: 5, name: "AHAMMED SHAN", class: "C2B", cee: 65.33, fiqh: 85, prac: 67, bea: 71.5, life: 84 },
  { roll: "C2B-27", slNo: 27, name: "MUHAMMED JASIL M P", class: "C2B", cee: 70.67, fiqh: 82, prac: 62, bea: 68, life: 78 },
  { roll: "C2B-13", slNo: 13, name: "AZEEM MANGALAT", class: "C2B", cee: 65.33, fiqh: 87, prac: 65, bea: 67, life: 73.5 },
  { roll: "C2B-09", slNo: 9, name: "AMIR MUHAMMED", class: "C2B", cee: 69.33, fiqh: 87.5, prac: 61, bea: 60, life: 74.5 },
  { roll: "C2B-23", slNo: 23, name: "MUHAMMED FAVAZ N", class: "C2B", cee: 57.33, fiqh: 86, prac: 65, bea: 67, life: 75 },
  { roll: "C2B-32", slNo: 32, name: "MUHAMMED SABITH M P", class: "C2B", cee: 56, fiqh: 89, prac: 52, bea: 69.5, life: 76 },
  { roll: "C2B-06", slNo: 6, name: "AHMMED SINAN P P", class: "C2B", cee: 72, fiqh: 72, prac: 58.5, bea: 66, life: 69.5 },
  { roll: "C2B-01", slNo: 1, name: "AAMIR SHAHEEM P P", class: "C2B", cee: 54.67, fiqh: 82, prac: 60, bea: 66, life: 74.5 },
  { roll: "C2B-08", slNo: 8, name: "AMIR BIN JAMALUDHEEN", class: "C2B", cee: 82.67, fiqh: 80.5, prac: 46, bea: 57.5, life: 66.5 },
  { roll: "C2B-39", slNo: 39, name: "SAYYID SHADIN SUNEER", class: "C2B", cee: 49.33, fiqh: 87, prac: 58, bea: 59, life: 74.5 },
  { roll: "C2B-12", slNo: 12, name: "AYMAN NOUSHAD", class: "C2B", cee: 49.33, fiqh: 83, prac: 56.5, bea: 61.5, life: 73.5 },
  { roll: "C2B-31", slNo: 31, name: "MUHAMMED RISAL V V", class: "C2B", cee: 56, fiqh: 76, prac: 52.5, bea: 65, life: 70 },
  { roll: "C2B-24", slNo: 24, name: "MUHAMMED ISHAN E", class: "C2B", cee: 50.67, fiqh: 77, prac: 61.5, bea: 62, life: 66 },
  { roll: "C2B-16", slNo: 16, name: "LEZIN HADI N C", class: "C2B", cee: 70.67, fiqh: 76, prac: 48, bea: 56.5, life: 65 },
  { roll: "C2B-15", slNo: 15, name: "HADIY HAMEED", class: "C2B", cee: 50.67, fiqh: 86.5, prac: 57, bea: 52, life: 69.5 },
  { roll: "C2B-07", slNo: 7, name: "AMAL ZAYAN T", class: "C2B", cee: 49.33, fiqh: 77.5, prac: 59.5, bea: 57.5, life: 71.5 },
  { roll: "C2B-21", slNo: 21, name: "MUHAMMED DANISH M", class: "C2B", cee: 52, fiqh: 73, prac: 60.5, bea: 58.5, life: 69.5 },
  { roll: "C2B-28", slNo: 28, name: "MUHAMMED MISHAB K K", class: "C2B", cee: 54.67, fiqh: 75, prac: 60, bea: 58, life: 65 },
  { roll: "C2B-04", slNo: 4, name: "AHAMMED BISHR P K", class: "C2B", cee: 60, fiqh: 78.5, prac: 53, bea: 50, life: 66.5 },
  { roll: "C2B-02", slNo: 2, name: "ABDUL VAHID M A", class: "C2B", cee: 53.33, fiqh: 79.5, prac: 62.5, bea: 50, life: 62 },
  { roll: "C2B-26", slNo: 26, name: "MUHAMMED ISMAIL Y M", class: "C2B", cee: 61.33, fiqh: 75.5, prac: 52, bea: 50, life: 65.5 },
  { roll: "C2B-11", slNo: 11, name: "AYAN HYZAM", class: "C2B", cee: 54.67, fiqh: 73, prac: 51, bea: 52.5, life: 65.5 },
  { roll: "C2B-41", slNo: 41, name: "ZIDAN ZAKARIYA", class: "C2B", cee: 48.67, fiqh: 65, prac: 44, bea: 54, life: 67 },
  { roll: "C2B-18", slNo: 18, name: "MOHAMMED ZAUB", class: "C2B", cee: 61.33, fiqh: 67, prac: 50, bea: 57, life: 58 },
  { roll: "C2B-14", slNo: 14, name: "FALAH ABDULLA", class: "C2B", cee: 68, fiqh: 70, prac: 53.5, bea: 44, life: 54.5 },
  { roll: "C2B-34", slNo: 34, name: "MUHAMMED T P", class: "C2B", cee: 57.33, fiqh: 73, prac: 43, bea: 49.5, life: 59.5 },
  { roll: "C2B-20", slNo: 20, name: "MUHAMMED ATHISH", class: "C2B", cee: 48, fiqh: 68, prac: 56.5, bea: 46, life: 60.5 },
  { roll: "C2B-38", slNo: 38, name: "NIDAL ABDUL JABBAR", class: "C2B", cee: 50.67, fiqh: 62, prac: 53, bea: 52, life: 58.5 },
  { roll: "C2B-25", slNo: 25, name: "MUHAMMED ISMAIL SHA", class: "C2B", cee: 40, fiqh: 69.5, prac: 54.5, bea: 52, life: 59.5 },
  { roll: "C2B-19", slNo: 19, name: "MUHAMMAD P", class: "C2B", cee: 30.67, fiqh: 84, prac: 48, bea: 48, life: 63 },
  { roll: "C2B-29", slNo: 29, name: "MUHAMMED NABEEL J", class: "C2B", cee: 58.67, fiqh: 69, prac: 46, bea: 43, life: 57 },
  { roll: "C2B-36", slNo: 36, name: "REHAN MC", class: "C2B", cee: 49.33, fiqh: 77.5, prac: 31, bea: 46.5, life: 65 },
  { roll: "C2B-22", slNo: 22, name: "MUHAMMED FAREED V I", class: "C2B", cee: 41.33, fiqh: 71.5, prac: 40, bea: 50.5, life: 64.5 },
  { roll: "C2B-35", slNo: 35, name: "MUHAMMED HAIDHAN", class: "C2B", cee: 38, fiqh: 71, prac: 55, bea: 43, life: 57.5 },
  { roll: "C2B-03", slNo: 3, name: "AFREED P P", class: "C2B", cee: 45.33, fiqh: 60.5, prac: 53.5, bea: 49, life: 54 },
  { roll: "C2B-10", slNo: 10, name: "ASHIK K K", class: "C2B", cee: 45.33, fiqh: 61, prac: 49.5, bea: 40, life: 52.5 },
  { roll: "C2B-17", slNo: 17, name: "MIFZAL MUSTAPHA MUHAMMED", class: "C2B", cee: 44, fiqh: 52, prac: 54.5, bea: 35, life: 48 },
  { roll: "C2B-37", slNo: 37, name: "RAYYAN HASSAN C K", class: "C2B", cee: 41.33, fiqh: 86, prac: 54.5, bea: 25, life: 40 },
  { roll: "C2B-33", slNo: 33, name: "MUHAMMED SAHIL H", class: "C2B", cee: 33.33, fiqh: 55, prac: 40, bea: 40, life: 46.5 },
  { roll: "C2B-30", slNo: 30, name: "MUHAMMED NIHAL S M", class: "C2B", cee: 25.33, fiqh: 52, prac: 35, bea: 35, life: 47 },
  { roll: "C2B-40", slNo: 40, name: "SHAMMAS. A. K", class: "C2B", cee: 32, fiqh: 45.5, prac: 36.5, bea: 31, life: 40 },

  // ─────────────────────────────────────────────────────────────
  // CLASS C2A
  // ─────────────────────────────────────────────────────────────
  { roll: "C2A-05", slNo: 5, name: "FATHIMA MUFEEDA", class: "C2A", cee: 62.67, fiqh: 88, prac: 70, bea: 70.5, life: 64 },
  { roll: "C2A-01", slNo: 1, name: "AYISHA RIDHA", class: "C2A", cee: 52, fiqh: 87, prac: 62, bea: 70, life: 63 },
  { roll: "C2A-04", slNo: 4, name: "FATHIMA JUMANA M", class: "C2A", cee: 33.33, fiqh: 88, prac: 63, bea: 78.5, life: 63 },
  { roll: "C2A-10", slNo: 10, name: "NATHASHA FATHIMA P", class: "C2A", cee: 52, fiqh: 79, prac: 63, bea: 53, life: 63 },
  { roll: "C2A-06", slNo: 6, name: "FATHIMA MUHSINA P P", class: "C2A", cee: 65.33, fiqh: 78, prac: 50, bea: 55.5, life: 50 },
  { roll: "C2A-13", slNo: 13, name: "SHADHA FATHIMA", class: "C2A", cee: 53.33, fiqh: 78, prac: 51, bea: 60, life: 51 },
  { roll: "C2A-14", slNo: 14, name: "ZADA FATHIMA K P", class: "C2A", cee: 50.67, fiqh: 75, prac: 47, bea: 66, life: 49 },
  { roll: "C2A-02", slNo: 2, name: "AYSHA", class: "C2A", cee: 38, fiqh: 81, prac: 43, bea: 66.5, life: 43 },
  { roll: "C2A-03", slNo: 3, name: "BAHIJA FATHIMA N C", class: "C2A", cee: 44, fiqh: 75, prac: 40, bea: 49, life: 42 },
  { roll: "C2A-09", slNo: 9, name: "NAJA FATHIMA P", class: "C2A", cee: 29.33, fiqh: 63, prac: 44, bea: 49.5, life: 50 },
  { roll: "C2A-07", slNo: 7, name: "HANIYA V K", class: "C2A", cee: 40, fiqh: 49, prac: 45, bea: 42, life: 47 },
  { roll: "C2A-11", slNo: 11, name: "RAFA SHERIN M M", class: "C2A", cee: 50.67, fiqh: 48, prac: 34, bea: 45, life: 44 },
  { roll: "C2A-12", slNo: 12, name: "RIFA MARYAM", class: "C2A", cee: 48.67, fiqh: 37, prac: 46, bea: 42, life: 48 },
  { roll: "C2A-08", slNo: 8, name: "LINHA FATHIMA B", class: "C2A", cee: 30.67, fiqh: 30, prac: 21, bea: 37, life: 39 },

  // ─────────────────────────────────────────────────────────────
  // CLASS S2B (was S1B)
  // ─────────────────────────────────────────────────────────────
  { roll: "S2B-17", slNo: 17, name: "MUHAMMED SHAHI T S", class: "S2B", cee: 58.67, fiqh: 84, prac: 65, bea: 70, life: 65 },
  { roll: "S2B-01", slNo: 1, name: "ABDUL AHAD SHAREEF", class: "S2B", cee: 69.33, fiqh: 85, prac: 61, bea: 65, life: 62 },
  { roll: "S2B-07", slNo: 7, name: "MAZHAR THAHA", class: "S2B", cee: 73.33, fiqh: 78, prac: 54, bea: 53, life: 56 },
  { roll: "S2B-11", slNo: 11, name: "MUHAMMED HIRAS KARI", class: "S2B", cee: 70.67, fiqh: 85, prac: 51, bea: 53, life: 51 },
  { roll: "S2B-21", slNo: 21, name: "RAIHAN ABDUL RASHEED A", class: "S2B", cee: 41.33, fiqh: 81, prac: 61, bea: 64, life: 63 },
  { roll: "S2B-12", slNo: 12, name: "MUHAMMED NADHISH", class: "S2B", cee: 73.33, fiqh: 82, prac: 46, bea: 45, life: 44 },
  { roll: "S2B-15", slNo: 15, name: "MUHAMMED RASEEM K", class: "S2B", cee: 64, fiqh: 77, prac: 48, bea: 49, life: 45 },
  { roll: "S2B-05", slNo: 5, name: "HADI MUHAMMED NADUKKANDI", class: "S2B", cee: 53.33, fiqh: 72, prac: 49, bea: 58, life: 50 },
  { roll: "S2B-20", slNo: 20, name: "NASHIM MUHAMMED N", class: "S2B", cee: 62.67, fiqh: 71, prac: 45, bea: 55, life: 45 },
  { roll: "S2B-03", slNo: 3, name: "FARZEEN AHAMMED", class: "S2B", cee: 50.67, fiqh: 70, prac: 48, bea: 53, life: 54 },
  { roll: "S2B-16", slNo: 16, name: "MUHAMMED SHADIN", class: "S2B", cee: 76, fiqh: 75, prac: 40, bea: 42, life: 41 },
  { roll: "S2B-10", slNo: 10, name: "MOHAMMED SINAN ANGILLATH", class: "S2B", cee: 54.67, fiqh: 70, prac: 53, bea: 43, life: 53 },
  { roll: "S2B-19", slNo: 19, name: "NAJWAN NOUSHAD", class: "S2B", cee: 57.33, fiqh: 64, prac: 53, bea: 46, life: 53 },
  { roll: "S2B-18", slNo: 18, name: "MUHAMMED YASEEN M", class: "S2B", cee: 58.67, fiqh: 72, prac: 46, bea: 49, life: 46 },
  { roll: "S2B-08", slNo: 8, name: "MD RIZA BAHLUL KOZHIKKATTIL", class: "S2B", cee: 58.67, fiqh: 51, prac: 49, bea: 61, life: 49 },
  { roll: "S2B-02", slNo: 2, name: "BISHRUL HAFI", class: "S2B", cee: 52, fiqh: 50, prac: 54, bea: 48, life: 64 },
  { roll: "S2B-13", slNo: 13, name: "MUHAMMED NAJAH M C", class: "S2B", cee: 57.33, fiqh: 74, prac: 42, bea: 48, life: 43 },
  { roll: "S2B-22", slNo: 22, name: "UMAR ABDULLAH SULFIKER", class: "S2B", cee: 69.33, fiqh: 41, prac: 45, bea: 48, life: 48 },
  { roll: "S2B-14", slNo: 14, name: "MUHAMMED RAMZY K K", class: "S2B", cee: 50.67, fiqh: 65, prac: 40, bea: 44.5, life: 50 },
  { roll: "S2B-04", slNo: 4, name: "HADI MUHAMMED T", class: "S2B", cee: 57.33, fiqh: 58, prac: 43, bea: 49, life: 41 },
  { roll: "S2B-06", slNo: 6, name: "K M MUHAMMED ANSAF", class: "S2B", cee: 42.67, fiqh: 58, prac: 44, bea: 41, life: 44 },
  { roll: "S2B-09", slNo: 9, name: "MIFZAL MOHAMED", class: "S2B", cee: 52, fiqh: 50, prac: 40, bea: 34, life: 40 },
  { roll: "S2B-23", slNo: 23, name: "YAFIS ZAHARAN", class: "S2B", cee: 40, fiqh: 42, prac: 40, bea: 45, life: 45 },

  // ─────────────────────────────────────────────────────────────
  // CLASS S2A (was S1A)
  // ─────────────────────────────────────────────────────────────
  { roll: "S2A-04", slNo: 4, name: "FATHIMA BASHEER", class: "S2A", cee: 81.33, fiqh: 89, prac: 69, bea: 79, life: 79 },
  { roll: "S2A-03", slNo: 3, name: "FATHIMA AFREEN", class: "S2A", cee: 57.33, fiqh: 89, prac: 79, bea: 78, life: 71 },
  { roll: "S2A-08", slNo: 8, name: "REYAH RIZWA C.P", class: "S2A", cee: 61.33, fiqh: 89, prac: 68, bea: 76, life: 77 },
  { roll: "S2A-10", slNo: 10, name: "SHIFA ISMAIL V K", class: "S2A", cee: 34.67, fiqh: 86, prac: 67, bea: 70.5, life: 74 },
  { roll: "S2A-06", slNo: 6, name: "KHADEEJA FATHIN", class: "S2A", cee: 40, fiqh: 85, prac: 56, bea: 70, life: 70 },
  { roll: "S2A-07", slNo: 7, name: "NADA FATHIMA. K", class: "S2A", cee: 52, fiqh: 83, prac: 49, bea: 55, life: 62 },
  { roll: "S2A-09", slNo: 9, name: "SEHANA SHERVIN", class: "S2A", cee: 42.67, fiqh: 77, prac: 55, bea: 59, life: 63 },
  { roll: "S2A-02", slNo: 2, name: "FATHHIYA. R. S", class: "S2A", cee: 40, fiqh: 73, prac: 70, bea: 34, life: 59 },
  { roll: "S2A-05", slNo: 5, name: "HADHIYA A A", class: "S2A", cee: 56, fiqh: 54, prac: 56, bea: 51, life: 53 },
  { roll: "S2A-01", slNo: 1, name: "AFRIN FATHIMA MOHAMED SHAFEEK", class: "S2A", cee: 36, fiqh: 51, prac: 53, bea: 60, life: 54 }
];

// Transform raw students into full record structures
const studentsData = rawStudents.map((s) => {
  const subjects = [
    makeSubj("CEE", s.cee),
    makeSubj("FIQH", s.fiqh),
    makeSubj("PRACTICAL ISLAM", s.prac),
    makeSubj("THE MOST BEAUTIFUL NAMES", s.bea),
    makeSubj("LIFE OF PROPHET", s.life)
  ];

  const totalObtained = subjects.reduce((acc, item) => acc + item.obtainedMarks, 0);
  const totalMax = subjects.reduce((acc, item) => acc + item.maxMarks, 0);
  const percentage = parseFloat(((totalObtained / totalMax) * 100).toFixed(2));
  const overallStatus = subjects.every((sub) => sub.status === "Pass") ? "PASSED" : "FAILED";

  return {
    rollNumber: String(s.slNo),
    regCode: s.roll,
    slNo: s.slNo,
    name: s.name,
    class: s.class,
    subjects: subjects,
    totalObtained: parseFloat(totalObtained.toFixed(2)),
    totalMax: totalMax,
    percentage: percentage,
    status: overallStatus,
    examTitle: "Caliph Integrated Syllabus — 2024-2026 SC9 Batch Result",
    academicYear: "2025-2026"
  };
});

// Export to global scope
if (typeof window !== "undefined") {
  window.STUDENTS_DATA = studentsData;
  console.log("%c📚 Caliph Life School — Marks Database Loaded", "font-weight:bold;font-size:14px;color:#1e3a6e;");
  console.log(`Total students loaded: ${studentsData.length}`);
}
