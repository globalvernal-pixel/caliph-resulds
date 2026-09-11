// ═══════════════════════════════════════════════════════════
//  CALIPH LIFE SCHOOL — Result Portal Application Logic
// ═══════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
  // ── DOM Elements ──
  const searchForm = document.getElementById("searchForm");
  const nameInput = document.getElementById("studentName");
  const rollInput = document.getElementById("rollNumber");
  const classSelect = document.getElementById("classSelect");
  const btnCheck = document.getElementById("btnCheck");
  const btnReset = document.getElementById("btnReset");
  const resultSection = document.getElementById("resultSection");
  const toastContainer = document.getElementById("toastContainer");

  // ── Toast System ──
  function showToast(message, type = "error") {
    const icons = {
      error: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
      success: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
      warning: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    };

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `${icons[type]}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-exit");
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ── Validation ──
  function clearErrors() {
    document.querySelectorAll(".form-group").forEach((g) => g.classList.remove("error"));
  }

  function validateForm() {
    clearErrors();
    const name = nameInput.value.trim();
    const roll = rollInput.value.trim();
    const cls = classSelect.value;

    if (!name && !roll && !cls) {
      showToast("Please enter Student Name, Roll Number, or Class to check result.", "warning");
      return false;
    }

    return true;
  }

  // ── Smart Scoring Search Engine ──
  function searchStudent() {
    if (!validateForm()) return;

    const nameRaw = nameInput.value.trim().toLowerCase();
    const nameTokens = nameRaw.split(/\s+/).filter(Boolean);
    const rollRaw = rollInput.value.trim().toUpperCase();
    const cls = classSelect.value.toUpperCase();

    // Show loading state
    btnCheck.classList.add("btn-loading");

    setTimeout(() => {
      btnCheck.classList.remove("btn-loading");

      let matches = window.STUDENTS_DATA.map((s) => {
        let score = 0;
        const sClass = s.class.toUpperCase();

        // 1. Class filter: If class is selected, student MUST belong to that class
        if (cls) {
          const isClassMatch =
            sClass === cls ||
            `S${sClass}` === cls ||
            `C${sClass}` === cls ||
            cls.replace(/^[SC]/, "") === sClass;

          if (!isClassMatch) {
            return { student: s, score: -10000 }; // Disqualify wrong class
          }
          score += 100;
        }

        // 2. Register Number / Roll Number matching
        if (rollRaw) {
          const sRegNo = (s.regNo || "").toUpperCase();
          const sRegNum = (s.registerNumber || "").toUpperCase();
          const sRollNum = String(s.rollNumber || "").toUpperCase();
          const sSlNo = String(s.slNo || "").toUpperCase();
          const sRegCode = (s.regCode || "").toUpperCase();

          const digitsOnly = rollRaw.replace(/\D/g, "");
          const lastOne = digitsOnly.length > 0 ? digitsOnly.slice(-1) : "";
          const lastTwo = digitsOnly.length > 1 ? digitsOnly.slice(-2) : "";

          if (sRegNo === rollRaw || sRegNum === rollRaw) {
            score += 1000; // Exact 8-digit Register Number match
          } else if (sRollNum === rollRaw || sSlNo === rollRaw || sRegCode === rollRaw) {
            score += 800; // Exact Roll Number / SlNo match
          } else if (sRegNo && sRegNo.includes(rollRaw)) {
            score += 400; // Partial register match
          } else if (digitsOnly && (sSlNo === digitsOnly || (lastTwo && sSlNo === parseInt(lastTwo, 10).toString()) || (lastOne && sSlNo === lastOne))) {
            score += 600; // Match 8-digit register number ending with student's roll number
          } else {
            score -= 500; // Number mismatch penalty
          }
        }

        // 3. Student Name matching
        if (nameTokens.length > 0) {
          const sNameLower = s.name.toLowerCase();
          if (sNameLower === nameRaw) {
            score += 1000; // Exact full name
          } else if (sNameLower.includes(nameRaw)) {
            score += 500; // Substring match
          } else {
            let matchedTokens = 0;
            nameTokens.forEach((token) => {
              if (sNameLower.includes(token)) matchedTokens++;
            });
            if (matchedTokens > 0) {
              score += matchedTokens * 150;
            } else {
              score -= 300; // Name mismatch penalty
            }
          }
        }

        return { student: s, score: score };
      });

      // Filter out negative scores
      let validMatches = matches.filter((item) => item.score > 0);

      // Sort by highest score descending
      validMatches.sort((a, b) => b.score - a.score);

      if (validMatches.length === 0) {
        showToast("No student found matching these details. Please check the Register Number, Name, or Class.", "error");
        resultSection.classList.remove("visible");
        return;
      }

      const topMatch = validMatches[0].student;
      showToast(`Verification successful! Marksheet generated for ${topMatch.name}.`, "success");
      displayResult(topMatch);
    }, 400);
  }

  // ── Display Result Card ──
  function displayResult(student) {
    // Student Info
    document.getElementById("resStudentName").textContent = student.name;
    document.getElementById("resRollNumber").textContent = student.registerNumber || student.regNo || student.rollNumber;

    // Display class format e.g. C2B / S2A / S2B
    let displayClass = student.class;
    if (displayClass === "2B") displayClass = "C2B";
    else if (displayClass === "2A") displayClass = "C2A";
    else if (displayClass === "1A") displayClass = "S2A";
    else if (displayClass === "1B") displayClass = "S2B";

    document.getElementById("resClass").textContent = displayClass;
    document.getElementById("resAcademicYear").textContent = student.academicYear;
    document.getElementById("resExamTitle").textContent = student.examTitle;

    // Marks Table
    const tbody = document.getElementById("marksBody");
    tbody.innerHTML = "";

    student.subjects.forEach((sub, i) => {
      const row = document.createElement("tr");
      row.style.animationDelay = `${i * 0.06}s`;
      row.innerHTML = `
        <td><strong>${sub.name}</strong></td>
        <td class="marks-num">${sub.maxMarks}</td>
        <td class="marks-num">${sub.passingMarks}</td>
        <td class="marks-num" style="font-weight:700; color: ${sub.obtainedMarks >= sub.passingMarks ? 'var(--success)' : 'var(--danger)'}">${sub.obtainedMarks}</td>
        <td>
          <span class="status-badge ${sub.status === 'Pass' ? 'status-pass' : 'status-fail'}">
            ${sub.status === 'Pass' ? '✓ PASS' : '✗ FAIL'}
          </span>
        </td>
      `;
      tbody.appendChild(row);
    });

    // Summary
    document.getElementById("totalMarks").textContent = `${student.totalObtained} / ${student.totalMax}`;
    document.getElementById("percentage").textContent = `${student.percentage}%`;

    const statusEl = document.getElementById("overallStatus");
    statusEl.textContent = `OVERALL RESULT: ${student.status}`;
    statusEl.className = `overall-status-card ${student.status === "PASSED" ? "overall-passed" : "overall-failed"}`;

    // Grade calculation
    const pct = student.percentage;
    let grade = "F";
    if (pct >= 85) grade = "A+";
    else if (pct >= 75) grade = "A";
    else if (pct >= 65) grade = "B+";
    else if (pct >= 55) grade = "B";
    else if (pct >= 45) grade = "C";
    else if (pct >= 35) grade = "D";

    document.getElementById("gradeValue").textContent = grade;

    // Show result section & smooth scroll
    resultSection.classList.add("visible");
    setTimeout(() => {
      resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  // ── Print Function ──
  window.printResult = function () {
    window.print();
  };

  // ── Reset Search ──
  window.newSearch = function () {
    resultSection.classList.remove("visible");
    nameInput.value = "";
    rollInput.value = "";
    classSelect.value = "";
    clearErrors();
    window.scrollTo({ top: 0, behavior: "smooth" });
    nameInput.focus();
  };

  // ── Event Listeners ──
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchStudent();
  });

  btnReset.addEventListener("click", () => {
    nameInput.value = "";
    rollInput.value = "";
    classSelect.value = "";
    clearErrors();
    resultSection.classList.remove("visible");
    nameInput.focus();
  });

  // Clear errors on typing
  [nameInput, rollInput, classSelect].forEach((el) => {
    el.addEventListener("input", () => el.closest(".form-group").classList.remove("error"));
    el.addEventListener("change", () => el.closest(".form-group").classList.remove("error"));
  });

  // Format roll input
  rollInput.addEventListener("input", () => {
    rollInput.value = rollInput.value.toUpperCase();
  });
});
