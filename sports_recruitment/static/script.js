/* ============================================================
   Sports Talent Recruitment Platform — script.js
   - Dark/Light theme toggle
   - Language switcher (English / मराठी / हिंदी)
   - Tab system
   - Modal helpers
   - Star rating
   ============================================================ */

// ── Translations ─────────────────────────────────────────────
const i18n = {
  en: {
    // Navigation
    "nav.home":        "Home",
    "nav.players":     "Players",
    "nav.dashboard":   "Dashboard",
    "nav.login":       "Login",
    "nav.signup":      "Sign Up",
    "nav.logout":      "Logout",
    "nav.profile":     "My Profile",

    // Hero
    "hero.eyebrow":    "Rural Sports Talent Platform",
    "hero.title1":     "Connecting",
    "hero.title2":     "Talent",
    "hero.title3":     "with",
    "hero.title4":     "Coaches",
    "hero.subtitle":   "Empowering rural athletes to reach national-level recognition. Coaches discover the next champion — from any village.",
    "hero.btn1":       "Join as Player",
    "hero.btn2":       "I'm a Coach",
    "hero.btn3":       "Browse Players",

    // Stats
    "stat.players":    "Players Registered",
    "stat.coaches":    "Coaches",
    "stat.recruits":   "Recruitments",

    // Features
    "feat.title":      "Everything You Need",
    "feat.sub":        "A complete platform connecting rural sports talent with professional coaches.",
    "feat.p1.title":   "Player Profiles",
    "feat.p1.desc":    "Build your sports resume with achievements, competition levels, and stats.",
    "feat.p2.title":   "Coach Dashboard",
    "feat.p2.desc":    "Search, filter and recruit players by sport, age, and competition level.",
    "feat.p3.title":   "Recruitment System",
    "feat.p3.desc":    "Send and track recruitment requests with real-time status updates.",
    "feat.p4.title":   "Ratings & Feedback",
    "feat.p4.desc":    "Coaches can rate players and leave professional feedback.",
    "feat.p5.title":   "Email Verified",
    "feat.p5.desc":    "Secure email verification and password reset via Gmail SMTP.",
    "feat.p6.title":   "3 Languages",
    "feat.p6.desc":    "Full support for English, Marathi and Hindi for rural athletes.",

    // Auth
    "auth.login":      "Login to Your Account",
    "auth.signup":     "Create Your Account",
    "auth.name":       "Full Name",
    "auth.email":      "Email Address",
    "auth.password":   "Password",
    "auth.confirm":    "Confirm Password",
    "auth.role":       "I am a…",
    "auth.player":     "Player",
    "auth.coach":      "Coach",
    "auth.loginbtn":   "Login",
    "auth.signupbtn":  "Create Account",
    "auth.forgot":     "Forgot Password?",
    "auth.noacc":      "Don't have an account?",
    "auth.haveacc":    "Already have an account?",
    "auth.or":         "or",

    // Player
    "player.sport":       "Sport",
    "player.age":         "Age",
    "player.height":      "Height",
    "player.achievements":"Achievements",
    "player.level":       "Competition Level",
    "player.district":    "District",
    "player.state":       "State",
    "player.national":    "National",
    "player.viewprofile": "View Profile",
    "player.recruit":     "Send Recruitment",
    "player.feedback":    "Give Feedback",

    // Dashboard
    "dash.welcome":       "Welcome back",
    "dash.profile":       "My Profile",
    "dash.requests":      "Recruitment Requests",
    "dash.feedback":      "Feedback Received",
    "dash.editprofile":   "Edit Profile",
    "dash.createprofile": "Create Profile",
    "dash.searchplayers": "Search Players",
    "dash.sentrequest":   "Sent Requests",

    // Status
    "status.pending":    "Pending",
    "status.accepted":   "Accepted",
    "status.rejected":   "Rejected",
    "status.accept":     "Accept",
    "status.reject":     "Reject",

    // Players page
    "players.title":     "All Players",
    "players.search":    "Search players…",
    "players.filter":    "Filter",
    "players.clear":     "Clear",
    "players.sport":     "All Sports",
    "players.level":     "All Levels",
    "players.nofound":   "No players found.",

    // Password
    "pass.forgot":       "Forgot Password",
    "pass.reset":        "Reset Password",
    "pass.newpass":      "New Password",
    "pass.confirm":      "Confirm New Password",
    "pass.submit":       "Send Reset Link",
    "pass.resetbtn":     "Reset Password",
    "pass.backtologin":  "Back to Login",

    // Coach
    "coach.bio":             "About / Bio",
    "coach.specialization":  "Sport Specialization",
    "coach.experience":      "Experience (Years)",
    "coach.saveprofile":     "Save Profile",
    "coach.message":         "Recruitment Message",
    "coach.send":            "Send Request",
    "coach.rating":          "Rating",
    "coach.comment":         "Comment",
    "coach.submitfeedback":  "Submit Feedback",

    // Footer
    "footer.text":       "Sports Talent Recruitment Platform — Empowering Rural Athletes",
  },

  mr: {
    "nav.home":        "मुख्यपृष्ठ",
    "nav.players":     "खेळाडू",
    "nav.dashboard":   "डॅशबोर्ड",
    "nav.login":       "लॉग इन",
    "nav.signup":      "नोंदणी",
    "nav.logout":      "लॉग आउट",
    "nav.profile":     "माझी प्रोफाइल",

    "hero.eyebrow":    "ग्रामीण क्रीडा प्रतिभा व्यासपीठ",
    "hero.title1":     "प्रतिभेला",
    "hero.title2":     "प्रशिक्षकांशी",
    "hero.title3":     "जोडणारे",
    "hero.title4":     "व्यासपीठ",
    "hero.subtitle":   "ग्रामीण खेळाडूंना राष्ट्रीय स्तरावर नेण्यासाठी. प्रशिक्षक कोणत्याही गावातून नवीन चॅम्पियन शोधू शकतात.",
    "hero.btn1":       "खेळाडू म्हणून सामील व्हा",
    "hero.btn2":       "मी प्रशिक्षक आहे",
    "hero.btn3":       "खेळाडू पहा",

    "stat.players":    "नोंदणीकृत खेळाडू",
    "stat.coaches":    "प्रशिक्षक",
    "stat.recruits":   "भरती",

    "feat.title":      "सर्व काही एकाच ठिकाणी",
    "feat.sub":        "ग्रामीण क्रीडा प्रतिभेला व्यावसायिक प्रशिक्षकांशी जोडणारे संपूर्ण व्यासपीठ.",
    "feat.p1.title":   "खेळाडू प्रोफाइल",
    "feat.p1.desc":    "कामगिरी, स्पर्धा स्तर आणि आकडेवारीसह आपला क्रीडा रेझ्युमे तयार करा.",
    "feat.p2.title":   "प्रशिक्षक डॅशबोर्ड",
    "feat.p2.desc":    "खेळ, वय आणि स्पर्धा स्तरानुसार खेळाडू शोधा आणि भरती करा.",
    "feat.p3.title":   "भरती प्रणाली",
    "feat.p3.desc":    "रिअल-टाइम स्थिती अद्यतनांसह भरती विनंत्या पाठवा आणि ट्रॅक करा.",
    "feat.p4.title":   "रेटिंग आणि अभिप्राय",
    "feat.p4.desc":    "प्रशिक्षक खेळाडूंना रेट करू शकतात आणि व्यावसायिक अभिप्राय देऊ शकतात.",
    "feat.p5.title":   "ईमेल सत्यापित",
    "feat.p5.desc":    "सुरक्षित ईमेल सत्यापन आणि Gmail SMTP द्वारे पासवर्ड रीसेट.",
    "feat.p6.title":   "३ भाषा",
    "feat.p6.desc":    "ग्रामीण खेळाडूंसाठी इंग्रजी, मराठी आणि हिंदीसाठी संपूर्ण समर्थन.",

    "auth.login":      "आपल्या खात्यात लॉग इन करा",
    "auth.signup":     "आपले खाते तयार करा",
    "auth.name":       "पूर्ण नाव",
    "auth.email":      "ईमेल पत्ता",
    "auth.password":   "पासवर्ड",
    "auth.confirm":    "पासवर्ड पुष्टी करा",
    "auth.role":       "मी आहे…",
    "auth.player":     "खेळाडू",
    "auth.coach":      "प्रशिक्षक",
    "auth.loginbtn":   "लॉग इन",
    "auth.signupbtn":  "खाते तयार करा",
    "auth.forgot":     "पासवर्ड विसरलात?",
    "auth.noacc":      "खाते नाही?",
    "auth.haveacc":    "आधीच खाते आहे?",
    "auth.or":         "किंवा",

    "player.sport":       "खेळ",
    "player.age":         "वय",
    "player.height":      "उंची",
    "player.achievements":"कामगिरी",
    "player.level":       "स्पर्धा स्तर",
    "player.district":    "जिल्हा",
    "player.state":       "राज्य",
    "player.national":    "राष्ट्रीय",
    "player.viewprofile": "प्रोफाइल पहा",
    "player.recruit":     "भरती विनंती पाठवा",
    "player.feedback":    "अभिप्राय द्या",

    "dash.welcome":       "परत स्वागत",
    "dash.profile":       "माझी प्रोफाइल",
    "dash.requests":      "भरती विनंत्या",
    "dash.feedback":      "प्राप्त अभिप्राय",
    "dash.editprofile":   "प्रोफाइल संपादित करा",
    "dash.createprofile": "प्रोफाइल तयार करा",
    "dash.searchplayers": "खेळाडू शोधा",
    "dash.sentrequest":   "पाठवलेल्या विनंत्या",

    "status.pending":    "प्रलंबित",
    "status.accepted":   "स्वीकारले",
    "status.rejected":   "नाकारले",
    "status.accept":     "स्वीकारा",
    "status.reject":     "नाकारा",

    "players.title":     "सर्व खेळाडू",
    "players.search":    "खेळाडू शोधा…",
    "players.filter":    "फिल्टर",
    "players.clear":     "साफ करा",
    "players.sport":     "सर्व खेळ",
    "players.level":     "सर्व स्तर",
    "players.nofound":   "कोणताही खेळाडू आढळला नाही.",

    "pass.forgot":       "पासवर्ड विसरलात",
    "pass.reset":        "पासवर्ड रीसेट करा",
    "pass.newpass":      "नवीन पासवर्ड",
    "pass.confirm":      "नवीन पासवर्ड पुष्टी करा",
    "pass.submit":       "रीसेट लिंक पाठवा",
    "pass.resetbtn":     "पासवर्ड रीसेट करा",
    "pass.backtologin":  "लॉग इनकडे परत जा",

    "coach.bio":             "माहिती / बायो",
    "coach.specialization":  "क्रीडा विशेषीकरण",
    "coach.experience":      "अनुभव (वर्षे)",
    "coach.saveprofile":     "प्रोफाइल जतन करा",
    "coach.message":         "भरती संदेश",
    "coach.send":            "विनंती पाठवा",
    "coach.rating":          "रेटिंग",
    "coach.comment":         "टिप्पणी",
    "coach.submitfeedback":  "अभिप्राय सबमिट करा",

    "footer.text":       "क्रीडा प्रतिभा भर्ती व्यासपीठ — ग्रामीण खेळाडूंचे सक्षमीकरण",
  },

  hi: {
    "nav.home":        "होम",
    "nav.players":     "खिलाड़ी",
    "nav.dashboard":   "डैशबोर्ड",
    "nav.login":       "लॉग इन",
    "nav.signup":      "साइन अप",
    "nav.logout":      "लॉग आउट",
    "nav.profile":     "मेरी प्रोफ़ाइल",

    "hero.eyebrow":    "ग्रामीण खेल प्रतिभा मंच",
    "hero.title1":     "प्रतिभा को",
    "hero.title2":     "कोच से",
    "hero.title3":     "जोड़ने",
    "hero.title4":     "का मंच",
    "hero.subtitle":   "ग्रामीण एथलीटों को राष्ट्रीय स्तर पर पहुँचाने के लिए। कोच किसी भी गाँव से नई प्रतिभा खोज सकते हैं।",
    "hero.btn1":       "खिलाड़ी के रूप में जुड़ें",
    "hero.btn2":       "मैं कोच हूँ",
    "hero.btn3":       "खिलाड़ी देखें",

    "stat.players":    "पंजीकृत खिलाड़ी",
    "stat.coaches":    "कोच",
    "stat.recruits":   "भर्ती",

    "feat.title":      "सब कुछ एक जगह",
    "feat.sub":        "ग्रामीण खेल प्रतिभा को पेशेवर कोच से जोड़ने वाला संपूर्ण मंच।",
    "feat.p1.title":   "खिलाड़ी प्रोफ़ाइल",
    "feat.p1.desc":    "उपलब्धियों, प्रतियोगिता स्तरों और आँकड़ों के साथ अपना खेल रिज्यूमे बनाएं।",
    "feat.p2.title":   "कोच डैशबोर्ड",
    "feat.p2.desc":    "खेल, उम्र और प्रतियोगिता स्तर के अनुसार खिलाड़ियों को खोजें और भर्ती करें।",
    "feat.p3.title":   "भर्ती प्रणाली",
    "feat.p3.desc":    "रीयल-टाइम स्थिति अपडेट के साथ भर्ती अनुरोध भेजें और ट्रैक करें।",
    "feat.p4.title":   "रेटिंग और फ़ीडबैक",
    "feat.p4.desc":    "कोच खिलाड़ियों को रेट कर सकते हैं और पेशेवर फ़ीडबैक दे सकते हैं।",
    "feat.p5.title":   "ईमेल सत्यापित",
    "feat.p5.desc":    "Gmail SMTP के माध्यम से सुरक्षित ईमेल सत्यापन और पासवर्ड रीसेट।",
    "feat.p6.title":   "3 भाषाएँ",
    "feat.p6.desc":    "ग्रामीण एथलीटों के लिए अंग्रेज़ी, मराठी और हिंदी का पूर्ण समर्थन।",

    "auth.login":      "अपने खाते में लॉग इन करें",
    "auth.signup":     "अपना खाता बनाएं",
    "auth.name":       "पूरा नाम",
    "auth.email":      "ईमेल पता",
    "auth.password":   "पासवर्ड",
    "auth.confirm":    "पासवर्ड की पुष्टि करें",
    "auth.role":       "मैं हूँ…",
    "auth.player":     "खिलाड़ी",
    "auth.coach":      "कोच",
    "auth.loginbtn":   "लॉग इन",
    "auth.signupbtn":  "खाता बनाएं",
    "auth.forgot":     "पासवर्ड भूल गए?",
    "auth.noacc":      "खाता नहीं है?",
    "auth.haveacc":    "पहले से खाता है?",
    "auth.or":         "या",

    "player.sport":       "खेल",
    "player.age":         "आयु",
    "player.height":      "ऊँचाई",
    "player.achievements":"उपलब्धियाँ",
    "player.level":       "प्रतियोगिता स्तर",
    "player.district":    "जिला",
    "player.state":       "राज्य",
    "player.national":    "राष्ट्रीय",
    "player.viewprofile": "प्रोफ़ाइल देखें",
    "player.recruit":     "भर्ती अनुरोध भेजें",
    "player.feedback":    "फ़ीडबैक दें",

    "dash.welcome":       "वापस स्वागत है",
    "dash.profile":       "मेरी प्रोफ़ाइल",
    "dash.requests":      "भर्ती अनुरोध",
    "dash.feedback":      "प्राप्त फ़ीडबैक",
    "dash.editprofile":   "प्रोफ़ाइल संपादित करें",
    "dash.createprofile": "प्रोफ़ाइल बनाएं",
    "dash.searchplayers": "खिलाड़ी खोजें",
    "dash.sentrequest":   "भेजे गए अनुरोध",

    "status.pending":    "लंबित",
    "status.accepted":   "स्वीकृत",
    "status.rejected":   "अस्वीकृत",
    "status.accept":     "स्वीकार करें",
    "status.reject":     "अस्वीकार करें",

    "players.title":     "सभी खिलाड़ी",
    "players.search":    "खिलाड़ी खोजें…",
    "players.filter":    "फ़िल्टर",
    "players.clear":     "साफ़ करें",
    "players.sport":     "सभी खेल",
    "players.level":     "सभी स्तर",
    "players.nofound":   "कोई खिलाड़ी नहीं मिला।",

    "pass.forgot":       "पासवर्ड भूल गए",
    "pass.reset":        "पासवर्ड रीसेट करें",
    "pass.newpass":      "नया पासवर्ड",
    "pass.confirm":      "नए पासवर्ड की पुष्टि करें",
    "pass.submit":       "रीसेट लिंक भेजें",
    "pass.resetbtn":     "पासवर्ड रीसेट करें",
    "pass.backtologin":  "लॉग इन पर वापस जाएं",

    "coach.bio":             "परिचय / बायो",
    "coach.specialization":  "खेल विशेषज्ञता",
    "coach.experience":      "अनुभव (वर्ष)",
    "coach.saveprofile":     "प्रोफ़ाइल सहेजें",
    "coach.message":         "भर्ती संदेश",
    "coach.send":            "अनुरोध भेजें",
    "coach.rating":          "रेटिंग",
    "coach.comment":         "टिप्पणी",
    "coach.submitfeedback":  "फ़ीडबैक सबमिट करें",

    "footer.text":       "खेल प्रतिभा भर्ती मंच — ग्रामीण एथलीटों को सशक्त बनाना",
  }
};

// ── State ─────────────────────────────────────────────────────
let currentLang = localStorage.getItem('lang') || 'en';
let currentTheme = localStorage.getItem('theme') || 'light';

// ── Apply Theme ───────────────────────────────────────────────
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', theme);
  currentTheme = theme;
}

// ── Apply Language ─────────────────────────────────────────────
function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);

  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = i18n[lang][key];
    if (text !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (el.type === 'submit' || el.type === 'button') {
          el.value = text;
        } else {
          el.placeholder = text;
        }
      } else {
        el.textContent = text;
      }
    }
  });

  // Update lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Set html lang attribute
  document.documentElement.lang = lang === 'mr' ? 'mr' : lang === 'hi' ? 'hi' : 'en';
}

// ── Tabs ──────────────────────────────────────────────────────
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      const parent = btn.closest('.tabs-wrapper') || document;

      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const content = parent.querySelector(`[data-tab-content="${target}"]`) ||
                      document.querySelector(`[data-tab-content="${target}"]`);
      if (content) content.classList.add('active');
    });
  });
}

// ── Modal ─────────────────────────────────────────────────────
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('open');
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
}

// Close modal on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

// ── Recruitment Modal ─────────────────────────────────────────
function openRecruitModal(playerId, playerName) {
  document.getElementById('recruit_player_id').value = playerId;
  const nameEl = document.getElementById('recruit_player_name');
  if (nameEl) nameEl.textContent = playerName;
  openModal('recruitModal');
}

// ── Feedback Modal ────────────────────────────────────────────
function openFeedbackModal(playerId, playerName) {
  document.getElementById('feedback_player_id').value = playerId;
  const nameEl = document.getElementById('feedback_player_name');
  if (nameEl) nameEl.textContent = playerName;
  openModal('feedbackModal');
}

// ── Counter Animation ─────────────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target || el.textContent, 10);
  if (isNaN(target)) return;
  let current = 0;
  const step  = Math.max(1, Math.floor(target / 60));
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString();
    if (current >= target) clearInterval(timer);
  }, 20);
}

// ── Hamburger nav ──────────────────────────────────────────────
function initHamburger() {
  const ham  = document.getElementById('hamburger');
  const menu = document.getElementById('navLinks');
  if (ham && menu) {
    ham.addEventListener('click', () => menu.classList.toggle('open'));
  }
}

// ── Flash auto-dismiss ─────────────────────────────────────────
function initFlashDismiss() {
  document.querySelectorAll('.flash').forEach(flash => {
    setTimeout(() => {
      flash.style.transition = 'opacity 0.5s';
      flash.style.opacity    = '0';
      setTimeout(() => flash.remove(), 500);
    }, 5000);
  });
}

// ── Password strength indicator ───────────────────────────────
function initPasswordStrength() {
  const pw = document.getElementById('password');
  const bar = document.getElementById('pwStrengthBar');
  if (!pw || !bar) return;
  pw.addEventListener('input', () => {
    const v = pw.value;
    let strength = 0;
    if (v.length >= 6)  strength++;
    if (v.length >= 10) strength++;
    if (/[A-Z]/.test(v)) strength++;
    if (/[0-9]/.test(v)) strength++;
    if (/[^A-Za-z0-9]/.test(v)) strength++;
    const colors = ['#e74c3c','#e67e22','#f39c12','#27ae60','#1abc9c'];
    bar.style.width   = `${strength * 20}%`;
    bar.style.background = colors[strength - 1] || '#ddd';
  });
}

// ── Live search filter (players page) ─────────────────────────
function initLiveSearch() {
  const input = document.getElementById('liveSearch');
  const cards = document.querySelectorAll('.player-card');
  if (!input || !cards.length) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(q) ? '' : 'none';
    });
  });
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Theme
  applyTheme(currentTheme);

  // Theme toggle button
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  // Language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });

  // Apply saved language (after DOM is ready)
  applyLang(currentLang);

  // Tabs
  initTabs();

  // Hamburger
  initHamburger();

  // Flash dismiss
  initFlashDismiss();

  // Password strength
  initPasswordStrength();

  // Live search
  initLiveSearch();

  // Counter animation
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { animateCounter(el); obs.disconnect(); } });
    }, { threshold: 0.5 });
    obs.observe(el);
  });
});
// your other JS code above...

// Loading screen
window.addEventListener('load', function() {
  const loader = document.getElementById('loader-wrapper');

  loader.classList.add('hidden');

  setTimeout(() => {
    loader.style.display = 'none';
  }, 800);
});
