"use client";

import { useState, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { PlusCircle, CheckCircle2, Trash2 } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  priority: "High" | "Medium" | "Low";
  category: string;
  due_date: string;
  status: "Pending" | "Completed";
  created_date: string;
  completed_date: string | null;
}

const PRIORITIES = ["High", "Medium", "Low"] as const;
const CATEGORIES = ["General", "Customer", "Invoice", "Expense", "Reminder", "Idea"];

const PRIORITY_COLOR: Record<string, string> = {
  High: "text-[var(--error)]",
  Medium: "text-[var(--warning)]",
  Low: "text-[#00aaff]",
};
const PRIORITY_BG: Record<string, string> = {
  High: "bg-[#3a1f1f] border-red-900/50",
  Medium: "bg-[#3a3a1f] border-yellow-900/50",
  Low: "bg-[#1f2f3a] border-blue-900/30",
};

export default function NotesPage() {
  const [notes, setNotes, loaded] = useLocalStorage<Note[]>("ritech_notes", []);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const addNote = () => {
    if (!title.trim() || !content.trim()) { setError("Title and content are required."); return; }
    const note: Note = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      priority,
      category,
      due_date: dueDate,
      status: "Pending",
      created_date: new Date().toISOString(),
      completed_date: null,
    };
    setNotes(prev => [note, ...(prev as Note[])]);
    setTitle(""); setContent(""); setPriority("Medium"); setCategory(CATEGORIES[0]); setDueDate(""); setError("");
  };

  const completeNote = (id: string) => {
    setNotes(prev => (prev as Note[]).map(n => n.id === id ? { ...n, status: "Completed" as const, completed_date: new Date().toISOString() } : n));
  };

  const deleteNote = (id: string) => {
    if (confirm("Delete this note?")) setNotes(prev => (prev as Note[]).filter(n => n.id !== id));
  };

  const filtered = useMemo(() => {
    return notes.filter(n => {
      const sMatch = statusFilter === "All" || n.status === statusFilter;
      const pMatch = priorityFilter === "All" || n.priority === priorityFilter;
      const cMatch = categoryFilter === "All" || n.category === categoryFilter;
      return sMatch && pMatch && cMatch;
    });
  }, [notes, statusFilter, priorityFilter, categoryFilter]);

  if (!loaded) return <div className="flex h-full items-center justify-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-[var(--success)]">📝 Notes & Tasks Manager</h1>

      {/* Add Note Form */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--accent)]">➕ Add Note</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" placeholder="Title" value={title}
            onChange={e => setTitle(e.target.value)}
            className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 focus:outline-none focus:border-[var(--accent)]"
          />
          <input type="text" placeholder="Content / Description" value={content}
            onChange={e => setContent(e.target.value)}
            className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 focus:outline-none focus:border-[var(--accent)]"
          />
          <select value={priority} onChange={e => setPriority(e.target.value as typeof priority)}
            className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 focus:outline-none focus:border-[var(--accent)]">
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 focus:outline-none focus:border-[var(--accent)]">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
            className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-xl px-4 py-2 focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
        {error && <p className="text-[var(--error)] text-sm">{error}</p>}
        <button onClick={addNote}
          className="flex items-center gap-2 bg-gradient-to-r from-[var(--accent)] to-[#00b3ff] text-black font-bold py-2 px-6 rounded-xl hover:opacity-90">
          <PlusCircle size={18} /> Add Note
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl p-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">Status:</label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-lg px-3 py-1 text-sm focus:outline-none">
            {["All", "Pending", "Completed"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">Priority:</label>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
            className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-lg px-3 py-1 text-sm focus:outline-none">
            {["All", "High", "Medium", "Low"].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">Category:</label>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="bg-[#1a1a2e] text-white border border-[var(--panel-border)] rounded-lg px-3 py-1 text-sm focus:outline-none">
            {["All", ...CATEGORIES].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <span className="text-gray-500 text-sm self-center">{filtered.length} note{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No notes found. {statusFilter === "Pending" && "🎉 All clear!"}</div>
        ) : (
          filtered.map(note => {
            const isCompleted = note.status === "Completed";
            return (
              <div key={note.id}
                className={`border rounded-2xl p-5 ${isCompleted ? "bg-[#1f3a2f] border-green-900/30" : PRIORITY_BG[note.priority]}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold text-base ${isCompleted ? "text-[var(--success)]" : PRIORITY_COLOR[note.priority]}`}>
                      {note.title}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isCompleted ? "bg-green-900/30 text-[var(--success)]" : "bg-[#2a2a3b] text-gray-400"}`}>
                      {note.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isCompleted && (
                      <button onClick={() => completeNote(note.id)} className="text-[var(--success)] hover:opacity-80" title="Mark complete">
                        <CheckCircle2 size={20} />
                      </button>
                    )}
                    <button onClick={() => deleteNote(note.id)} className="text-[var(--error)] hover:opacity-80" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-3">{note.content}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <span>🏷️ {note.category}</span>
                  <span>⚡ {note.priority}</span>
                  {note.due_date && <span>📅 Due: {note.due_date}</span>}
                  <span>🕒 {new Date(note.created_date).toLocaleDateString("en-IN")}</span>
                  {isCompleted && note.completed_date && (
                    <span className="text-[var(--success)]">✅ Done: {new Date(note.completed_date).toLocaleDateString("en-IN")}</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
