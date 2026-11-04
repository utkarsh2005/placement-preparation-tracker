(() => {
  "use strict";

  const STORE_KEY = "orbit-placement-tracker-v1";
  const STATUSES = ["Applied", "Online Assessment", "Interview", "Offer", "Rejected", "Saved"];
  const ROUTES = {
    dashboard: "Overview",
    jobs: "Explore jobs",
    applications: "Applications",
    interviews: "Interviews",
    resumes: "My resumes",
    admin: "Admin dashboard",
  };

  const starterData = {
    profile: { name: "Utkarsh Umang", branch: "Computer Science", graduationYear: 2027, cgpa: 8.4 },
    companies: [
      { id: "c-google", name: "Google", logo: "G", color: "google" },
      { id: "c-amazon", name: "Amazon", logo: "a", color: "amazon" },
      { id: "c-atlassian", name: "Atlassian", logo: "A", color: "atlassian" },
      { id: "c-razorpay", name: "Razorpay", logo: "R", color: "razorpay" },
      { id: "c-zoho", name: "Zoho", logo: "Z", color: "zoho" },
    ],
    jobs: [
      { id: "j-google", company: "Google", title: "Software Engineer, University Graduate", location: "Bengaluru, India", type: "Full-time", salary: "₹32–45 LPA", minCgpa: 7.5, branches: ["Computer Science", "Information Technology"], year: 2027, posted: "2 days ago", deadline: "Nov 12, 2026", description: "Build products used by billions. Work with a collaborative team to design, develop, and launch scalable software.", status: "Open" },
      { id: "j-amazon", company: "Amazon", title: "SDE I — Campus Hiring", location: "Hyderabad, India", type: "Full-time", salary: "₹28–38 LPA", minCgpa: 7, branches: ["Computer Science", "Information Technology", "Electronics"], year: 2027, posted: "1 day ago", deadline: "Nov 18, 2026", description: "Join a fast-moving team solving real customer problems through resilient, highly available services.", status: "Open" },
      { id: "j-atlassian", company: "Atlassian", title: "Graduate Software Engineer", location: "Remote / Bengaluru", type: "Full-time", salary: "₹24–30 LPA", minCgpa: 7.5, branches: ["Computer Science", "Information Technology"], year: 2027, posted: "3 days ago", deadline: "Nov 20, 2026", description: "Help teams everywhere work better together. Build thoughtful experiences across our product suite.", status: "Open" },
      { id: "j-razorpay", company: "Razorpay", title: "Product Engineer Intern", location: "Bengaluru, India", type: "Internship", salary: "₹75k / month", minCgpa: 7, branches: ["Computer Science", "Information Technology", "Electronics"], year: 2027, posted: "4 days ago", deadline: "Nov 08, 2026", description: "Shape the future of digital payments by shipping reliable product features used by businesses across India.", status: "Open" },
      { id: "j-zoho", company: "Zoho", title: "Member Technical Staff", location: "Chennai, India", type: "Full-time", salary: "₹12–16 LPA", minCgpa: 6.5, branches: ["Computer Science", "Information Technology", "Electronics", "Mechanical"], year: 2027, posted: "5 days ago", deadline: "Nov 25, 2026", description: "Take ownership of end-to-end software development and create products that delight millions of users.", status: "Open" },
      { id: "j-nvidia", company: "NVIDIA", title: "Systems Software Intern", location: "Pune, India", type: "Internship", salary: "₹85k / month", minCgpa: 8.5, branches: ["Computer Science", "Electronics"], year: 2027, posted: "6 days ago", deadline: "Nov 16, 2026", description: "Explore high-performance systems and contribute to software at the intersection of accelerated computing and AI.", status: "Open" },
    ],
    applications: [
      { id: "a-google", jobId: "j-google", status: "Interview", appliedOn: "Oct 18, 2026", rounds: [{ name: "Online Assessment", done: true }, { name: "Technical Interview", done: false, date: "2026-11-02T10:30:00" }, { name: "Final Interview", done: false }] },
      { id: "a-amazon", jobId: "j-amazon", status: "Online Assessment", appliedOn: "Oct 22, 2026", rounds: [{ name: "Online Assessment", done: false, date: "2026-11-05T14:00:00" }, { name: "Technical Interview", done: false }, { name: "Bar Raiser", done: false }] },
      { id: "a-razorpay", jobId: "j-razorpay", status: "Applied", appliedOn: "Oct 25, 2026", rounds: [{ name: "Resume Screening", done: true }, { name: "Technical Interview", done: false, date: "2026-11-09T11:00:00" }, { name: "Culture Fit", done: false }] },
    ],
    resumes: [],
    savedJobIds: ["j-atlassian"],
    students: [
      { id: "s1", name: "Utkarsh Umang", email: "utkarsh.umang@campus.edu", branch: "Computer Science", cgpa: 8.4, status: "In process" },
      { id: "s2", name: "Diya Patel", email: "diya.patel@campus.edu", branch: "Information Technology", cgpa: 9.1, status: "Placed" },
      { id: "s3", name: "Kabir Mehta", email: "kabir.mehta@campus.edu", branch: "Electronics", cgpa: 7.8, status: "In process" },
      { id: "s4", name: "Ananya Iyer", email: "ananya.iyer@campus.edu", branch: "Computer Science", cgpa: 8.9, status: "Placed" },
      { id: "s5", name: "Rehan Khan", email: "rehan.khan@campus.edu", branch: "Mechanical", cgpa: 7.2, status: "Seeking" },
    ],
  };

  const root = document.querySelector("#view-root");
  const dialog = document.querySelector("#app-dialog");
  const dialogContent = document.querySelector("#dialog-content");
  const toastRegion = document.querySelector("#toast-region");
  let state = loadState();
  let currentPage = "dashboard";
  let jobFilter = "All";
  let searchTerm = "";
  let adminTab = "Overview";

  function loadState() {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (!saved) return structuredClone(starterData);
      const parsed = JSON.parse(saved);
      const restored = { ...structuredClone(starterData), ...parsed };
      let migrated = false;
      if (restored.profile?.name === "Aarav Sharma") {
        restored.profile.name = "Utkarsh Umang";
        migrated = true;
      }
      restored.students = restored.students.map((student) => {
        if (student.id === "s1" && student.name === "Aarav Sharma") {
          migrated = true;
          return { ...student, name: "Utkarsh Umang", email: "utkarsh.umang@campus.edu" };
        }
        return student;
      });
      if (migrated) {
        try {
          localStorage.setItem(STORE_KEY, JSON.stringify(restored));
        } catch (error) {
          console.error("Could not save the updated profile name.", error);
        }
      }
      return restored;
    } catch (error) {
      console.error("Could not load saved placement tracker data.", error);
      return structuredClone(starterData);
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      console.error("Could not save placement tracker data.", error);
      toast("Your browser could not save this change. Check available storage.", "error");
      return false;
    }
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[char]);
  }

  function toast(message, type = "success") {
    const item = document.createElement("div");
    item.className = `toast ${type}`;
    item.textContent = message;
    toastRegion.append(item);
    window.setTimeout(() => item.remove(), 3200);
  }

  function companyFor(job) {
    return state.companies.find((company) => company.name === job.company) ||
      { name: job.company, logo: job.company.slice(0, 1).toUpperCase(), color: "" };
  }

  function logoMarkup(job) {
    const company = companyFor(job);
    return `<span class="company-logo ${company.color ? `logo-${escapeHtml(company.color)}` : ""}">${escapeHtml(company.logo || company.name.slice(0, 1))}</span>`;
  }

  function jobFor(application) {
    return state.jobs.find((job) => job.id === application.jobId);
  }

  function eligible(job) {
    const branchMatch = !job.branches?.length || job.branches.includes(state.profile.branch);
    return state.profile.cgpa >= Number(job.minCgpa || 0) && branchMatch &&
      Number(job.year || state.profile.graduationYear) === Number(state.profile.graduationYear);
  }

  function applicationFor(jobId) {
    return state.applications.find((application) => application.jobId === jobId);
  }

  function initials(name) {
    return name.split(/\s+/).slice(0, 2).map((part) => part[0] || "").join("").toUpperCase();
  }

  function updateChrome() {
    document.querySelector("#page-crumb").textContent = ROUTES[currentPage];
    document.querySelector("#job-nav-count").textContent = state.jobs.filter((job) => !applicationFor(job.id)).length;
    document.querySelector("#sidebar-name").textContent = state.profile.name;
    document.querySelector("#sidebar-role").textContent = document.body.dataset.mode === "admin" ? "Admin account" : "Student account";
    document.querySelectorAll(".nav-link").forEach((link) => link.classList.toggle("active", link.dataset.page === currentPage));
    document.querySelector("#profile-switch .avatar").textContent = initials(state.profile.name);
    document.querySelector(".top-avatar").textContent = initials(state.profile.name);
  }

  function pageHeading(title, subtitle, actions = "") {
    return `<div class="page-heading"><div><p class="eyebrow">PLACEMENT SEASON 2026–27</p><h1>${title}</h1><p class="page-subtitle">${subtitle}</p></div>${actions ? `<div class="heading-actions">${actions}</div>` : ""}</div>`;
  }

  function metric(label, value, icon, foot) {
    return `<article class="metric-card"><div class="metric-top"><span>${label}</span><span class="metric-icon">${icon}</span></div><div class="metric-value">${value}</div><div class="metric-foot">${foot}</div></article>`;
  }

  function jobRow(job) {
    return `<div class="job-row">${logoMarkup(job)}<div class="job-info"><strong>${escapeHtml(job.title)}</strong><span>${escapeHtml(job.company)} · ${escapeHtml(job.location)}</span></div><div class="job-row-side"><span class="job-salary">${escapeHtml(job.salary)}</span><span class="job-tag">${escapeHtml(job.type)}</span></div></div>`;
  }

  function renderDashboard() {
    const openJobs = state.jobs.filter((job) => job.status !== "Closed");
    const interviews = state.applications.flatMap((application) => (application.rounds || [])
      .filter((round) => round.date && !round.done)
      .map((round) => ({ application, round, job: jobFor(application) })))
      .filter((item) => item.job);
    const offers = state.applications.filter((application) => application.status === "Offer").length;
    const inProgress = state.applications.filter((application) => !["Offer", "Rejected"].includes(application.status)).length;
    const recentJobs = [...openJobs].sort((a, b) => a.deadline.localeCompare(b.deadline)).slice(0, 4);
    const activity = state.applications.slice(-3).reverse().map((application) => {
      const job = jobFor(application);
      return job ? `<div class="activity-item"><span class="activity-dot"></span><div class="activity-copy"><strong>${escapeHtml(application.status)} · ${escapeHtml(job.company)}</strong><p>${escapeHtml(job.title)}</p><time>Applied ${escapeHtml(application.appliedOn)}</time></div></div>` : "";
    }).join("");
    const name = escapeHtml(state.profile.name.split(" ")[0]);
    root.innerHTML = `
      <section class="welcome-banner"><div class="welcome-copy"><div class="welcome-kicker">YOUR NEXT CHAPTER STARTS HERE</div><h1>Good morning, ${name} <span aria-hidden="true">✦</span></h1><p>Keep your momentum going. There are ${openJobs.length} opportunities waiting for you.</p><button class="btn" data-page="jobs">Explore opportunities <span>→</span></button></div><div class="welcome-art" aria-hidden="true"><span class="art-ring"></span><span class="art-briefcase">▱</span><span class="art-star one">✳</span><span class="art-star two">✦</span></div></section>
      <div class="metrics-grid">
        ${metric("Open opportunities", openJobs.length, "↗", '<span class="positive">+3</span> added this week')}
        ${metric("Active applications", inProgress, "◷", `${state.applications.length} total applications`)}
        ${metric("Upcoming interviews", interviews.length, "▦", interviews.length ? "Your next steps are lined up" : "No interviews scheduled")}
        ${metric("Offers received", offers, "✧", offers ? "Congratulations on your progress!" : "Your next win is ahead")}
      </div>
      <div class="content-grid">
        <section class="panel"><div class="panel-header"><div><h2 class="panel-title">Recommended for you</h2><p class="panel-subtitle">A few opportunities picked for your profile</p></div><button class="text-link" data-page="jobs">View all jobs →</button></div><div class="job-list">${recentJobs.map(jobRow).join("")}</div></section>
        <section class="panel"><div class="panel-header"><div><h2 class="panel-title">Recent activity</h2><p class="panel-subtitle">Your placement journey, at a glance</p></div></div><div class="activity-list">${activity || '<div class="empty-state"><strong>No activity yet</strong><p>Apply to a role to see your progress here.</p></div>'}</div></section>
      </div>
      <section class="panel progress-panel"><div class="panel-header"><div><h2 class="panel-title">Your placement progress</h2><p class="panel-subtitle">Small steps add up to big milestones</p></div><span class="job-tag green">${state.applications.length ? "In motion" : "Just getting started"}</span></div><div class="progress-label"><span>Applications started</span><strong>${state.applications.length} of 10</strong></div><div class="progress-track"><div class="progress-fill" style="width:${Math.min(100, state.applications.length * 10)}%"></div></div></section>`;
  }

  function jobCard(job) {
    const app = applicationFor(job.id);
    const saved = state.savedJobIds.includes(job.id);
    const isEligible = eligible(job);
    const criteria = `CGPA ${Number(job.minCgpa || 0).toFixed(1)}+ · ${escapeHtml(job.year || state.profile.graduationYear)} batch`;
    return `<article class="job-card"><div class="job-card-top">${logoMarkup(job)}<div class="job-card-title"><h3>${escapeHtml(job.title)}</h3><p>${escapeHtml(job.company)} · ${escapeHtml(job.location)}</p></div><button class="bookmark-button ${saved ? "saved" : ""}" data-action="bookmark" data-id="${escapeHtml(job.id)}" aria-label="${saved ? "Remove saved job" : "Save job"}">${saved ? "★" : "☆"}</button></div><p class="job-card-description">${escapeHtml(job.description)}</p><div class="job-meta"><span>${escapeHtml(job.type)}</span><span>${escapeHtml(job.salary)}</span><span>${criteria}</span></div><p class="eligibility-note ${isEligible ? "" : "not-eligible"}">${isEligible ? "✓ You meet the listed eligibility criteria" : "ⓘ You may not meet the listed eligibility criteria"}</p><div class="job-card-footer"><button class="text-link" data-action="job-details" data-id="${escapeHtml(job.id)}">Details</button>${app ? `<button class="btn btn-secondary btn-small" data-page="applications">${escapeHtml(app.status)}</button>` : `<button class="btn btn-primary btn-small" data-action="apply" data-id="${escapeHtml(job.id)}">Apply now <span>→</span></button>`}</div></article>`;
  }

  function renderJobs() {
    const query = searchTerm.trim().toLowerCase();
    const available = state.jobs.filter((job) => job.status !== "Closed");
    const filtered = available.filter((job) => {
      const matchesQuery = !query || [job.title, job.company, job.location, job.type, job.description].join(" ").toLowerCase().includes(query);
      const matchesFilter = jobFilter === "All" || (jobFilter === "Eligible" && eligible(job)) ||
        (jobFilter === "Saved" && state.savedJobIds.includes(job.id)) ||
        (jobFilter === "Internships" && job.type.toLowerCase().includes("intern"));
      return matchesQuery && matchesFilter;
    });
    root.innerHTML = `${pageHeading("Explore opportunities", "Find the right role and take the next step in your career.", '<button class="btn btn-secondary" data-page="applications">◷ &nbsp;My applications</button>')}
      <div class="toolbar"><div class="filter-row">${["All", "Eligible", "Saved", "Internships"].map((filter) => `<button class="filter-chip ${jobFilter === filter ? "active" : ""}" data-action="filter" data-filter="${filter}">${filter}</button>`).join("")}</div><span class="page-subtitle">${filtered.length} opportunities</span></div>
      <div class="jobs-grid">${filtered.length ? filtered.map(jobCard).join("") : '<div class="empty-state"><strong>No matching opportunities</strong><p>Try changing your search or clearing the selected filter.</p></div>'}</div>`;
  }

  function statusClass(status) {
    if (status === "Interview" || status === "Online Assessment") return "status-interview";
    if (status === "Offer") return "status-offer";
    if (status === "Rejected") return "status-rejected";
    if (status === "Saved") return "status-saved";
    return "";
  }

  function renderApplications() {
    const rows = state.applications.map((application) => {
      const job = jobFor(application);
      if (!job) return "";
      return `<tr><td><span class="table-primary">${escapeHtml(job.company)}</span><br><span>${escapeHtml(job.title)}</span></td><td>${escapeHtml(application.appliedOn)}</td><td><span class="status-pill ${statusClass(application.status)}">${escapeHtml(application.status)}</span></td><td><div class="round-list">${(application.rounds || []).map((round) => `<span class="round-tag ${round.done ? "done" : ""}">${round.done ? "✓ " : ""}${escapeHtml(round.name)}</span>`).join("")}</div></td><td><select class="status-select" data-action="status" data-id="${escapeHtml(application.id)}" aria-label="Update status for ${escapeHtml(job.company)}">${STATUSES.filter((status) => status !== "Saved").map((status) => `<option ${application.status === status ? "selected" : ""}>${status}</option>`).join("")}</select></td><td><button class="text-link" data-action="remove-application" data-id="${escapeHtml(application.id)}" aria-label="Remove ${escapeHtml(job.company)} application">Remove</button></td></tr>`;
    }).join("");
    root.innerHTML = `${pageHeading("Your applications", "Keep every application and interview stage in one place.", '<button class="btn btn-primary" data-page="jobs">＋ &nbsp;Find a job</button>')}
      <div class="metrics-grid">${metric("Applications", state.applications.length, "◷", "Across all active roles")}${metric("In progress", state.applications.filter((app) => !["Offer", "Rejected"].includes(app.status)).length, "↗", "Keep the momentum going")}${metric("Interviews", state.applications.filter((app) => app.status === "Interview").length, "▦", "Roles at interview stage")}${metric("Offers", state.applications.filter((app) => app.status === "Offer").length, "✧", "Your wins so far")}</div>
      <section class="panel"><div class="panel-header"><div><h2 class="panel-title">Application tracker</h2><p class="panel-subtitle">Update a status as you move through each process</p></div></div><div class="table-wrap"><table><thead><tr><th>Company / role</th><th>Applied on</th><th>Status</th><th>Recruitment rounds</th><th>Update status</th><th></th></tr></thead><tbody>${rows || `<tr><td colspan="6"><div class="empty-state"><strong>No applications yet</strong><p>Explore open roles and apply to start tracking your progress.</p></div></td></tr>`}</tbody></table></div></section>`;
  }

  function formatInterviewDate(date) {
    const parsed = new Date(date);
    return { day: new Intl.DateTimeFormat("en", { day: "2-digit" }).format(parsed), month: new Intl.DateTimeFormat("en", { month: "short" }).format(parsed), full: new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(parsed), time: new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(parsed) };
  }

  function renderInterviews() {
    const interviews = state.applications.flatMap((application) => (application.rounds || [])
      .filter((round) => round.date && !round.done)
      .map((round, index) => ({ application, round, index, job: jobFor(application) })))
      .filter((item) => item.job)
      .sort((a, b) => new Date(a.round.date) - new Date(b.round.date));
    const cards = interviews.map(({ application, round, index, job }) => {
      const date = formatInterviewDate(round.date);
      return `<article class="interview-card"><div class="date-block"><strong>${date.day}</strong><span>${date.month}</span></div><div class="interview-info"><strong>${escapeHtml(round.name)} · ${escapeHtml(job.company)}</strong><p>${escapeHtml(job.title)}</p><small>${escapeHtml(date.full)} at ${escapeHtml(date.time)} · ${escapeHtml(job.location)}</small></div><button class="btn btn-secondary btn-small" data-action="complete-round" data-id="${escapeHtml(application.id)}" data-index="${index}">Mark complete</button></article>`;
    }).join("");
    root.innerHTML = `${pageHeading("Interview calendar", "Get ready for every conversation and celebrate each milestone.", '<button class="btn btn-secondary" data-page="applications">◷ &nbsp;Application tracker</button>')}
      <div class="metrics-grid">${metric("Upcoming rounds", interviews.length, "▦", "Scheduled across your applications")}${metric("Applications in process", state.applications.filter((app) => !["Offer", "Rejected"].includes(app.status)).length, "◷", "Keep your preparation focused")}${metric("Rounds completed", state.applications.reduce((sum, app) => sum + (app.rounds || []).filter((round) => round.done).length, 0), "✓", "Every round is progress")}${metric("Offers", state.applications.filter((app) => app.status === "Offer").length, "✧", "The goal is in sight")}</div>
      <section class="panel"><div class="panel-header"><div><h2 class="panel-title">Upcoming interviews</h2><p class="panel-subtitle">Your scheduled recruitment rounds</p></div></div>${cards || '<div class="empty-state"><strong>Your calendar is clear</strong><p>Scheduled rounds from your application tracker will show up here.</p></div>'}</section>`;
  }

  function renderResumes() {
    const cards = state.resumes.map((resume) => `<article class="resume-card"><span class="resume-icon">▤</span><div class="resume-copy"><strong>${escapeHtml(resume.name)}</strong><small>Added ${escapeHtml(resume.addedOn)} · ${escapeHtml(resume.sizeLabel)}</small></div><div class="resume-actions">${resume.data ? `<a class="btn btn-secondary btn-small" href="${resume.data}" download="${escapeHtml(resume.name)}">Download</a>` : ""}<button class="btn btn-danger btn-small" data-action="remove-resume" data-id="${escapeHtml(resume.id)}">Remove</button></div></article>`).join("");
    root.innerHTML = `${pageHeading("My resumes", "Keep your latest resume ready for every opportunity.", '<button class="btn btn-primary" data-action="scroll-upload">＋ &nbsp;Upload resume</button>')}
      <div class="content-grid"><section class="panel"><div class="panel-header"><div><h2 class="panel-title">Resume library</h2><p class="panel-subtitle">Your uploaded documents are saved in this browser</p></div><span class="job-tag">${state.resumes.length} ${state.resumes.length === 1 ? "file" : "files"}</span></div><div class="job-list">${cards || '<div class="empty-state"><strong>No resumes uploaded</strong><p>Add a PDF or Word document to keep it close at hand.</p></div>'}</div></section><section class="panel"><div class="panel-header"><div><h2 class="panel-title">Quick tip</h2><p class="panel-subtitle">Make your application stand out</p></div></div><p class="page-subtitle" style="line-height:1.8">Tailor your resume to each role, highlight measurable impact, and keep your most recent version easy to find. Your files stay in this browser and are not sent to a server.</p></section></div>
      <div class="upload-drop" id="upload-drop"><div><span class="upload-symbol">↑</span><strong>Drop your resume here</strong><p>PDF or Word document · Maximum file size 3 MB</p><label for="resume-file">Browse files</label><input id="resume-file" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" /></div></div>`;
  }

  function renderAdminOverview() {
    const placed = state.students.filter((student) => student.status === "Placed").length;
    const placementRate = state.students.length ? Math.round((placed / state.students.length) * 100) : 0;
    const activeDrives = state.jobs.filter((job) => job.status !== "Closed").length;
    const activityMonths = [
      { label: "Jun", year: 2026 }, { label: "Jul", year: 2026 }, { label: "Aug", year: 2026 },
      { label: "Sep", year: 2026 }, { label: "Oct", year: 2026 }, { label: "Nov", year: 2026 },
      { label: "Dec", year: 2026 }, { label: "Jan", year: 2027 }, { label: "Feb", year: 2027 },
      { label: "Mar", year: 2027 }, { label: "Apr", year: 2027 }, { label: "May", year: 2027 },
    ];
    const activityCounts = activityMonths.map(({ label, year }) => state.applications.filter((application) => {
      const appliedOn = new Date(application.appliedOn);
      return appliedOn.getFullYear() === year && appliedOn.toLocaleString("en", { month: "short" }) === label;
    }).length);
    const busiestMonth = Math.max(1, ...activityCounts);
    return `<div class="admin-stat-grid"><article class="admin-stat"><span>Total students</span><strong>${state.students.length}</strong></article><article class="admin-stat"><span>Placed students</span><strong>${placed}</strong></article><article class="admin-stat"><span>Placement rate</span><strong>${placementRate}%</strong></article><article class="admin-stat"><span>Active drives</span><strong>${activeDrives}</strong></article></div>
      <div class="content-grid"><section class="panel"><div class="panel-header"><div><h2 class="panel-title">Application activity</h2><p class="panel-subtitle">Applications started throughout the season</p></div><span class="job-tag green">2026–27</span></div><div class="chart-bars">${activityMonths.map(({ label }, index) => { const count = activityCounts[index]; const height = count ? Math.max(8, Math.round((count / busiestMonth) * 100)) : 3; return `<div class="chart-column"><small>${count}</small><div class="chart-bar" style="height:${height}%"></div><span>${label}</span></div>`; }).join("")}</div></section><section class="panel"><div class="panel-header"><div><h2 class="panel-title">Placement snapshot</h2><p class="panel-subtitle">Current student outcomes</p></div></div><div class="progress-label"><span>Placed</span><strong>${placed} / ${state.students.length}</strong></div><div class="progress-track"><div class="progress-fill" style="width:${placementRate}%"></div></div><div class="progress-label"><span>In process</span><strong>${state.students.filter((student) => student.status === "In process").length}</strong></div><div class="progress-track"><div class="progress-fill" style="width:${state.students.length ? Math.round((state.students.filter((student) => student.status === "In process").length / state.students.length) * 100) : 0}%;background:linear-gradient(90deg,#65b89b,#9bd9c4)"></div></div><div class="progress-label"><span>Seeking opportunities</span><strong>${state.students.filter((student) => student.status === "Seeking").length}</strong></div></section></div>
      <div class="admin-bottom-grid"><section class="panel"><div class="panel-header"><div><h2 class="panel-title">Recent recruitment drives</h2><p class="panel-subtitle">Open and upcoming company drives</p></div><button class="text-link" data-action="admin-tab" data-tab="Drives">Manage drives →</button></div><div class="job-list">${state.jobs.slice(0, 4).map((job) => `<div class="job-row">${logoMarkup(job)}<div class="job-info"><strong>${escapeHtml(job.company)}</strong><span>${escapeHtml(job.title)}</span></div><span class="drive-status ${job.status === "Upcoming" ? "upcoming" : ""}">${escapeHtml(job.status || "Open")}</span></div>`).join("")}</div></section><section class="panel"><div class="panel-header"><div><h2 class="panel-title">Top hiring companies</h2><p class="panel-subtitle">Companies with active opportunities</p></div><button class="text-link" data-action="admin-tab" data-tab="Companies">View all →</button></div><div class="job-list">${state.companies.slice(0, 5).map((company) => `<div class="job-row"><span class="company-logo ${company.color ? `logo-${escapeHtml(company.color)}` : ""}">${escapeHtml(company.logo)}</span><div class="job-info"><strong>${escapeHtml(company.name)}</strong><span>${state.jobs.filter((job) => job.company === company.name).length} open opportunities</span></div></div>`).join("")}</div></section></div>`;
  }

  function renderAdminStudents() {
    const rows = state.students.map((student) => `<tr><td class="table-primary">${escapeHtml(student.name)}</td><td>${escapeHtml(student.email)}</td><td>${escapeHtml(student.branch)}</td><td>${Number(student.cgpa).toFixed(1)}</td><td><select class="status-select" data-action="student-status" data-id="${escapeHtml(student.id)}" aria-label="Update placement status for ${escapeHtml(student.name)}">${["Seeking", "In process", "Placed"].map((status) => `<option ${student.status === status ? "selected" : ""}>${status}</option>`).join("")}</select></td><td><button class="text-link" data-action="delete-student" data-id="${escapeHtml(student.id)}">Remove</button></td></tr>`).join("");
    return `<section class="panel"><div class="panel-header"><div><h2 class="panel-title">Student directory</h2><p class="panel-subtitle">Manage student profiles and placement outcomes</p></div><div class="heading-actions"><span class="job-tag">${state.students.length} students</span><button class="btn btn-primary btn-small" data-action="new-student">＋ Add student</button></div></div><div class="table-wrap"><table><thead><tr><th>Student</th><th>Email</th><th>Department</th><th>CGPA</th><th>Placement status</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
  }

  function renderAdminDrives() {
    const rows = state.jobs.map((job) => `<tr><td><span class="table-primary">${escapeHtml(job.company)}</span><br><span>${escapeHtml(job.title)}</span></td><td>${escapeHtml(job.type)}</td><td>${escapeHtml(job.deadline)}</td><td>${escapeHtml(job.salary)}</td><td><span class="drive-status ${job.status === "Upcoming" ? "upcoming" : ""}">${escapeHtml(job.status || "Open")}</span></td><td><button class="text-link" data-action="delete-job" data-id="${escapeHtml(job.id)}">Remove</button></td></tr>`).join("");
    return `<section class="panel"><div class="panel-header"><div><h2 class="panel-title">Recruitment drives</h2><p class="panel-subtitle">Create and manage the opportunities students can discover</p></div><button class="btn btn-primary btn-small" data-action="new-job">＋ Add drive</button></div><div class="table-wrap"><table><thead><tr><th>Company / position</th><th>Type</th><th>Deadline</th><th>Compensation</th><th>Status</th><th></th></tr></thead><tbody>${rows || '<tr><td colspan="6">No drives available.</td></tr>'}</tbody></table></div></section>`;
  }

  function renderAdminCompanies() {
    const rows = state.companies.map((company) => `<div class="job-row"><span class="company-logo ${company.color ? `logo-${escapeHtml(company.color)}` : ""}">${escapeHtml(company.logo || company.name.slice(0, 1))}</span><div class="job-info"><strong>${escapeHtml(company.name)}</strong><span>${state.jobs.filter((job) => job.company === company.name).length} associated drives</span></div><button class="text-link" data-action="delete-company" data-id="${escapeHtml(company.id)}">Remove</button></div>`).join("");
    return `<section class="panel"><div class="panel-header"><div><h2 class="panel-title">Company directory</h2><p class="panel-subtitle">Companies participating in campus recruitment</p></div><button class="btn btn-primary btn-small" data-action="new-company">＋ Add company</button></div><div class="job-list">${rows || '<div class="empty-state"><strong>No companies yet</strong><p>Add a company to start managing campus relationships.</p></div>'}</div></section>`;
  }

  function renderAdmin() {
    const tabs = ["Overview", "Students", "Drives", "Companies"];
    const content = adminTab === "Students" ? renderAdminStudents() :
      adminTab === "Drives" ? renderAdminDrives() :
      adminTab === "Companies" ? renderAdminCompanies() : renderAdminOverview();
    root.innerHTML = `${pageHeading("Admin dashboard", "Manage campus recruitment, student outcomes, and company drives.", '<button class="btn btn-primary" data-action="new-job">＋ &nbsp;Add recruitment drive</button>')}<div class="admin-tabs">${tabs.map((tab) => `<button class="admin-tab ${adminTab === tab ? "active" : ""}" data-action="admin-tab" data-tab="${tab}">${tab}</button>`).join("")}</div>${content}`;
  }

  function render() {
    updateChrome();
    if (currentPage === "jobs") renderJobs();
    else if (currentPage === "applications") renderApplications();
    else if (currentPage === "interviews") renderInterviews();
    else if (currentPage === "resumes") renderResumes();
    else if (currentPage === "admin") renderAdmin();
    else renderDashboard();
  }

  function navigate(page) {
    if (!ROUTES[page]) return;
    currentPage = page;
    document.querySelector("#sidebar").classList.remove("open");
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function applyToJob(jobId) {
    const job = state.jobs.find((item) => item.id === jobId);
    if (!job || job.status === "Closed") return toast("This opportunity is no longer open.", "error");
    if (applicationFor(jobId)) return toast("You are already tracking this application.", "error");
    if (!eligible(job)) {
      showDialog(`<h2 class="dialog-title">Eligibility check</h2><p class="dialog-description">Based on the criteria listed by ${escapeHtml(job.company)}, this role may not match your current profile. You can still add it to your tracker if you have confirmed your eligibility with the recruiter.</p><div class="dialog-actions"><button class="btn btn-secondary" data-action="close-dialog">Not now</button><button class="btn btn-primary" data-action="confirm-apply" data-id="${escapeHtml(jobId)}">Track anyway</button></div>`);
      return;
    }
    createApplication(job);
  }

  function createApplication(job) {
    const today = new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", year: "numeric" }).format(new Date());
    state.applications.push({
      id: `a-${Date.now()}`, jobId: job.id, status: "Applied", appliedOn: today,
      rounds: [{ name: "Resume Screening", done: false }, { name: "Assessment", done: false }, { name: "Interview", done: false }],
    });
    persist();
    dialog.close();
    toast(`Application for ${job.company} added to your tracker.`);
    render();
  }

  function showDialog(markup) {
    dialogContent.innerHTML = markup;
    dialog.showModal();
  }

  function openJobDialog(jobId) {
    const job = state.jobs.find((item) => item.id === jobId);
    if (!job) return;
    showDialog(`<h2 class="dialog-title">${escapeHtml(job.title)}</h2><p class="dialog-description">${escapeHtml(job.company)} · ${escapeHtml(job.location)}<br><br>${escapeHtml(job.description)}<br><br><strong>Compensation:</strong> ${escapeHtml(job.salary)} &nbsp; <strong>Minimum CGPA:</strong> ${Number(job.minCgpa || 0).toFixed(1)}<br><strong>Eligible branches:</strong> ${escapeHtml((job.branches || []).join(", "))}<br><strong>Apply by:</strong> ${escapeHtml(job.deadline)}</p><div class="dialog-actions"><button class="btn btn-secondary" data-action="close-dialog">Close</button>${applicationFor(job.id) ? '<button class="btn btn-secondary" data-page="applications">View application</button>' : `<button class="btn btn-primary" data-action="apply" data-id="${escapeHtml(job.id)}">Apply now</button>`}</div>`);
  }

  function openJobForm() {
    const companyOptions = state.companies.map((company) => `<option value="${escapeHtml(company.name)}">${escapeHtml(company.name)}</option>`).join("");
    showDialog(`<h2 class="dialog-title">Add recruitment drive</h2><p class="dialog-description">Publish a new opportunity to the student job board.</p><form id="job-form"><div class="form-grid"><div class="form-field"><label for="job-company">Company</label><input id="job-company" name="company" list="company-options" required placeholder="Company name"><datalist id="company-options">${companyOptions}</datalist></div><div class="form-field"><label for="job-title">Job title</label><input id="job-title" name="title" required placeholder="Software Engineer"></div><div class="form-field"><label for="job-location">Location</label><input id="job-location" name="location" required placeholder="Bengaluru, India"></div><div class="form-field"><label for="job-type">Opportunity type</label><select id="job-type" name="type"><option>Full-time</option><option>Internship</option><option>Contract</option></select></div><div class="form-field"><label for="job-salary">Compensation</label><input id="job-salary" name="salary" required placeholder="₹18–24 LPA"></div><div class="form-field"><label for="job-cgpa">Minimum CGPA</label><input id="job-cgpa" name="minCgpa" type="number" step="0.1" min="0" max="10" value="7" required></div><div class="form-field"><label for="job-year">Graduation batch</label><input id="job-year" name="year" type="number" min="2020" max="2040" value="2027" required></div><div class="form-field"><label for="job-deadline">Application deadline</label><input id="job-deadline" name="deadline" required placeholder="Dec 15, 2026"></div><div class="form-field full"><label for="job-branches">Eligible branches (comma-separated)</label><input id="job-branches" name="branches" value="Computer Science, Information Technology" required></div><div class="form-field full"><label for="job-description">Description</label><textarea id="job-description" name="description" required placeholder="Describe the role and what students will work on."></textarea></div></div><div class="dialog-actions"><button type="button" class="btn btn-secondary" data-action="close-dialog">Cancel</button><button class="btn btn-primary" type="submit">Publish drive</button></div></form>`);
  }

  function openCompanyForm() {
    showDialog(`<h2 class="dialog-title">Add company</h2><p class="dialog-description">Add a company to the campus recruitment directory.</p><form id="company-form"><div class="form-field"><label for="company-name">Company name</label><input id="company-name" name="name" required placeholder="Company name"></div><div class="dialog-actions"><button type="button" class="btn btn-secondary" data-action="close-dialog">Cancel</button><button class="btn btn-primary" type="submit">Add company</button></div></form>`);
  }

  function openStudentForm() {
    showDialog(`<h2 class="dialog-title">Add student</h2><p class="dialog-description">Add a student profile to the placement directory.</p><form id="student-form"><div class="form-grid"><div class="form-field"><label for="student-name">Full name</label><input id="student-name" name="name" required placeholder="Student name"></div><div class="form-field"><label for="student-email">College email</label><input id="student-email" name="email" type="email" required placeholder="student@campus.edu"></div><div class="form-field"><label for="student-branch">Department</label><input id="student-branch" name="branch" required placeholder="Computer Science"></div><div class="form-field"><label for="student-cgpa">CGPA</label><input id="student-cgpa" name="cgpa" type="number" step="0.1" min="0" max="10" value="7" required></div><div class="form-field full"><label for="student-status">Placement status</label><select id="student-status" name="status"><option>Seeking</option><option>In process</option><option>Placed</option></select></div></div><div class="dialog-actions"><button type="button" class="btn btn-secondary" data-action="close-dialog">Cancel</button><button class="btn btn-primary" type="submit">Add student</button></div></form>`);
  }

  function handleRootClick(event) {
    const button = event.target.closest("[data-page], [data-action]");
    if (!button) return;
    if (button.dataset.page) {
      event.preventDefault();
      navigate(button.dataset.page);
      if (dialog.open) dialog.close();
      return;
    }
    const { action, id } = button.dataset;
    if (action === "filter") { jobFilter = button.dataset.filter; render(); }
    else if (action === "bookmark") {
      state.savedJobIds = state.savedJobIds.includes(id) ? state.savedJobIds.filter((savedId) => savedId !== id) : [...state.savedJobIds, id];
      persist(); render(); toast(state.savedJobIds.includes(id) ? "Opportunity saved." : "Opportunity removed from saved jobs.");
    } else if (action === "apply") applyToJob(id);
    else if (action === "confirm-apply") { const job = state.jobs.find((item) => item.id === id); if (job) createApplication(job); }
    else if (action === "job-details") openJobDialog(id);
    else if (action === "admin-tab") { adminTab = button.dataset.tab; render(); }
    else if (action === "new-job") openJobForm();
    else if (action === "new-company") openCompanyForm();
    else if (action === "new-student") openStudentForm();
    else if (action === "close-dialog") dialog.close();
    else if (action === "remove-application") {
      const app = state.applications.find((application) => application.id === id);
      if (app && window.confirm(`Remove this ${app.status.toLowerCase()} application from your tracker?`)) {
        state.applications = state.applications.filter((application) => application.id !== id);
        persist(); render(); toast("Application removed from your tracker.");
      }
    } else if (action === "complete-round") {
      const app = state.applications.find((application) => application.id === id);
      const round = app?.rounds?.[Number(button.dataset.index)];
      if (round) { round.done = true; persist(); render(); toast("Interview round marked complete."); }
    } else if (action === "remove-resume") {
      state.resumes = state.resumes.filter((resume) => resume.id !== id);
      persist(); render(); toast("Resume removed.");
    } else if (action === "scroll-upload") {
      document.querySelector("#upload-drop")?.scrollIntoView({ behavior: "smooth", block: "center" });
      document.querySelector("#resume-file")?.click();
    } else if (action === "delete-job") {
      const job = state.jobs.find((item) => item.id === id);
      if (job && window.confirm(`Remove the ${job.company} drive? This also removes its student applications.`)) {
        state.jobs = state.jobs.filter((item) => item.id !== id);
        state.applications = state.applications.filter((application) => application.jobId !== id);
        persist(); render(); toast("Recruitment drive removed.");
      }
    } else if (action === "delete-company") {
      const company = state.companies.find((item) => item.id === id);
      if (company && window.confirm(`Remove ${company.name} from the company directory?`)) {
        state.companies = state.companies.filter((item) => item.id !== id);
        persist(); render(); toast("Company removed from the directory.");
      }
    } else if (action === "delete-student") {
      const student = state.students.find((item) => item.id === id);
      if (student && window.confirm(`Remove ${student.name} from the student directory?`)) {
        state.students = state.students.filter((item) => item.id !== id);
        persist(); render(); toast("Student removed from the directory.");
      }
    }
  }

  function handleRootChange(event) {
    const element = event.target;
    if (element.dataset.action === "status") {
      const app = state.applications.find((item) => item.id === element.dataset.id);
      if (app) {
        app.status = element.value;
        persist(); render(); toast("Application status updated.");
      }
    } else if (element.dataset.action === "student-status") {
      const student = state.students.find((item) => item.id === element.dataset.id);
      if (student) {
        student.status = element.value;
        persist(); render(); toast("Student placement status updated.");
      }
    } else if (element.id === "resume-file" && element.files?.[0]) {
      uploadResume(element.files[0]);
      element.value = "";
    }
  }

  async function uploadResume(file) {
    const allowed = /\.(pdf|doc|docx)$/i.test(file.name);
    if (!allowed) return toast("Choose a PDF or Word document.", "error");
    if (file.size > 3 * 1024 * 1024) return toast("The selected file is larger than 3 MB.", "error");
    try {
      const data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error || new Error("Could not read the selected file."));
        reader.readAsDataURL(file);
      });
      const sizeLabel = file.size < 1024 * 1024 ? `${Math.max(1, Math.round(file.size / 1024))} KB` : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      state.resumes.push({
        id: `r-${Date.now()}`, name: file.name, sizeLabel,
        addedOn: new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", year: "numeric" }).format(new Date()),
        data,
      });
      if (persist()) { render(); toast("Resume uploaded and saved in this browser."); }
    } catch (error) {
      console.error("Resume upload failed.", error);
      toast("We could not read this file. Please try another document.", "error");
    }
  }

  function handleDialogSubmit(event) {
    if (event.target.id === "job-form") {
      event.preventDefault();
      const form = new FormData(event.target);
      const company = String(form.get("company")).trim();
      const job = {
        id: `j-${Date.now()}`, company, title: String(form.get("title")).trim(),
        location: String(form.get("location")).trim(), type: String(form.get("type")),
        salary: String(form.get("salary")).trim(), minCgpa: Number(form.get("minCgpa")),
        year: Number(form.get("year")), deadline: String(form.get("deadline")).trim(),
        branches: String(form.get("branches")).split(",").map((branch) => branch.trim()).filter(Boolean),
        description: String(form.get("description")).trim(), posted: "Just now", status: "Open",
      };
      if (!state.companies.some((item) => item.name.toLowerCase() === company.toLowerCase())) {
        state.companies.push({ id: `c-${Date.now()}`, name: company, logo: company.slice(0, 1).toUpperCase(), color: "" });
      }
      state.jobs.unshift(job);
      persist(); dialog.close(); adminTab = "Drives"; render(); toast("Recruitment drive published.");
    } else if (event.target.id === "company-form") {
      event.preventDefault();
      const name = String(new FormData(event.target).get("name")).trim();
      if (state.companies.some((company) => company.name.toLowerCase() === name.toLowerCase())) return toast("That company is already in your directory.", "error");
      state.companies.push({ id: `c-${Date.now()}`, name, logo: name.slice(0, 1).toUpperCase(), color: "" });
      persist(); dialog.close(); render(); toast("Company added to the directory.");
    } else if (event.target.id === "student-form") {
      event.preventDefault();
      const form = new FormData(event.target);
      const email = String(form.get("email")).trim();
      if (state.students.some((student) => student.email.toLowerCase() === email.toLowerCase())) return toast("A student with that email is already in the directory.", "error");
      state.students.push({
        id: `s-${Date.now()}`, name: String(form.get("name")).trim(), email,
        branch: String(form.get("branch")).trim(), cgpa: Number(form.get("cgpa")),
        status: String(form.get("status")),
      });
      persist(); dialog.close(); render(); toast("Student added to the directory.");
    }
  }

  document.addEventListener("click", (event) => {
    const navButton = event.target.closest("[data-page]");
    if (navButton && !root.contains(navButton) && !dialogContent.contains(navButton)) {
      handleRootClick(event);
      return;
    }
    if (event.target.closest("#mobile-menu")) {
      document.querySelector("#sidebar").classList.toggle("open");
      return;
    }
    if (event.target.closest("#profile-switch")) {
      const isAdmin = document.body.dataset.mode === "admin";
      document.body.dataset.mode = isAdmin ? "student" : "admin";
      currentPage = isAdmin ? "dashboard" : "admin";
      render();
      toast(isAdmin ? "Student workspace opened." : "Admin workspace opened.");
    }
  });
  root.addEventListener("click", handleRootClick);
  root.addEventListener("change", handleRootChange);
  dialogContent.addEventListener("click", handleRootClick);
  dialogContent.addEventListener("submit", handleDialogSubmit);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  document.querySelector("#global-search").addEventListener("input", (event) => {
    searchTerm = event.target.value;
    if (currentPage !== "jobs") navigate("jobs");
    else renderJobs();
  });
  document.querySelector("#global-search").addEventListener("keydown", (event) => {
    if (event.key === "Escape") { event.target.value = ""; searchTerm = ""; render(); }
  });
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      document.querySelector("#global-search").focus();
    }
  });
  root.addEventListener("dragover", (event) => {
    if (event.target.closest("#upload-drop")) { event.preventDefault(); event.target.closest("#upload-drop").classList.add("dragover"); }
  });
  root.addEventListener("dragleave", (event) => {
    if (event.target.closest("#upload-drop")) event.target.closest("#upload-drop").classList.remove("dragover");
  });
  root.addEventListener("drop", (event) => {
    const drop = event.target.closest("#upload-drop");
    if (drop) {
      event.preventDefault();
      drop.classList.remove("dragover");
      if (event.dataTransfer.files[0]) uploadResume(event.dataTransfer.files[0]);
    }
  });

  render();
})();
