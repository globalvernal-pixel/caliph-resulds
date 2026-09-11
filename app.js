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

        // 2. Register Number / Roll Number matching (STRICT EXACT MATCH)
        if (rollRaw) {
          const sRegNo = (s.regNo || "").toUpperCase();
          const sRegNum = (s.registerNumber || "").toUpperCase();
          const sRollNum = String(s.rollNumber || "").toUpperCase();
          const sSlNo = String(s.slNo || "").toUpperCase();
          const sRegCode = (s.regCode || "").toUpperCase();

          if (sRegNo === rollRaw || sRegNum === rollRaw) {
            score += 1000; // Exact 8-digit Register Number match
          } else if (sRollNum === rollRaw || sSlNo === rollRaw || sRegCode === rollRaw) {
            score += 800; // Exact Roll Number / SlNo match
          } else {
            // Disqualify student if specified Register Number / Roll Number does not match
            return { student: s, score: -10000 };
          }
        }

        // 3. Student Name matching
        if (nameRaw) {
          function normalizeToken(token) {
            return token
              .toLowerCase()
              .replace(/^moha[mm]+ed$|^muha[mm]+ed$|^muha[mm]+ad$|^moha[mm]+ad$/g, "muhammad")
              .replace(/^ahmed$|^ahmedd$|^ahammed$|^ahmmed$/g, "ahammed")
              .replace(/^fatima$|^fathima$/g, "fathima")
              .replace(/^ayesha$|^ayisha$|^aysha$/g, "ayisha")
              .replace(/^sayyid$|^syed$/g, "sayyid");
          }

          function cleanString(str) {
            return str
              .toLowerCase()
              .replace(/[^a-z0-9\s]/g, " ")
              .split(/\s+/)
              .filter(Boolean)
              .map(normalizeToken)
              .join(" ");
          }

          const normQuery = cleanString(nameRaw);
          const normStudentName = cleanString(s.name);

          const queryTokens = normQuery.split(" ");
          const studentTokens = normStudentName.split(" ");

          if (normStudentName === normQuery) {
            score += 1000; // Exact normalized full name match
          } else if (normStudentName.startsWith(normQuery) || normStudentName.endsWith(normQuery)) {
            score += 700; // Starts or ends with full query
          } else if (normStudentName.includes(normQuery)) {
            score += 500; // Contains full query string
          } else {
            let matchedCount = 0;
            queryTokens.forEach((qt) => {
              if (studentTokens.includes(qt)) {
                matchedCount++;
              }
            });

            if (matchedCount > 0) {
              const matchRatio = matchedCount / Math.max(queryTokens.length, studentTokens.length);
              score += Math.round(matchRatio * 400);
            } else {
              score -= 300; // Mismatch penalty
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

    const statusEl = document.getElementById("overallStatus");
    statusEl.textContent = `OVERALL RESULT: ${student.status}`;
    statusEl.className = `overall-status-card ${student.status === "PASSED" ? "overall-passed" : "overall-failed"}`;

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
