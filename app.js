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
    const rollNumOnly = parseInt(rollRaw.replace(/\D/g, ""), 10);
    const cls = classSelect.value.toUpperCase();

    // Show loading state
    btnCheck.classList.add("btn-loading");

    setTimeout(() => {
      btnCheck.classList.remove("btn-loading");

      let scoredStudents = window.STUDENTS_DATA.map((s) => {
        let score = 0;

        // 1. Class Score (High Weight: 50 pts)
        const sClass = s.class.toUpperCase();
        if (cls) {
          if (
            sClass === cls ||
            `S${sClass}` === cls ||
            `C${sClass}` === cls ||
            cls.replace(/^[SC]/, "") === sClass
          ) {
            score += 50;
          } else {
            // Class mismatch penalty
            score -= 100;
          }
        }

        // 2. Register Number / Roll Score (High Weight: 50 pts)
        if (rollRaw) {
          if (s.regNo && s.regNo.toUpperCase() === rollRaw) {
            score += 50;
          } else if (!isNaN(rollNumOnly) && s.slNo === rollNumOnly) {
            score += 50;
          } else if (
            s.registerNumber.toUpperCase() === rollRaw ||
            s.rollNumber.toUpperCase() === rollRaw ||
            (s.regCode && s.regCode.toUpperCase() === rollRaw) ||
            (s.altRollNumber && s.altRollNumber.toUpperCase() === rollRaw)
          ) {
            score += 50;
          }
        }

        // 3. Name Score (Token & Substring Weight: up to 40 pts)
        if (nameTokens.length > 0) {
          const sNameLower = s.name.toLowerCase();
          let nameScore = 0;

          if (sNameLower.includes(nameRaw)) {
            nameScore += 40; // Exact substring match
          } else {
            nameTokens.forEach((token) => {
              if (sNameLower.includes(token)) {
                nameScore += 20; // Partial word match
              }
            });
          }
          score += Math.min(nameScore, 40);
        }

        return { student: s, score: score };
      });

      // Filter candidates with positive score
      scoredStudents = scoredStudents.filter((item) => item.score > 0);

      // Sort by highest score descending
      scoredStudents.sort((a, b) => b.score - a.score);

      if (scoredStudents.length === 0) {
        showToast("No student found matching these details. Please verify the roll number or class.", "error");
        resultSection.classList.remove("visible");
        return;
      }

      const topMatch = scoredStudents[0].student;
      showToast(`Verification successful! Marksheet generated for ${topMatch.name}.`, "success");
      displayResult(topMatch);
    }, 400);
  }

  // ── Display Result Card ──
  function displayResult(student) {
    // Student Info
    document.getElementById("resStudentName").textContent = student.name;
    document.getElementById("resRollNumber").textContent = student.registerNumber || student.rollNumber;

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
