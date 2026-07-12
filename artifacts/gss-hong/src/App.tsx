import { useState } from "react";
import { Switch, Route, Link } from "wouter";
import {
  registerStudent, loginStudent, fetchStudentResults,
  changeStudentPassword, logoutStudent, DEFAULT_PASSWORD,
  type StudentProfile, type TermResult,
} from "./lib/portal";
import {
  Menu, X, GraduationCap, FlaskConical, BookOpen, Users, Phone,
  Mail, MapPin, ArrowRight, Calendar, Microscope, Award, Send,
  Atom, Eye, EyeOff, ChevronRight, Cpu, Landmark, Printer,
  LogOut, IdCard, Linkedin, Github, Code2, ShieldCheck, Terminal,
} from "lucide-react";
import developerPhoto from "./assets/paul-adamu.jpg";
import AdminPage from "./pages/AdminPage";
import bossMustaphaHall from "./assets/boss-mustapha-hall.jpg";
import principalYerimaEmmanuel from "./assets/principal-yerima-emmanuel.jpg";
import vpFuldayaWilfred from "./assets/vp-fuldaya-wilfred.jpg";
import vpYusufSuleiman from "./assets/vp-yusuf-suleiman.jpg";
import classroomTeaching from "./assets/classroom-teaching.jpg";
import physicsLabSaiduMusa from "./assets/physics-lab-saidu-musa.jpg";
import biologyLab from "./assets/biology-lab.jpg";

// ─── Page type ────────────────────────────────────────────────────────────────
type Page = "home" | "academics" | "portal" | "news" | "contact" | "developer";

// ─── Image URLs ───────────────────────────────────────────────────────────────
const IMGS = {
  hero:      bossMustaphaHall,
  lab:       "https://images.unsplash.com/photo-1758685734153-132c8620c1bd?w=900&h=600&fit=crop&auto=format",
  teaching:  "https://images.unsplash.com/photo-1758685733987-54952cd1c8c6?w=900&h=600&fit=crop&auto=format",
  computer:  "https://images.unsplash.com/photo-1778489769184-45868633c527?w=900&h=600&fit=crop&auto=format",
  graduation:"https://images.unsplash.com/photo-1628198661856-102874fb9d82?w=900&h=600&fit=crop&auto=format",
  labExtra:  "https://images.unsplash.com/photo-1758685734201-72662f1a368d?w=900&h=600&fit=crop&auto=format",
  campus2:   bossMustaphaHall,
  f1:        "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?w=400&h=500&fit=crop&auto=format",
  f2:        "https://images.unsplash.com/photo-1573496527892-904f897eb744?w=400&h=500&fit=crop&auto=format",
  f3:        "https://images.unsplash.com/photo-1764169689207-e23fb66e1fcf?w=400&h=500&fit=crop&auto=format",
};

// ─── Glassmorphism helper ─────────────────────────────────────────────────────
function glass(alpha = 0.15, blur = 20): React.CSSProperties {
  return {
    background: `rgba(255,255,255,${alpha})`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: "1px solid rgba(255,255,255,0.28)",
  };
}

// ─── School Crest ─────────────────────────────────────────────────────────────
function SchoolCrest({ size = 44 }: { size?: number }) {
  return (
    <div
      className="rounded-full bg-primary flex flex-col items-center justify-center border-2 border-accent shadow-lg flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <span className="text-white font-black leading-none" style={{ fontSize: size * 0.19, fontFamily: "'Poppins',sans-serif" }}>GSS</span>
      <span className="text-accent font-bold leading-none" style={{ fontSize: size * 0.14, fontFamily: "'Poppins',sans-serif" }}>HONG</span>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const [open, setOpen] = useState(false);

  function nav(p: Page) {
    setPage(p);
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const links: { label: string; target: Page }[] = [
    { label: "Home",     target: "home" },
    { label: "About Us", target: "home" },
    { label: "Academics",target: "academics" },
    { label: "News",     target: "news" },
    { label: "Contact",  target: "contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-3 px-4 md:px-6 print:hidden">
      <div className="max-w-7xl mx-auto">
        <div
          className="flex items-center justify-between px-5 py-2.5 rounded-2xl"
          style={{ ...glass(0.22, 20), boxShadow: "0 8px 32px rgba(13,59,110,0.14)" }}
        >
          <button onClick={() => nav("home")} className="flex items-center gap-3">
            <SchoolCrest size={42} />
            <div className="text-left">
              <p className="font-black text-primary text-sm leading-tight" style={{ fontFamily: "'Poppins',sans-serif" }}>GSS HONG</p>
              <p className="text-xs text-muted-foreground leading-tight hidden sm:block" style={{ fontFamily: "'Inter',sans-serif" }}>Government Secondary School</p>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-0.5">
            {links.map(item => (
              <button
                key={item.label}
                onClick={() => nav(item.target)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  page === item.target
                    ? "bg-primary text-white shadow-sm"
                    : "text-primary hover:bg-primary/10"
                }`}
                style={{ fontFamily: "'Inter',sans-serif" }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => nav("portal")}
              className="hidden lg:flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:bg-accent/90 transition-all hover:-translate-y-0.5"
              style={{ fontFamily: "'Inter',sans-serif" }}
            >
              <GraduationCap size={16} />
              Portal Login
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-xl text-primary hover:bg-primary/10 transition-all"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <div
            className="mt-2 rounded-2xl p-3 flex flex-col gap-1"
            style={{ background: "rgba(255,255,255,0.94)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 8px 32px rgba(13,59,110,0.15)" }}
          >
            {links.map(item => (
              <button key={item.label} onClick={() => nav(item.target)} className="text-left px-4 py-2.5 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 transition-all" style={{ fontFamily: "'Inter',sans-serif" }}>
                {item.label}
              </button>
            ))}
            <button onClick={() => nav("portal")} className="mt-1 bg-accent text-white py-2.5 rounded-xl text-sm font-semibold" style={{ fontFamily: "'Inter',sans-serif" }}>
              Portal Login
            </button>
            <button onClick={() => nav("developer")} className="text-primary/70 text-xs font-medium text-left hover:text-primary transition-all" style={{ fontFamily: "'Inter',sans-serif" }}>
              About the Developer
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ setPage }: { setPage: (p: Page) => void }) {
  function nav(p: Page) { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }

  return (
    <footer style={{ background: "#091f3a" }} className="text-white py-14 px-6 print:hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <SchoolCrest size={44} />
            <div>
              <p className="font-black text-sm leading-tight" style={{ fontFamily: "'Poppins',sans-serif" }}>GSS HONG</p>
              <p className="text-white/45 text-xs leading-tight" style={{ fontFamily: "'Inter',sans-serif" }}>Est. 1967</p>
            </div>
          </div>
          <p className="text-white/55 text-sm leading-relaxed" style={{ fontFamily: "'Inter',sans-serif" }}>
            Nurturing excellence through rigorous science and arts education and moral character development since 1967.
          </p>
        </div>

        {[
          {
            title: "Quick Links",
            items: [
              { label: "About Us",      page: "home"      as Page },
              { label: "Academics",     page: "academics" as Page },
              { label: "Student Portal",page: "portal"    as Page },
              { label: "News",          page: "news"      as Page },
              { label: "Contact",       page: "contact"   as Page },
              { label: "About the Developer", page: "developer" as Page },
            ],
          },
          {
            title: "Departments",
            items: [
              { label: "Biology",             page: "academics" as Page },
              { label: "Physics",             page: "academics" as Page },
              { label: "Arts & Humanities",   page: "academics" as Page },
            ],
          },
        ].map((col, i) => (
          <div key={i}>
            <h4 className="font-bold text-sm mb-4 text-white/85" style={{ fontFamily: "'Poppins',sans-serif" }}>{col.title}</h4>
            <ul className="space-y-2.5">
              {col.items.map(item => (
                <li key={item.label}>
                  <button onClick={() => nav(item.page)} className="text-white/50 text-sm hover:text-accent transition-all" style={{ fontFamily: "'Inter',sans-serif" }}>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="font-bold text-sm mb-4 text-white/85" style={{ fontFamily: "'Poppins',sans-serif" }}>Contact</h4>
          <ul className="space-y-3 text-sm text-white/50" style={{ fontFamily: "'Inter',sans-serif" }}>
            <li className="flex gap-2 items-start"><MapPin size={14} className="flex-shrink-0 mt-0.5 text-accent" />Hong, Adamawa State, Nigeria</li>
            <li className="flex gap-2 items-start"><Phone size={14} className="flex-shrink-0 mt-0.5 text-accent" />07039210066</li>
            <li className="flex gap-2 items-start"><Mail size={14} className="flex-shrink-0 mt-0.5 text-accent" />info@gsshong.edu.ng</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-white/35 text-xs" style={{ fontFamily: "'Inter',sans-serif" }}>© 2025 Government Secondary School, Hong. All rights reserved.</p>
        <p className="text-white/25 text-xs" style={{ fontFamily: "'Inter',sans-serif" }}>Adamawa State Ministry of Education</p>
      </div>
    </footer>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────
function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  function nav(p: Page) { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }

  const stats = [
    { val: "1967", label: "Year Founded" },
    { val: "10,000+", label: "Alumni Worldwide" },
    { val: "6", label: "Academic Depts." },
    { val: "Top 10", label: "State Ranking" },
  ];

  const programs = [
    {
      icon: <FlaskConical size={28} />,
      title: "Science",
      desc: "Biology, Chemistry, and Physics — each with dedicated laboratory facilities and qualified department heads.",
    },
    {
      icon: <Landmark size={28} />,
      title: "Arts",
      desc: "Literature-in-English, Government, Economics, and CRS/IRS tracks that build strong communicators and critical thinkers.",
    },
    {
      icon: <BookOpen size={28} />,
      title: "Commercial",
      desc: "Accounting, Commerce, and Economics tracks that prepare students for careers in business, finance, and trade.",
    },
  ];

  const news = [
    {
      img: IMGS.graduation, tag: "Achievement", date: "June 15, 2025",
      title: "GSS Hong Records 94% Distinction Rate in 2025 WAEC",
      excerpt: "Students excelled across both science and arts subjects, maintaining the school's position as one of Adamawa's top-performing institutions.",
    },
    {
      img: IMGS.lab, tag: "Facilities", date: "May 3, 2025",
      title: "New ₦45M Chemistry Laboratory Wing Commissioned",
      excerpt: "The state-of-the-art facility houses 40 research-grade workstations with modern fume hood systems.",
    },
    {
      img: IMGS.computer, tag: "Technology", date: "April 20, 2025",
      title: "Alumni Association Donates 60 Workstations to ICT Hub",
      excerpt: "Valued at ₦18 million, the donation was made during the annual alumni homecoming weekend in Hong.",
    },
  ];

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-primary"
          style={{ backgroundImage: `url(${IMGS.hero})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(13,59,110,0.88) 0%, rgba(13,59,110,0.65) 55%, rgba(22,163,74,0.28) 100%)" }}
        />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-8" style={glass(0.14)}>
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-white text-sm font-medium" style={{ fontFamily: "'Inter',sans-serif" }}>
              Government Secondary School, Hong · Adamawa State
            </span>
          </div>

          <h1
            className="text-5xl md:text-[5.5rem] font-black text-white leading-none mb-6 tracking-tight"
            style={{ fontFamily: "'Poppins',sans-serif" }}
          >
            NURTURING<br />
            <span className="text-accent">EXCELLENCE</span><br />
            SINCE 1967
          </h1>

          <p className="text-white/75 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ fontFamily: "'Inter',sans-serif" }}>
            Shaping scientists, scholars, and leaders through world-class science and arts education and values-driven character development.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => nav("academics")}
              className="bg-accent text-white px-8 py-4 rounded-xl font-semibold text-base shadow-lg hover:bg-accent/90 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              style={{ fontFamily: "'Inter',sans-serif" }}
            >
              Explore Academics <ArrowRight size={18} />
            </button>
            <button
              onClick={() => nav("portal")}
              className="px-8 py-4 rounded-xl font-semibold text-base text-white flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all"
              style={{ ...glass(0.18), fontFamily: "'Inter',sans-serif" }}
            >
              Student Portal <GraduationCap size={18} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
          <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "'Inter',sans-serif" }}>Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section style={{ background: "#0D3B6E" }} className="py-5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className={`text-center py-5 ${i < 3 ? "border-r border-white/15" : ""}`}>
              <p className="text-3xl font-black text-accent" style={{ fontFamily: "'Poppins',sans-serif" }}>{s.val}</p>
              <p className="text-white/60 text-xs mt-1 uppercase tracking-wider" style={{ fontFamily: "'Inter',sans-serif" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-5" style={{ fontFamily: "'Inter',sans-serif" }}>
              About Our School
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-primary mb-6 leading-tight" style={{ fontFamily: "'Poppins',sans-serif" }}>
              A Legacy of<br />Academic Excellence
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4 text-base" style={{ fontFamily: "'Inter',sans-serif" }}>
              Government Secondary School, Hong traces its origin to the Hong Secondary School, founded in January 1967 by the Danish Branch of the Sudan United Mission. On 30th March 1971, the school was presented as a gift from the Government of Denmark to the Government of Nigeria and renamed Government Secondary School, Hong. It operated as a conventional secondary school until 1983, when the then Gongola State Government converted it — alongside a handful of others — into a Science Secondary School as part of its drive to promote science education. Today, the school has grown to offer both Science and Arts tracks, and has produced thousands of graduates who have gone on to distinguish themselves in medicine, engineering, law, the arts, and public service across Nigeria and beyond.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8 text-base" style={{ fontFamily: "'Inter',sans-serif" }}>
              With a dedicated faculty of over 85 teachers, modern laboratory and classroom infrastructure, and a rigorous WAEC/NECO-aligned curriculum spanning both Science and Arts, GSS Hong consistently ranks among the foremost secondary schools in Northeastern Nigeria.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {["WAEC Certified", "NECO Accredited", "State Award Winner", "Science & Arts"].map(t => (
                <span key={t} className="px-4 py-1.5 rounded-full text-sm font-medium bg-primary/8 text-primary border border-primary/15" style={{ fontFamily: "'Inter',sans-serif" }}>{t}</span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] bg-primary">
              <img src={classroomTeaching} alt="Teacher guiding students in a GSS Hong classroom" className="w-full h-full object-cover" />
            </div>
            <div
              className="absolute -bottom-5 -left-5 p-4 rounded-2xl shadow-2xl"
              style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.7)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                  <Award size={20} className="text-accent" />
                </div>
                <div>
                  <p className="font-bold text-primary text-sm" style={{ fontFamily: "'Poppins',sans-serif" }}>Best All-Round School</p>
                  <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Inter',sans-serif" }}>Adamawa State · 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Academic Programs ── */}
      <section className="py-24 px-6" style={{ background: "linear-gradient(160deg, #0D3B6E 0%, #0a2e55 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-semibold uppercase tracking-wider mb-4" style={{ fontFamily: "'Inter',sans-serif" }}>Academic Programs</span>
            <h2 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: "'Poppins',sans-serif" }}>World-Class Science &amp; Arts Education</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {programs.map((prog, i) => (
              <div
                key={i}
                className="p-7 rounded-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                style={glass(0.1, 18)}
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center text-accent mb-5">
                  {prog.icon}
                </div>
                <h3 className="text-white font-bold text-xl mb-3" style={{ fontFamily: "'Poppins',sans-serif" }}>{prog.title}</h3>
                <p className="text-white/65 text-sm leading-relaxed mb-5" style={{ fontFamily: "'Inter',sans-serif" }}>{prog.desc}</p>
                <button
                  onClick={() => nav("academics")}
                  className="flex items-center gap-1.5 text-accent text-sm font-semibold hover:gap-3 transition-all duration-200"
                  style={{ fontFamily: "'Inter',sans-serif" }}
                >
                  Learn More <ChevronRight size={15} />
                </button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => nav("academics")}
              className="bg-accent text-white px-8 py-3.5 rounded-xl font-semibold inline-flex items-center gap-2 hover:bg-accent/90 transition-all shadow-lg"
              style={{ fontFamily: "'Inter',sans-serif" }}
            >
              View Full Curriculum <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Student Portal Preview ── */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #0D3B6E, #1a5295)" }}>
            <div
              className="absolute inset-0 opacity-15"
              style={{ backgroundImage: `url(${IMGS.graduation})`, backgroundSize: "cover", backgroundPosition: "center" }}
            />
            <div className="relative z-10 grid md:grid-cols-[3fr_2fr] items-center">
              <div className="p-12 md:p-16">
                <span className="inline-block px-3 py-1 rounded-full bg-accent/30 text-accent text-xs font-semibold uppercase tracking-wider mb-5" style={{ fontFamily: "'Inter',sans-serif" }}>
                  Student Portal
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight" style={{ fontFamily: "'Poppins',sans-serif" }}>
                  Check Your Results<br />Anytime, Anywhere
                </h2>
                <p className="text-white/70 mb-8 leading-relaxed max-w-md" style={{ fontFamily: "'Inter',sans-serif" }}>
                  Sign in with your admission number to view and print your official term results, straight from the school's records office.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => nav("portal")}
                    className="bg-accent text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-accent/90 transition-all flex items-center gap-2 shadow-md"
                    style={{ fontFamily: "'Inter',sans-serif" }}
                  >
                    Sign In to Portal <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              <div className="hidden md:grid grid-cols-2 gap-4 p-10">
                {[
                  { val: "2,400+",  label: "Active Students" },
                  { val: "58",      label: "Graduation Classes" },
                  { val: "2",       label: "Terms Per Session" },
                  { val: "24/7",    label: "Results Access" },
                ].map((item, i) => (
                  <div key={i} className="p-5 rounded-2xl text-center" style={glass(0.1, 14)}>
                    <p className="text-3xl font-black text-accent" style={{ fontFamily: "'Poppins',sans-serif" }}>{item.val}</p>
                    <p className="text-white/60 text-xs mt-1" style={{ fontFamily: "'Inter',sans-serif" }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Latest News ── */}
      <section className="py-24 px-6" style={{ background: "#E4ECF5" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-3" style={{ fontFamily: "'Inter',sans-serif" }}>Latest Updates</span>
              <h2 className="text-3xl md:text-4xl font-black text-primary" style={{ fontFamily: "'Poppins',sans-serif" }}>News & Announcements</h2>
            </div>
            <button
              onClick={() => nav("news")}
              className="hidden md:flex items-center gap-1.5 text-primary font-semibold text-sm hover:text-accent transition-all"
              style={{ fontFamily: "'Inter',sans-serif" }}
            >
              View All <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {news.map((item, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-card shadow-md hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer border border-border">
                <div className="relative h-52 bg-primary overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,59,110,0.55) 0%, transparent 60%)" }} />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-accent text-white text-xs font-semibold" style={{ fontFamily: "'Inter',sans-serif" }}>{item.tag}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3" style={{ fontFamily: "'Inter',sans-serif" }}>
                    <Calendar size={12} />
                    {item.date}
                  </div>
                  <h3 className="font-bold text-primary text-base mb-2 leading-snug" style={{ fontFamily: "'Poppins',sans-serif" }}>{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed" style={{ fontFamily: "'Inter',sans-serif" }}>{item.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── AcademicsPage ────────────────────────────────────────────────────────────
function AcademicsPage({ setPage }: { setPage: (p: Page) => void }) {
  const depts = [
    {
      icon: <Microscope size={32} />,
      name: "Biology Department",
      head: "Mrs. Fatima Yusuf, B.Sc., PGDE",
      desc: "The Biology laboratory houses 32 compound microscopes, full dissection kits, a preserved specimen library, and a dedicated genetics study room. Annual field ecology trips to Gashaka-Gumti National Park supplement classroom learning with real-world environmental science.",
      features: ["32 compound microscopes", "Preserved specimen library", "Genetics study room", "Annual ecology field trips"],
      img: biologyLab,
    },
    {
      icon: <Atom size={32} />,
      name: "Physics Department",
      head: "Mr. Saidu Musa, B.Eng.",
      desc: "Physics at GSS Hong is delivered with precision instruments including oscilloscopes, optical benches, electronics breadboards, and Vernier caliper kits. The department consistently produces finalists in state and national physics olympiad competitions.",
      features: ["Oscilloscopes & generators", "Optics & mechanics lab", "Electronics workshop", "National olympiad finalists"],
      img: physicsLabSaiduMusa,
    },
    {
      icon: <BookOpen size={32} />,
      name: "Literature & Languages Department",
      head: "Mrs. Blessing Danjuma, B.A., PGDE",
      desc: "Our Arts wing's flagship department cultivates strong readers, writers, and communicators through Literature-in-English, English Language, and Hausa Language tracks. Students build the analytical and rhetorical skills valued across law, media, and public service careers.",
      features: ["Well-stocked school library", "Debate & literary society", "WAEC Literature specialists", "Creative writing workshops"],
      img: IMGS.teaching,
    },
  ];

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="py-20 px-6 text-center" style={{ background: "linear-gradient(160deg, #0D3B6E 0%, #0a2e55 100%)" }}>
        <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-semibold uppercase tracking-wider mb-4" style={{ fontFamily: "'Inter',sans-serif" }}>Academics</span>
        <h1 className="text-5xl md:text-6xl font-black text-white mb-4" style={{ fontFamily: "'Poppins',sans-serif" }}>Science &amp; Arts Curriculum</h1>
        <p className="text-white/65 max-w-2xl mx-auto text-base" style={{ fontFamily: "'Inter',sans-serif" }}>
          GSS Hong delivers a comprehensive, WAEC-aligned curriculum spanning the Science, Arts, and Commercial tracks across specialist departments, each led by experienced, qualified staff.
        </p>
      </div>

      {/* Departments */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto space-y-20">
          {depts.map((dept, i) => (
            <div key={i} className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "md:[&>*:first-child]:order-last" : ""}`}>
              <div className="group rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] bg-primary">
                <img
                  src={dept.img}
                  alt={dept.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-active:grayscale-0 group-focus-within:grayscale-0 transition-all duration-500"
                  tabIndex={0}
                />
              </div>
              <div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                  {dept.icon}
                </div>
                <h2 className="text-3xl font-black text-primary mb-1" style={{ fontFamily: "'Poppins',sans-serif" }}>{dept.name}</h2>
                <p className="text-accent text-sm font-semibold mb-4" style={{ fontFamily: "'Inter',sans-serif" }}>Head of Department: {dept.head}</p>
                <p className="text-muted-foreground leading-relaxed mb-6" style={{ fontFamily: "'Inter',sans-serif" }}>{dept.desc}</p>
                <div className="grid grid-cols-2 gap-3">
                  {dept.features.map(f => (
                    <div key={f} className="flex items-start gap-2 text-sm text-foreground" style={{ fontFamily: "'Inter',sans-serif" }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-1.5" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Results CTA */}
      <section className="py-16 px-6 text-center" style={{ background: "linear-gradient(135deg, #16A34A, #0D9A40)" }}>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4" style={{ fontFamily: "'Poppins',sans-serif" }}>
          94% WAEC Distinction Rate — 2025
        </h2>
        <p className="text-white/75 mb-8 max-w-xl mx-auto" style={{ fontFamily: "'Inter',sans-serif" }}>
          Our students consistently exceed national averages in both Science and Arts subjects, year after year.
        </p>
        <button
          onClick={() => setPage("contact")}
          className="bg-white text-accent px-8 py-3.5 rounded-xl font-semibold hover:bg-white/90 transition-all inline-flex items-center gap-2 shadow-lg"
          style={{ fontFamily: "'Inter',sans-serif" }}
        >
          Contact Admissions <ArrowRight size={18} />
        </button>
      </section>
    </div>
  );
}

// ─── StudentPortalPage (login-only; registration lives at /register) ─────────
function StudentPortalPage() {
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ admissionNo: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [results, setResults] = useState<TermResult[]>([]);

  const inputClass = "w-full px-4 py-3 rounded-xl border border-border bg-white/70 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground/55";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await loginStudent(form.admissionNo, form.password);
    if (!res.ok) {
      setError(res.error);
      setLoading(false);
      return;
    }
    const termResults = await fetchStudentResults(form.admissionNo);
    setResults(termResults);
    setProfile(res.profile);
    setLoading(false);
  }

  async function handleLogout() {
    await logoutStudent();
    setProfile(null);
    setResults([]);
    setForm({ admissionNo: "", password: "" });
  }

  if (profile) {
    return <ResultsView profile={profile} results={results} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="relative py-20 px-6" style={{ background: "linear-gradient(160deg, #0D3B6E 0%, #0a2e55 100%)" }}>
        <div
          className="absolute inset-0 opacity-18"
          style={{ backgroundImage: `url(${IMGS.graduation})`, backgroundSize: "cover", backgroundPosition: "center top" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(13,59,110,0.6), rgba(13,59,110,0.8))" }} />
        <div className="relative z-10 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-semibold uppercase tracking-wider mb-4" style={{ fontFamily: "'Inter',sans-serif" }}>
            Results & Records
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-3" style={{ fontFamily: "'Poppins',sans-serif" }}>Student Portal</h1>
          <p className="text-white/65 max-w-xl mx-auto" style={{ fontFamily: "'Inter',sans-serif" }}>
            Sign in with your admission number to view and print your official term results.
          </p>
        </div>
      </div>

      {/* Login form */}
      <section className="py-16 px-6" style={{ background: "linear-gradient(160deg, #EEF2F7 0%, #DCE9F5 100%)" }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-[1fr_300px] gap-8 items-start">

          {/* Login panel */}
          <div
            className="p-8 rounded-3xl shadow-2xl"
            style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)", border: "1px solid rgba(255,255,255,0.72)" }}
          >
            <h2 className="text-xl font-black text-primary mb-6" style={{ fontFamily: "'Poppins',sans-serif" }}>Sign In</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5" style={{ fontFamily: "'Inter',sans-serif" }}>Admission Number</label>
                <div className="relative">
                  <IdCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={form.admissionNo}
                    onChange={e => setForm({ ...form, admissionNo: e.target.value })}
                    placeholder="e.g. GSS/2024/00231"
                    className={inputClass + " pl-11"}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5" style={{ fontFamily: "'Inter',sans-serif" }}>Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Your password"
                    className={inputClass + " pr-12"}
                    required
                    disabled={loading}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-all">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {error && (
                <p className="text-red-600 text-xs font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-2" style={{ fontFamily: "'Inter',sans-serif" }}>
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Inter',sans-serif" }}
              >
                {loading ? "Signing in…" : <><span>Sign In to Portal</span><ArrowRight size={16} /></>}
              </button>
              <p className="text-center text-xs text-muted-foreground" style={{ fontFamily: "'Inter',sans-serif" }}>
                First time? Your default password is <span className="font-semibold text-primary">{DEFAULT_PASSWORD}</span>. Change it after signing in.
              </p>
            </form>
          </div>

          {/* Glassmorphism side panel */}
          <div
            className="p-7 rounded-3xl text-white"
            style={{
              background: "rgba(13,59,110,0.78)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 24px 64px rgba(13,59,110,0.3)",
            }}
          >
            <div className="flex justify-center mb-6">
              <SchoolCrest size={66} />
            </div>
            <h3 className="text-xl font-black text-center mb-1" style={{ fontFamily: "'Poppins',sans-serif" }}>Student Portal</h3>
            <p className="text-white/55 text-xs text-center mb-7" style={{ fontFamily: "'Inter',sans-serif" }}>Results & Records Office</p>

            <div className="space-y-4">
              {[
                { icon: <GraduationCap size={17} />, text: "View term & session results" },
                { icon: <Printer size={17} />,       text: "Print an official result slip" },
                { icon: <Calendar size={17} />,      text: "Check term dates & school calendar" },
                { icon: <Users size={17} />,         text: "Update contact details on file" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="text-accent flex-shrink-0">{item.icon}</div>
                  <span className="text-white/75" style={{ fontFamily: "'Inter',sans-serif" }}>{item.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/14">
              <p className="text-xs text-white/40 text-center" style={{ fontFamily: "'Inter',sans-serif" }}>
                Need help? Contact us at<br />
                <span className="text-accent">results@gsshong.edu.ng</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── ResultsView (printable term result — Firebase-backed, no seed data) ──────
function ResultsView({
  profile, results, onLogout,
}: {
  profile: StudentProfile;
  results: TermResult[];
  onLogout: () => void;
}) {
  const [termIdx, setTermIdx] = useState(0);
  const [showChangePw, setShowChangePw] = useState(false);
  const [pwForm, setPwForm] = useState({ newPw: "", confirm: "" });
  const [pwShowNew, setPwShowNew] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pwLoading, setPwLoading] = useState(false);

  const inputClass = "w-full px-4 py-3 rounded-xl border border-border bg-white/70 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground/55";

  async function handleChangePw(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    if (pwForm.newPw !== pwForm.confirm) {
      setPwMsg({ ok: false, text: "Passwords do not match." });
      return;
    }
    if (pwForm.newPw.length < 6) {
      setPwMsg({ ok: false, text: "Password must be at least 6 characters." });
      return;
    }
    setPwLoading(true);
    const res = await changeStudentPassword(pwForm.newPw);
    setPwLoading(false);
    if (res.ok) {
      setPwMsg({ ok: true, text: "Password updated successfully!" });
      setPwForm({ newPw: "", confirm: "" });
    } else {
      setPwMsg({ ok: false, text: res.error });
    }
  }

  const current = results[termIdx] ?? null;

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 bg-background">
      <div className="max-w-4xl mx-auto">

        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 print:hidden">
          <div>
            <h1 className="text-2xl font-black text-primary" style={{ fontFamily: "'Poppins',sans-serif" }}>
              {current ? `${current.term} · ${current.session}` : "Student Portal"}
            </h1>
            <p className="text-muted-foreground text-sm" style={{ fontFamily: "'Inter',sans-serif" }}>
              Welcome, {profile.name}
            </p>
          </div>
          <div className="flex gap-3">
            {current && (
              <button
                onClick={() => window.print()}
                className="bg-accent text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-all flex items-center gap-2 shadow-md"
                style={{ fontFamily: "'Inter',sans-serif" }}
              >
                <Printer size={16} /> Print Result
              </button>
            )}
            <button
              onClick={() => { setShowChangePw(v => !v); setPwMsg(null); }}
              className="border border-border text-primary px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/5 transition-all"
              style={{ fontFamily: "'Inter',sans-serif" }}
            >
              Change Password
            </button>
            <button
              onClick={onLogout}
              className="border border-border text-primary px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/5 transition-all flex items-center gap-2"
              style={{ fontFamily: "'Inter',sans-serif" }}
            >
              <LogOut size={16} /> Log Out
            </button>
          </div>
        </div>

        {/* Change-password panel */}
        {showChangePw && (
          <div className="mb-6 p-6 bg-card rounded-2xl border border-border shadow-md print:hidden">
            <h3 className="font-black text-primary mb-4 text-base" style={{ fontFamily: "'Poppins',sans-serif" }}>Change Password</h3>
            <form onSubmit={handleChangePw} className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5" style={{ fontFamily: "'Inter',sans-serif" }}>New Password</label>
                <div className="relative">
                  <input
                    type={pwShowNew ? "text" : "password"}
                    value={pwForm.newPw}
                    onChange={e => setPwForm(f => ({ ...f, newPw: e.target.value }))}
                    placeholder="Min. 6 characters"
                    className={inputClass + " pr-12"}
                    required
                  />
                  <button type="button" onClick={() => setPwShowNew(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {pwShowNew ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5" style={{ fontFamily: "'Inter',sans-serif" }}>Confirm Password</label>
                <input
                  type="password"
                  value={pwForm.confirm}
                  onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                  placeholder="Repeat new password"
                  className={inputClass}
                  required
                />
              </div>
              <div className="sm:col-span-2 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={pwLoading}
                  className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-60"
                  style={{ fontFamily: "'Inter',sans-serif" }}
                >
                  {pwLoading ? "Updating…" : "Update Password"}
                </button>
                {pwMsg && (
                  <p className={`text-sm font-medium ${pwMsg.ok ? "text-green-600" : "text-red-600"}`} style={{ fontFamily: "'Inter',sans-serif" }}>
                    {pwMsg.text}
                  </p>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Term selector */}
        {results.length > 1 && (
          <div className="flex gap-2 mb-6 flex-wrap print:hidden">
            {results.map((r, i) => (
              <button
                key={r.id}
                onClick={() => setTermIdx(i)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${i === termIdx ? "bg-primary text-white border-primary" : "border-border text-primary hover:bg-primary/5"}`}
                style={{ fontFamily: "'Inter',sans-serif" }}
              >
                {r.term} · {r.session}
              </button>
            ))}
          </div>
        )}

        {/* Result card */}
        {current ? (
          <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
              <SchoolCrest size={52} />
              <div>
                <p className="font-black text-primary text-lg leading-tight" style={{ fontFamily: "'Poppins',sans-serif" }}>Government Secondary School, Hong</p>
                <p className="text-muted-foreground text-xs" style={{ fontFamily: "'Inter',sans-serif" }}>Official Student Result Slip</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mb-8 text-sm" style={{ fontFamily: "'Inter',sans-serif" }}>
              <p><span className="text-muted-foreground">Name:</span> <span className="font-semibold text-foreground">{profile.name}</span></p>
              <p><span className="text-muted-foreground">Admission No:</span> <span className="font-semibold text-foreground">{profile.admissionNo}</span></p>
              <p><span className="text-muted-foreground">Class:</span> <span className="font-semibold text-foreground">{profile.className}</span></p>
              <p><span className="text-muted-foreground">Session / Term:</span> <span className="font-semibold text-foreground">{current.session} · {current.term}</span></p>
            </div>

            <table className="w-full text-sm mb-6" style={{ fontFamily: "'Inter',sans-serif" }}>
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="py-2 pr-2">Subject</th>
                  <th className="py-2 px-2 text-center">C.A. (30)</th>
                  <th className="py-2 px-2 text-center">Exam (70)</th>
                  <th className="py-2 px-2 text-center">Total (100)</th>
                  <th className="py-2 pl-2 text-center">Grade</th>
                </tr>
              </thead>
              <tbody>
                {current.subjects.map(r => (
                  <tr key={r.subject} className="border-b border-border/60">
                    <td className="py-2.5 pr-2 font-medium text-foreground">{r.subject}</td>
                    <td className="py-2.5 px-2 text-center text-muted-foreground">{r.ca}</td>
                    <td className="py-2.5 px-2 text-center text-muted-foreground">{r.exam}</td>
                    <td className="py-2.5 px-2 text-center font-semibold text-foreground">{r.total}</td>
                    <td className="py-2.5 pl-2 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">{r.grade}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5">
              <span className="font-semibold text-primary text-sm" style={{ fontFamily: "'Inter',sans-serif" }}>Term Average</span>
              <span className="font-black text-primary text-lg" style={{ fontFamily: "'Poppins',sans-serif" }}>{current.average}%</span>
            </div>
          </div>
        ) : (
          /* No results published yet */
          <div className="bg-card rounded-3xl p-14 shadow-xl border border-border text-center">
            <SchoolCrest size={56} />
            <h3 className="text-xl font-black text-primary mt-6 mb-2" style={{ fontFamily: "'Poppins',sans-serif" }}>No results yet</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto" style={{ fontFamily: "'Inter',sans-serif" }}>
              No results have been published for your account. Check back after the end of term, or contact the Records office if you believe this is an error.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── RegisterPage (student portal registration — reachable only via /register) ─
function RegisterPage() {
  const [form, setForm] = useState({ name: "", admissionNo: "", className: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const inputClass = "w-full px-4 py-3 rounded-xl border border-border bg-white/70 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground/55";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await registerStudent(form);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter',sans-serif" }}>
      <div className="relative py-16 px-6" style={{ background: "linear-gradient(160deg, #0D3B6E 0%, #0a2e55 100%)" }}>
        <div className="relative z-10 text-center">
          <div className="flex justify-center mb-5">
            <SchoolCrest size={56} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2" style={{ fontFamily: "'Poppins',sans-serif" }}>Portal Registration</h1>
          <p className="text-white/65 max-w-xl mx-auto text-sm">
            Register for Student Portal access. No password needed — you'll sign in with your default password after registering.
          </p>
        </div>
      </div>

      <section className="py-16 px-6" style={{ background: "linear-gradient(160deg, #EEF2F7 0%, #DCE9F5 100%)" }}>
        <div className="max-w-xl mx-auto">
          <div
            className="p-8 rounded-3xl shadow-2xl"
            style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)", border: "1px solid rgba(255,255,255,0.72)" }}
          >
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-5">
                  <GraduationCap size={32} className="text-accent" />
                </div>
                <h3 className="text-2xl font-black text-primary mb-2" style={{ fontFamily: "'Poppins',sans-serif" }}>Registered!</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  Your account has been created. Sign in using your admission number with the default password:
                </p>
                <p className="text-primary font-black text-xl mb-6" style={{ fontFamily: "'Poppins',sans-serif" }}>{DEFAULT_PASSWORD}</p>
                <p className="text-muted-foreground text-xs mb-6">You can change this password after signing in.</p>
                <Link href="/" className="inline-flex items-center gap-1.5 text-accent font-semibold text-sm hover:underline">
                  ← Go to Student Portal Sign-In
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">Full Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Mustapha Sani" className={inputClass} required disabled={loading} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-1.5">Admission Number *</label>
                    <input type="text" value={form.admissionNo} onChange={e => setForm({ ...form, admissionNo: e.target.value })} placeholder="e.g. GSS/2024/00231" className={inputClass} required disabled={loading} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-1.5">Class *</label>
                    <input type="text" value={form.className} onChange={e => setForm({ ...form, className: e.target.value })} placeholder="e.g. SS2 Science" className={inputClass} required disabled={loading} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-1.5">Parent/Guardian Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className={inputClass} required disabled={loading} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-1.5">Phone Number *</label>
                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+234 800 000 0000" className={inputClass} required disabled={loading} />
                  </div>
                </div>

                {/* Default password notice */}
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-primary/5 border border-primary/15">
                  <Award size={16} className="text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-primary/80" style={{ fontFamily: "'Inter',sans-serif" }}>
                    Your default password will be <span className="font-black">{DEFAULT_PASSWORD}</span>. You can change it after signing in.
                  </p>
                </div>

                {error && (
                  <p className="text-red-600 text-xs font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating account…" : <><span>Create Account</span><ArrowRight size={18} /></>}
                </button>
                <p className="text-center text-sm text-muted-foreground">
                  Already registered? <Link href="/" className="text-accent font-semibold hover:underline">Sign in to the portal</Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── NewsPage ─────────────────────────────────────────────────────────────────
function NewsPage() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Academic", "Facilities", "Events", "Sports"];

  const articles = [
    {
      img: IMGS.graduation, cat: "Academic", date: "June 15, 2025",
      title: "2025 WAEC Results: 94% A1-B3 in Sciences",
      excerpt: "Students excelled across Biology, Chemistry, Physics, and Mathematics, cementing the school's top-tier reputation.",
    },
    {
      img: IMGS.lab, cat: "Facilities", date: "May 3, 2025",
      title: "New ₦45M Chemistry Lab Wing Commissioned",
      excerpt: "The governor commissioned the 40-workstation facility equipped with modern fume hoods and spectrophotometers.",
    },
    {
      img: IMGS.computer, cat: "Facilities", date: "April 20, 2025",
      title: "Alumni Donate 60 HP Workstations to ICT Hub",
      excerpt: "The ₦18M donation was made during the annual alumni homecoming weekend, greatly expanding the school's digital capacity.",
    },
    {
      img: IMGS.teaching, cat: "Academic", date: "March 10, 2025",
      title: "GSS Hong Wins State Science Olympiad Gold",
      excerpt: "Five SS2 students claimed gold at the Adamawa Science Olympiad, advancing to the national competition.",
    },
    {
      img: IMGS.labExtra, cat: "Events", date: "February 7, 2025",
      title: "Annual Science Fair: 120 Innovation Projects Displayed",
      excerpt: "This year's theme — 'Technology for Sustainable Agriculture' — drew inventive entries from all three senior classes.",
    },
    {
      img: IMGS.campus2, cat: "Events", date: "January 25, 2025",
      title: "Class of 2000 Celebrates 25-Year Silver Reunion",
      excerpt: "Over 200 alumni returned to campus for a memorable weekend, with a ₦5M donation pledged to the development fund.",
    },
  ];

  const filtered = filter === "All" ? articles : articles.filter(a => a.cat === filter);

  return (
    <div className="pt-24 min-h-screen bg-background">
      <div className="py-16 px-6 text-center" style={{ background: "linear-gradient(160deg, #0D3B6E, #0a2e55)" }}>
        <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-semibold uppercase tracking-wider mb-4" style={{ fontFamily: "'Inter',sans-serif" }}>Updates</span>
        <h1 className="text-5xl md:text-6xl font-black text-white" style={{ fontFamily: "'Poppins',sans-serif" }}>News & Announcements</h1>
      </div>

      <section className="py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${filter === cat ? "bg-primary text-white shadow-md" : "bg-white text-primary border border-border hover:border-primary/40"}`}
                style={{ fontFamily: "'Inter',sans-serif" }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article, i) => (
              <article
                key={i}
                className="group cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:-translate-y-1.5 transition-all duration-300 relative bg-primary"
                style={{ minHeight: 400 }}
              >
                <img
                  src={article.img}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(9,31,58,0.97) 0%, rgba(9,31,58,0.5) 50%, transparent 100%)" }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(18px)",
                      WebkitBackdropFilter: "blur(18px)",
                      border: "1px solid rgba(255,255,255,0.18)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-accent text-white text-xs font-semibold" style={{ fontFamily: "'Inter',sans-serif" }}>{article.cat}</span>
                      <span className="text-white/55 text-xs" style={{ fontFamily: "'Inter',sans-serif" }}>{article.date}</span>
                    </div>
                    <h3 className="text-white font-bold text-sm leading-snug mb-1.5" style={{ fontFamily: "'Poppins',sans-serif" }}>{article.title}</h3>
                    <p className="text-white/60 text-xs leading-relaxed line-clamp-2" style={{ fontFamily: "'Inter',sans-serif" }}>{article.excerpt}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── ContactPage ──────────────────────────────────────────────────────────────
function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  const faculty = [
    { name: "Mr. Yerima Emmanuel", role: "Principal",           img: principalYerimaEmmanuel, subject: "Educational Administration", imgPosition: "center 12%" },
    { name: "Mr. Fuldaya Wilfred", role: "Vice Principal (Special Duties)", img: vpFuldayaWilfred, subject: "Biology", imgPosition: "center 30%" },
    { name: "Mr. Yusuf Suleiman",  role: "Vice Principal (Admin)",   img: vpYusufSuleiman, subject: "Physics", imgPosition: "center 20%" },
  ];

  const contactInfo = [
    { icon: <MapPin size={22} />, label: "Address",    value: "Government Secondary School\nHong, Adamawa State, Nigeria" },
    { icon: <Phone size={22} />,  label: "Phone",      value: "07039210066" },
    { icon: <Mail size={22} />,   label: "Email",      value: "info@gsshong.edu.ng\nresults@gsshong.edu.ng" },
  ];

  const inputClass = "w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground/55";

  return (
    <div className="pt-24 min-h-screen bg-background">
      <div className="py-16 px-6 text-center" style={{ background: "linear-gradient(160deg, #0D3B6E, #0a2e55)" }}>
        <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-semibold uppercase tracking-wider mb-4" style={{ fontFamily: "'Inter',sans-serif" }}>Get In Touch</span>
        <h1 className="text-5xl md:text-6xl font-black text-white mb-3" style={{ fontFamily: "'Poppins',sans-serif" }}>Contact Us</h1>
        <p className="text-white/60 max-w-lg mx-auto" style={{ fontFamily: "'Inter',sans-serif" }}>
          Reach out for admissions enquiries, student portal support, academic information, or general correspondence.
        </p>
      </div>

      {/* Contact grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_400px] gap-10 items-start">
          {/* Form */}
          <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
            <h2 className="text-2xl font-black text-primary mb-6" style={{ fontFamily: "'Poppins',sans-serif" }}>Send a Message</h2>
            {sent ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-4">
                  <Send size={28} className="text-accent" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2" style={{ fontFamily: "'Poppins',sans-serif" }}>Message Sent!</h3>
                <p className="text-muted-foreground text-sm mb-6" style={{ fontFamily: "'Inter',sans-serif" }}>
                  Thank you for reaching out. We will respond within 2–3 business days.
                </p>
                <button onClick={() => setSent(false)} className="text-accent font-semibold text-sm hover:underline" style={{ fontFamily: "'Inter',sans-serif" }}>
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-1.5" style={{ fontFamily: "'Inter',sans-serif" }}>Full Name *</label>
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" className={inputClass} required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-1.5" style={{ fontFamily: "'Inter',sans-serif" }}>Email Address *</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" className={inputClass} required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5" style={{ fontFamily: "'Inter',sans-serif" }}>Subject *</label>
                  <input type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Admissions Enquiry" className={inputClass} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5" style={{ fontFamily: "'Inter',sans-serif" }}>Message *</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we help you?"
                    rows={5}
                    className={inputClass + " resize-none"}
                    required
                  />
                </div>
                <button type="submit" className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2" style={{ fontFamily: "'Inter',sans-serif" }}>
                  Send Message <Send size={16} />
                </button>
              </form>
            )}
          </div>

          {/* Contact info + map */}
          <div className="space-y-4">
            {contactInfo.map((c, i) => (
              <div key={i} className="flex gap-4 p-5 bg-card rounded-2xl border border-border shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  {c.icon}
                </div>
                <div>
                  <p className="font-bold text-primary text-sm mb-1" style={{ fontFamily: "'Poppins',sans-serif" }}>{c.label}</p>
                  <p className="text-muted-foreground text-sm whitespace-pre-line" style={{ fontFamily: "'Inter',sans-serif" }}>{c.value}</p>
                </div>
              </div>
            ))}

            <div className="rounded-2xl overflow-hidden shadow-md bg-primary aspect-video relative">
              <img src={IMGS.campus2} alt="GSS Hong campus, Hong Local Government Area, Adamawa State" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="flex items-center gap-3 px-5 py-3 rounded-xl"
                  style={{ background: "rgba(13,59,110,0.8)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  <MapPin size={20} className="text-accent" />
                  <span className="text-white text-sm font-semibold" style={{ fontFamily: "'Poppins',sans-serif" }}>Hong, Adamawa State</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty */}
      <section className="py-16 px-6" style={{ background: "#E4ECF5" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-3" style={{ fontFamily: "'Inter',sans-serif" }}>Leadership</span>
            <h2 className="text-3xl md:text-4xl font-black text-primary" style={{ fontFamily: "'Poppins',sans-serif" }}>Key Faculty & Staff</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {faculty.map((f, i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-md hover:-translate-y-1.5 transition-all duration-300 border border-border group">
                <div className="h-64 bg-primary overflow-hidden">
                  <img
                    src={f.img}
                    alt={`${f.name}, ${f.role} at GSS Hong`}
                    style={{ objectPosition: f.imgPosition ?? "center top" }}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-black text-primary text-lg" style={{ fontFamily: "'Poppins',sans-serif" }}>{f.name}</h3>
                  <p className="text-accent font-semibold text-sm mb-1" style={{ fontFamily: "'Inter',sans-serif" }}>{f.role}</p>
                  <p className="text-muted-foreground text-xs" style={{ fontFamily: "'Inter',sans-serif" }}>Specialist: {f.subject}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── DeveloperPage ────────────────────────────────────────────────────────────
function DeveloperPage() {
  const stack = [
    { icon: <Code2 size={18} />,       label: "Web Development",  detail: "Next.js, React, Tailwind CSS, TypeScript" },
    { icon: <Terminal size={18} />,    label: "Scripting & Tools", detail: "Python, TypeScript, Vite.js" },
    { icon: <ShieldCheck size={18} />, label: "Security Research", detail: "Offensive security, reverse engineering" },
  ];

  const highlights = [
    "Computer Science student at Benson Idahosa University",
    "Founder of ZeroTrace Intelligence, a security-tools venture built from the ground up",
    "Builds under the handle PA_ZTI — a tech-driven builder from Adamawa State, Nigeria",
    "2+ years of hands-on experience across web development and low-level programming",
  ];

  return (
    <div className="pt-20 min-h-screen bg-background">
      {/* Header */}
      <div className="py-20 px-6 text-center relative overflow-hidden" style={{ background: "linear-gradient(160deg, #0D3B6E 0%, #0a2e55 100%)" }}>
        <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-semibold uppercase tracking-wider mb-4" style={{ fontFamily: "'Inter',sans-serif" }}>
          The Team Behind This Site
        </span>
        <h1 className="text-5xl md:text-6xl font-black text-white mb-4" style={{ fontFamily: "'Poppins',sans-serif" }}>About the Developer</h1>
        <p className="text-white/65 max-w-xl mx-auto text-base" style={{ fontFamily: "'Inter',sans-serif" }}>
          The person who designed and built the GSS Hong website.
        </p>
      </div>

      {/* Profile */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(160deg, #EEF2F7 0%, #DCE9F5 100%)" }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-[auto_1fr] gap-10 items-start">
          <div className="flex flex-col items-center md:items-start">
            <div
              className="w-44 h-44 rounded-full overflow-hidden flex-shrink-0 shadow-2xl"
              style={{ border: "5px solid white", boxShadow: "0 20px 50px rgba(13,59,110,0.25)" }}
            >
              <img src={developerPhoto} alt="Paul Adamu, developer of the GSS Hong website" className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-3 mt-6">
              <a
                href="https://www.linkedin.com/in/paul-adamu-67bb46324"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/85 transition-all shadow-md"
                aria-label="Paul Adamu on LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://github.com/Celebrityattitude2008"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/85 transition-all shadow-md"
                aria-label="Paul Adamu on GitHub"
              >
                <Github size={18} />
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-black text-primary mb-1" style={{ fontFamily: "'Poppins',sans-serif" }}>Paul Adamu</h2>
            <p className="text-accent font-semibold text-sm mb-1" style={{ fontFamily: "'Inter',sans-serif" }}>Web Developer · Founder of ZeroTrace Intelligence</p>
            <p className="text-muted-foreground text-sm mb-6 flex items-center gap-1.5" style={{ fontFamily: "'Inter',sans-serif" }}>
              <MapPin size={14} /> Adamawa State, Nigeria
            </p>

            <p className="text-foreground/80 leading-relaxed mb-6" style={{ fontFamily: "'Inter',sans-serif" }}>
              Known online as <span className="font-semibold text-primary">PA_ZTI</span>, Paul is a tech-driven builder and Computer Science
              student at Benson Idahosa University. Alongside his studies, he founded{" "}
              <span className="font-semibold text-primary">ZeroTrace Intelligence</span>, a venture building security-testing tools and
              hardware for researchers. He designed and developed this GSS Hong website — from the visual identity to the Student Portal.
            </p>

            <div className="space-y-2.5 mb-8">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm">
                  <ChevronRight size={16} className="text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/75" style={{ fontFamily: "'Inter',sans-serif" }}>{h}</span>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              {stack.map((s, i) => (
                <div key={i} className="p-4 rounded-2xl bg-card border border-border">
                  <div className="text-accent mb-2">{s.icon}</div>
                  <p className="font-semibold text-primary text-sm mb-0.5" style={{ fontFamily: "'Inter',sans-serif" }}>{s.label}</p>
                  <p className="text-muted-foreground text-xs" style={{ fontFamily: "'Inter',sans-serif" }}>{s.detail}</p>
                </div>
              ))}
            </div>

            <a
              href="https://www.linkedin.com/in/paul-adamu-67bb46324"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-md"
              style={{ fontFamily: "'Inter',sans-serif" }}
            >
              Connect on LinkedIn <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── MainSite (all pages except the hidden /register route) ──────────────────
function MainSite() {
  const [page, setPage] = useState<Page>("home");

  const renderPage = () => {
    switch (page) {
      case "home":      return <HomePage setPage={setPage} />;
      case "academics": return <AcademicsPage setPage={setPage} />;
      case "portal":    return <StudentPortalPage />;
      case "news":      return <NewsPage />;
      case "contact":   return <ContactPage />;
      case "developer": return <DeveloperPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Inter',sans-serif" }}>
      <Navbar page={page} setPage={setPage} />
      <main>{renderPage()}</main>
      <Footer setPage={setPage} />
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
// /register and /admin are intentionally not linked from the visible UI —
// they are only reachable by navigating directly to those paths.
export default function App() {
  return (
    <Switch>
      <Route path="/register" component={RegisterPage} />
      <Route path="/admin" component={AdminPage} />
      <Route>
        <MainSite />
      </Route>
    </Switch>
  );
}
