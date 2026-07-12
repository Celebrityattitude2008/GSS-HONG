import { useState } from "react";
import {
  LogOut, Users, Plus, Trash2, Save, Send, ArrowLeft,
  Eye, EyeOff, ChevronRight, BookOpen, CheckCircle, Clock,
  RefreshCw, Newspaper, ImagePlus, X as XIcon, Pencil,
} from "lucide-react";
import {
  adminLogin, adminLogout, fetchAllStudents, fetchAllResultsForStudent,
  saveResult, toggleRelease, deleteResult, calcGrade,
  type StudentProfile, type TermResult, type SubjectResult,
} from "../lib/portal";
import {
  fetchAllNews, createNews, updateNews, deleteNews, fileToBase64Image,
  type NewsArticle,
} from "../lib/news";

// ─── Types ────────────────────────────────────────────────────────────────────
type AdminView = "login" | "students" | "editing" | "news";

const NEWS_CATEGORIES = ["Academic", "Facilities", "Events", "Sports", "Achievement", "Technology"];

function todayDisplay(): string {
  return new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

interface NewsFormState {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
}

const EMPTY_NEWS_FORM: NewsFormState = {
  title: "", excerpt: "", category: NEWS_CATEGORIES[0], date: "", image: "",
};

interface SubjectRow {
  subject: string;
  ca: string;   // string while editing
  exam: string;
}

const DEFAULT_SUBJECTS = [
  "English Language", "Mathematics", "Biology", "Chemistry",
  "Physics", "Government", "Economics", "Computer Studies",
];

const TERMS = ["First Term", "Second Term", "Third Term"];

const inputCls =
  "w-full px-3 py-2 rounded-xl border border-border bg-white/80 text-foreground text-sm " +
  "focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground/55";

// ─── AdminPage ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [view, setView] = useState<AdminView>("login");

  // login
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // students list
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  // editing a student
  const [selected, setSelected] = useState<StudentProfile | null>(null);
  const [termResults, setTermResults] = useState<TermResult[]>([]);
  const [resultsLoading, setResultsLoading] = useState(false);

  // score entry form
  const [formSession, setFormSession] = useState("2025/2026");
  const [formTerm, setFormTerm] = useState(TERMS[0]);
  const [rows, setRows] = useState<SubjectRow[]>(
    DEFAULT_SUBJECTS.map(s => ({ subject: s, ca: "", exam: "" }))
  );
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // news management
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsForm, setNewsForm] = useState<NewsFormState>(EMPTY_NEWS_FORM);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsSaving, setNewsSaving] = useState(false);
  const [newsMsg, setNewsMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [imageProcessing, setImageProcessing] = useState(false);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    const res = await adminLogin(loginForm.email, loginForm.password);
    setLoginLoading(false);
    if (!res.ok) { setLoginError(res.error); return; }
    await loadStudents();
    setView("students");
  }

  async function loadStudents() {
    setStudentsLoading(true);
    const list = await fetchAllStudents();
    list.sort((a, b) => a.name.localeCompare(b.name));
    setStudents(list);
    setStudentsLoading(false);
  }

  async function selectStudent(s: StudentProfile) {
    setSelected(s);
    setResultsLoading(true);
    setView("editing");
    setSaveMsg(null);
    resetForm();
    const res = await fetchAllResultsForStudent(s.admissionNo);
    setTermResults(res);
    setResultsLoading(false);
  }

  function resetForm() {
    setFormSession("2025/2026");
    setFormTerm(TERMS[0]);
    setRows(DEFAULT_SUBJECTS.map(s => ({ subject: s, ca: "", exam: "" })));
    setSaveMsg(null);
  }

  /** Load an existing result into the form for editing */
  function loadIntoForm(r: TermResult) {
    setFormSession(r.session);
    setFormTerm(r.term);
    setRows(r.subjects.map(s => ({ subject: s.subject, ca: String(s.ca), exam: String(s.exam) })));
    setSaveMsg(null);
  }

  function updateRow(i: number, field: keyof SubjectRow, val: string) {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  }

  function addRow() {
    setRows(prev => [...prev, { subject: "", ca: "", exam: "" }]);
  }

  function removeRow(i: number) {
    setRows(prev => prev.filter((_, idx) => idx !== i));
  }

  function buildSubjects(): SubjectResult[] {
    return rows
      .filter(r => r.subject.trim())
      .map(r => {
        const ca = Math.min(30, Math.max(0, Number(r.ca) || 0));
        const exam = Math.min(70, Math.max(0, Number(r.exam) || 0));
        const total = ca + exam;
        return { subject: r.subject.trim(), ca, exam, total, grade: calcGrade(total) };
      });
  }

  async function handleSave(release: boolean) {
    if (!selected) return;
    const subjects = buildSubjects();
    if (!subjects.length) { setSaveMsg({ ok: false, text: "Add at least one subject." }); return; }
    setSaving(true);
    setSaveMsg(null);
    const res = await saveResult(selected.admissionNo, { session: formSession, term: formTerm, subjects }, release);
    setSaving(false);
    if (!res.ok) { setSaveMsg({ ok: false, text: res.error }); return; }
    setSaveMsg({ ok: true, text: release ? "Result released to student!" : "Draft saved." });
    // Refresh list
    const updated = await fetchAllResultsForStudent(selected.admissionNo);
    setTermResults(updated);
  }

  async function handleToggleRelease(r: TermResult) {
    if (!selected) return;
    await toggleRelease(selected.admissionNo, r.id, !r.released);
    const updated = await fetchAllResultsForStudent(selected.admissionNo);
    setTermResults(updated);
  }

  async function handleDelete(r: TermResult) {
    if (!selected) return;
    if (!confirm(`Delete ${r.term} ${r.session} result?`)) return;
    await deleteResult(selected.admissionNo, r.id);
    const updated = await fetchAllResultsForStudent(selected.admissionNo);
    setTermResults(updated);
  }

  async function handleLogout() {
    await adminLogout();
    setView("login");
    setStudents([]);
    setSelected(null);
    setNews([]);
    resetNewsForm();
  }

  // ─── News handlers ────────────────────────────────────────────────────────

  function resetNewsForm() {
    setNewsForm({ ...EMPTY_NEWS_FORM, date: todayDisplay() });
    setEditingNewsId(null);
    setNewsMsg(null);
  }

  async function goToNews() {
    setView("news");
    resetNewsForm();
    setNewsLoading(true);
    const list = await fetchAllNews();
    setNews(list);
    setNewsLoading(false);
  }

  async function handleNewsImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageProcessing(true);
    try {
      const base64 = await fileToBase64Image(file);
      setNewsForm(f => ({ ...f, image: base64 }));
    } catch {
      setNewsMsg({ ok: false, text: "Could not process that image. Try a different file." });
    }
    setImageProcessing(false);
  }

  function handleEditNews(article: NewsArticle) {
    setEditingNewsId(article.id);
    setNewsForm({
      title: article.title, excerpt: article.excerpt,
      category: article.category, date: article.date, image: article.image,
    });
    setNewsMsg(null);
  }

  async function handleSaveNews(e: React.FormEvent) {
    e.preventDefault();
    if (!newsForm.title.trim() || !newsForm.excerpt.trim()) {
      setNewsMsg({ ok: false, text: "Title and excerpt are required." });
      return;
    }
    setNewsSaving(true);
    setNewsMsg(null);
    const payload = {
      title: newsForm.title.trim(),
      excerpt: newsForm.excerpt.trim(),
      category: newsForm.category,
      date: newsForm.date.trim() || todayDisplay(),
      image: newsForm.image,
    };
    const res = editingNewsId
      ? await updateNews(editingNewsId, payload)
      : await createNews(payload);
    setNewsSaving(false);
    if (!res.ok) { setNewsMsg({ ok: false, text: res.error }); return; }
    setNewsMsg({ ok: true, text: editingNewsId ? "News article updated." : "News article published." });
    resetNewsForm();
    setNewsLoading(true);
    setNews(await fetchAllNews());
    setNewsLoading(false);
  }

  async function handleDeleteNews(article: NewsArticle) {
    if (!confirm(`Delete "${article.title}"?`)) return;
    await deleteNews(article.id);
    setNews(prev => prev.filter(a => a.id !== article.id));
    if (editingNewsId === article.id) resetNewsForm();
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  if (view === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16"
        style={{ background: "linear-gradient(160deg, #0D3B6E 0%, #0a2e55 100%)", fontFamily: "'Inter',sans-serif" }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins',sans-serif" }}>Admin Portal</h1>
            <p className="text-white/50 text-sm mt-1">GSS Hong — Records Office</p>
          </div>

          <div className="p-7 rounded-3xl shadow-2xl" style={{ background: "rgba(255,255,255,0.10)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.18)" }}>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-semibold mb-1.5">Admin Email</label>
                <input type="email" value={loginForm.email} onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="admin@gsshong.edu.ng" required disabled={loginLoading}
                  autoComplete="username"
                  className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white text-sm placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all" />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-semibold mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} value={loginForm.password}
                    onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Password" required disabled={loginLoading}
                    autoComplete="current-password"
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-white/20 bg-white/10 text-white text-sm placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all" />
                  <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all">
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
              {loginError && (
                <p className="text-red-300 text-xs bg-red-900/30 border border-red-400/30 rounded-lg px-3 py-2">{loginError}</p>
              )}
              <button type="submit" disabled={loginLoading}
                className="w-full bg-accent text-white py-3 rounded-xl font-semibold text-sm hover:bg-accent/90 transition-all disabled:opacity-60">
                {loginLoading ? "Signing in…" : "Sign In"}
              </button>
            </form>
            <p className="text-white/30 text-xs text-center mt-5">
              Admin accounts are created by the ICT office via Firebase console.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (view === "students") {
    return (
      <div className="min-h-screen bg-background" style={{ fontFamily: "'Inter',sans-serif" }}>
        {/* Header */}
        <div className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Users size={20} className="text-primary" />
            <h1 className="font-black text-primary text-lg" style={{ fontFamily: "'Poppins',sans-serif" }}>Admin Dashboard</h1>
            <span className="text-muted-foreground text-xs">{students.length} students</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
              <button className="px-3 py-1.5 text-xs font-semibold rounded-md bg-white text-primary shadow-sm">Students</button>
              <button onClick={goToNews} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md text-muted-foreground hover:text-primary transition-all">
                <Newspaper size={13} /> News
              </button>
            </div>
            <button onClick={loadStudents} disabled={studentsLoading}
              className="text-muted-foreground hover:text-primary transition-all disabled:opacity-40" title="Refresh">
              <RefreshCw size={16} className={studentsLoading ? "animate-spin" : ""} />
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-all border border-border px-3 py-1.5 rounded-lg">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-10">
          {studentsLoading ? (
            <p className="text-center text-muted-foreground text-sm py-20">Loading students…</p>
          ) : students.length === 0 ? (
            <div className="text-center py-20">
              <Users size={40} className="text-muted-foreground mx-auto mb-4" />
              <p className="font-semibold text-primary mb-1" style={{ fontFamily: "'Poppins',sans-serif" }}>No students registered yet</p>
              <p className="text-muted-foreground text-sm">Students appear here after registering via the /register page.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {students.map((s, i) => (
                <button key={i} onClick={() => selectStudent(s)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 bg-card border border-border rounded-2xl hover:border-primary/40 hover:bg-primary/3 transition-all text-left group">
                  <div>
                    <p className="font-semibold text-foreground">{s.name}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{s.admissionNo} · {s.className}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-all flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── News management view ───────────────────────────────────────────────────
  if (view === "news") {
    return (
      <div className="min-h-screen bg-background" style={{ fontFamily: "'Inter',sans-serif" }}>
        <div className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Newspaper size={20} className="text-primary" />
            <h1 className="font-black text-primary text-lg" style={{ fontFamily: "'Poppins',sans-serif" }}>News Management</h1>
            <span className="text-muted-foreground text-xs">{news.length} articles</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
              <button onClick={() => { setView("students"); resetNewsForm(); }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md text-muted-foreground hover:text-primary transition-all">
                <Users size={13} /> Students
              </button>
              <button className="px-3 py-1.5 text-xs font-semibold rounded-md bg-white text-primary shadow-sm">News</button>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-all border border-border px-3 py-1.5 rounded-lg">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">
          {/* Existing articles */}
          <section>
            <h2 className="font-black text-primary mb-4" style={{ fontFamily: "'Poppins',sans-serif" }}>Published Articles</h2>
            {newsLoading ? (
              <p className="text-muted-foreground text-sm">Loading…</p>
            ) : news.length === 0 ? (
              <p className="text-muted-foreground text-sm">No articles yet. Use the form below to publish the first one.</p>
            ) : (
              <div className="space-y-2">
                {news.map(article => (
                  <div key={article.id} className="flex items-center gap-4 px-5 py-3.5 bg-card border border-border rounded-2xl">
                    <div className="w-14 h-14 rounded-xl bg-muted flex-shrink-0 overflow-hidden">
                      {article.image && <img src={article.image} alt={article.title} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{article.title}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">{article.category} · {article.date}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => handleEditNews(article)}
                        className="p-1.5 text-muted-foreground hover:text-primary transition-all" title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDeleteNews(article)}
                        className="p-1.5 text-muted-foreground hover:text-red-500 transition-all" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Create / edit form */}
          <section>
            <h2 className="font-black text-primary mb-4" style={{ fontFamily: "'Poppins',sans-serif" }}>
              {editingNewsId ? "Edit Article" : "Publish New Article"}
            </h2>
            <form onSubmit={handleSaveNews} className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-5">
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5">Photo</label>
                <div className="flex items-center gap-4">
                  <div className="w-28 h-20 rounded-xl bg-muted overflow-hidden flex items-center justify-center flex-shrink-0 border border-border">
                    {newsForm.image
                      ? <img src={newsForm.image} alt="" className="w-full h-full object-cover" />
                      : <ImagePlus size={20} className="text-muted-foreground" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3 py-2 text-xs font-semibold border border-border rounded-lg hover:bg-primary/5 text-primary transition-all">
                      {imageProcessing ? "Processing…" : "Choose photo"}
                      <input type="file" accept="image/*" className="hidden" disabled={imageProcessing} onChange={handleNewsImageChange} />
                    </label>
                    {newsForm.image && (
                      <button type="button" onClick={() => setNewsForm(f => ({ ...f, image: "" }))}
                        className="p-2 text-muted-foreground hover:text-red-500 transition-all" title="Remove photo">
                        <XIcon size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5">Title</label>
                <input value={newsForm.title} onChange={e => setNewsForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. GSS Hong Records 94% Distinction Rate in 2025 WAEC"
                  className={inputCls} required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5">Excerpt</label>
                <textarea value={newsForm.excerpt} onChange={e => setNewsForm(f => ({ ...f, excerpt: e.target.value }))}
                  placeholder="A short summary shown on the news cards…" rows={3}
                  className={inputCls} required />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">Category</label>
                  <select value={newsForm.category} onChange={e => setNewsForm(f => ({ ...f, category: e.target.value }))} className={inputCls}>
                    {NEWS_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">Date</label>
                  <input value={newsForm.date} onChange={e => setNewsForm(f => ({ ...f, date: e.target.value }))}
                    placeholder={todayDisplay()} className={inputCls} />
                </div>
              </div>

              {newsMsg && (
                <p className={`text-sm font-medium px-3 py-2 rounded-lg border ${newsMsg.ok ? "text-green-700 bg-green-50 border-green-200" : "text-red-600 bg-red-50 border-red-200"}`}>
                  {newsMsg.text}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={newsSaving || imageProcessing}
                  className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent/90 transition-all disabled:opacity-60">
                  <Send size={15} /> {newsSaving ? "Publishing…" : editingNewsId ? "Save Changes" : "Publish Article"}
                </button>
                {editingNewsId && (
                  <button type="button" onClick={resetNewsForm}
                    className="px-5 py-2.5 border border-border rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted/40 transition-all">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>
      </div>
    );
  }

  // ─── Editing view ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Inter',sans-serif" }}>
      {/* Header */}
      <div className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => { setView("students"); setSelected(null); }}
            className="text-muted-foreground hover:text-primary transition-all">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-black text-primary" style={{ fontFamily: "'Poppins',sans-serif" }}>{selected?.name}</h1>
            <p className="text-muted-foreground text-xs">{selected?.admissionNo} · {selected?.className}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary border border-border px-3 py-1.5 rounded-lg">
          <LogOut size={14} /> Sign out
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">

        {/* Existing results */}
        <section>
          <h2 className="font-black text-primary mb-4" style={{ fontFamily: "'Poppins',sans-serif" }}>Published Results</h2>
          {resultsLoading ? (
            <p className="text-muted-foreground text-sm">Loading…</p>
          ) : termResults.length === 0 ? (
            <p className="text-muted-foreground text-sm">No results saved yet. Use the form below to add one.</p>
          ) : (
            <div className="space-y-3">
              {termResults.map(r => (
                <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-card border border-border rounded-2xl">
                  <div className="flex items-center gap-3">
                    {r.released
                      ? <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      : <Clock size={16} className="text-amber-500 flex-shrink-0" />}
                    <div>
                      <p className="font-semibold text-foreground text-sm">{r.term} · {r.session}</p>
                      <p className="text-muted-foreground text-xs">{r.subjects.length} subjects · avg {r.average}%  · {r.released ? "Released" : "Draft"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => loadIntoForm(r)}
                      className="px-3 py-1.5 text-xs font-semibold border border-border rounded-lg hover:bg-primary/5 text-primary transition-all">
                      Edit
                    </button>
                    <button onClick={() => handleToggleRelease(r)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${r.released ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}>
                      {r.released ? "Unpublish" : "Release"}
                    </button>
                    <button onClick={() => handleDelete(r)}
                      className="p-1.5 text-muted-foreground hover:text-red-500 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Score entry form */}
        <section>
          <h2 className="font-black text-primary mb-4" style={{ fontFamily: "'Poppins',sans-serif" }}>Add / Edit Result</h2>
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-5">

            {/* Session & Term */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5">Academic Session</label>
                <input type="text" value={formSession} onChange={e => setFormSession(e.target.value)}
                  placeholder="e.g. 2025/2026" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5">Term</label>
                <select value={formTerm} onChange={e => setFormTerm(e.target.value)} className={inputCls}>
                  {TERMS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Subjects table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-primary">Subjects</label>
                <button type="button" onClick={addRow}
                  className="flex items-center gap-1 text-accent text-xs font-semibold hover:text-accent/80 transition-all">
                  <Plus size={14} /> Add subject
                </button>
              </div>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/40 text-left text-muted-foreground border-b border-border">
                      <th className="py-2 px-3 font-semibold">Subject</th>
                      <th className="py-2 px-3 font-semibold text-center w-20">CA (30)</th>
                      <th className="py-2 px-3 font-semibold text-center w-20">Exam (70)</th>
                      <th className="py-2 px-3 font-semibold text-center w-20">Total</th>
                      <th className="py-2 px-3 font-semibold text-center w-16">Grade</th>
                      <th className="py-2 px-2 w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => {
                      const ca = Math.min(30, Math.max(0, Number(row.ca) || 0));
                      const exam = Math.min(70, Math.max(0, Number(row.exam) || 0));
                      const total = row.ca !== "" || row.exam !== "" ? ca + exam : null;
                      const grade = total !== null ? calcGrade(total) : "—";
                      return (
                        <tr key={i} className="border-b border-border/50 last:border-0">
                          <td className="py-1.5 px-2">
                            <input value={row.subject} onChange={e => updateRow(i, "subject", e.target.value)}
                              placeholder="Subject name" className="w-full px-2 py-1.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 bg-white/70" />
                          </td>
                          <td className="py-1.5 px-2">
                            <input type="number" min={0} max={30} value={row.ca}
                              onChange={e => updateRow(i, "ca", e.target.value)}
                              placeholder="0" className="w-full px-2 py-1.5 rounded-lg border border-border text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary/30 bg-white/70" />
                          </td>
                          <td className="py-1.5 px-2">
                            <input type="number" min={0} max={70} value={row.exam}
                              onChange={e => updateRow(i, "exam", e.target.value)}
                              placeholder="0" className="w-full px-2 py-1.5 rounded-lg border border-border text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary/30 bg-white/70" />
                          </td>
                          <td className="py-1.5 px-2 text-center font-semibold text-foreground">
                            {total !== null ? total : "—"}
                          </td>
                          <td className="py-1.5 px-2 text-center">
                            <span className="px-1.5 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">{grade}</span>
                          </td>
                          <td className="py-1.5 px-1">
                            <button onClick={() => removeRow(i)} className="text-muted-foreground hover:text-red-500 transition-all">
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            {saveMsg && (
              <p className={`text-sm font-medium px-3 py-2 rounded-lg border ${saveMsg.ok ? "text-green-700 bg-green-50 border-green-200" : "text-red-600 bg-red-50 border-red-200"}`}>
                {saveMsg.text}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <button onClick={() => handleSave(false)} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 border border-border rounded-xl text-sm font-semibold text-primary hover:bg-primary/5 transition-all disabled:opacity-60">
                <Save size={15} /> {saving ? "Saving…" : "Save Draft"}
              </button>
              <button onClick={() => handleSave(true)} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent/90 transition-all disabled:opacity-60">
                <Send size={15} /> {saving ? "Releasing…" : "Release Result"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
