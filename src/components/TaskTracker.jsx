import { useState } from "react";

const PRIORITY_STYLES = {
  low: { background: "#e8f5ee", color: "#1a7a4c", border: "#bfe6d1" },
  medium: { background: "#fef3e2", color: "#a05a00", border: "#f8d9a6" },
  high: { background: "#fdeaea", color: "#c53030", border: "#f5c2c2" },
};

export default function TaskTracker() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");

  function addTask() {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!dueDate) {
      setError("Due date is required.");
      return;
    }
    setError("");
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        subject: subject.trim(),
        dueDate,
        priority,
        done: false,
      },
    ]);
    setTitle("");
    setSubject("");
    setDueDate("");
    setPriority("medium");
  }

  function toggleDone(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function isOverdue(task) {
    if (task.done) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(task.dueDate) < today;
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }

  const sorted = [...tasks].sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
  );
  const activeCount = tasks.filter((t) => !t.done).length;
  const overdueCount = tasks.filter((t) => isOverdue(t)).length;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>Task tracker</h1>
            <p style={styles.subheading}>BrainBrews</p>
          </div>
          {tasks.length > 0 && (
            <div style={styles.statPills}>
              <span style={styles.statPill}>{activeCount} active</span>
              {overdueCount > 0 && (
                <span style={{ ...styles.statPill, ...styles.statPillDanger }}>
                  {overdueCount} overdue
                </span>
              )}
            </div>
          )}
        </div>

        <div style={styles.form}>
          <div style={styles.row}>
            <div style={{ ...styles.field, flex: 2 }}>
              <label htmlFor="title" style={styles.label}>
                Task title
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Finish DBMS assignment"
                style={styles.input}
              />
            </div>
            <div style={{ ...styles.field, flex: 1 }}>
              <label htmlFor="subject" style={styles.label}>
                Subject
              </label>
              <input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="DBMS"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.field, flex: 1 }}>
              <label htmlFor="dueDate" style={styles.label}>
                Due date
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={{ ...styles.field, flex: 1 }}>
              <label htmlFor="priority" style={styles.label}>
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={styles.input}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {error && (
            <p role="alert" style={styles.error}>
              {error}
            </p>
          )}

          <button onClick={addTask} style={styles.primaryBtn}>
            Add task
          </button>
        </div>

        <div style={styles.list}>
          {sorted.length === 0 && (
            <div style={styles.emptyState}>
              <p style={styles.emptyTitle}>No tasks yet</p>
              <p style={styles.emptyBody}>Add your first task above to get started.</p>
            </div>
          )}
          {sorted.map((t) => (
            <div
              key={t.id}
              style={{
                ...styles.taskRow,
                ...(t.done ? styles.taskRowDone : {}),
              }}
            >
              <div style={styles.taskLeft}>
                <button
                  onClick={() => toggleDone(t.id)}
                  aria-label={t.done ? `Mark ${t.title} incomplete` : `Mark ${t.title} complete`}
                  style={{
                    ...styles.checkbox,
                    ...(t.done ? styles.checkboxChecked : {}),
                  }}
                >
                  {t.done && "✓"}
                </button>
                <div>
                  <p
                    style={{
                      ...styles.taskTitle,
                      ...(t.done ? styles.taskTitleDone : {}),
                    }}
                  >
                    {t.title}
                  </p>
                  <div style={styles.taskMeta}>
                    {t.subject && <span>{t.subject}</span>}
                    {t.subject && <span style={styles.dot}>·</span>}
                    <span style={isOverdue(t) ? styles.overdueText : undefined}>
                      {formatDate(t.dueDate)}
                      {isOverdue(t) ? " (overdue)" : ""}
                    </span>
                  </div>
                </div>
              </div>
              <div style={styles.taskRight}>
                <span
                  style={{
                    ...styles.badge,
                    background: PRIORITY_STYLES[t.priority].background,
                    color: PRIORITY_STYLES[t.priority].color,
                    border: `1px solid ${PRIORITY_STYLES[t.priority].border}`,
                  }}
                >
                  {t.priority}
                </span>
                <button
                  onClick={() => deleteTask(t.id)}
                  aria-label={`Delete ${t.title}`}
                  style={styles.deleteBtn}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f6f5f1",
    padding: "48px 16px",
    display: "flex",
    justifyContent: "center",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 620,
    background: "#ffffff",
    border: "1px solid #eae8e0",
    borderRadius: 16,
    padding: "28px 28px 20px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.04)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  heading: {
    fontSize: 21,
    fontWeight: 600,
    margin: 0,
    color: "#1a1a17",
    letterSpacing: "-0.01em",
  },
  subheading: {
    fontSize: 13,
    color: "#8a8880",
    margin: "2px 0 0",
    fontWeight: 500,
  },
  statPills: { display: "flex", gap: 6 },
  statPill: {
    fontSize: 12,
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: 20,
    background: "#f1f0ea",
    color: "#5c5a52",
  },
  statPillDanger: {
    background: "#fdeaea",
    color: "#c53030",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    paddingBottom: 22,
    borderBottom: "1px solid #f0efe8",
    marginBottom: 18,
  },
  row: { display: "flex", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "#6b6a62",
    letterSpacing: "0.01em",
  },
  input: {
    padding: "9px 11px",
    border: "1px solid #ddd9cf",
    borderRadius: 9,
    fontSize: 14,
    background: "#fbfaf7",
    color: "#1a1a17",
    outline: "none",
    fontFamily: "inherit",
  },
  error: { fontSize: 12.5, color: "#c53030", margin: 0 },
  primaryBtn: {
    marginTop: 4,
    padding: "10px 18px",
    borderRadius: 9,
    border: "none",
    background: "#1a1a17",
    color: "#fff",
    fontSize: 13.5,
    fontWeight: 600,
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  list: { display: "flex", flexDirection: "column" },
  emptyState: { textAlign: "center", padding: "28px 0" },
  emptyTitle: { fontSize: 14, fontWeight: 600, color: "#3a3934", margin: 0 },
  emptyBody: { fontSize: 13, color: "#9a988f", margin: "4px 0 0" },
  taskRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 2px",
    borderBottom: "1px solid #f3f2ec",
    gap: 10,
  },
  taskRowDone: { opacity: 0.5 },
  taskLeft: { display: "flex", alignItems: "flex-start", gap: 10, minWidth: 0 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    border: "1.5px solid #d3d1c6",
    background: "#fff",
    color: "#fff",
    fontSize: 12,
    lineHeight: "18px",
    cursor: "pointer",
    flexShrink: 0,
    marginTop: 2,
    padding: 0,
  },
  checkboxChecked: {
    background: "#1a1a17",
    borderColor: "#1a1a17",
  },
  taskTitle: {
    fontSize: 14.5,
    fontWeight: 500,
    color: "#1a1a17",
    margin: 0,
  },
  taskTitleDone: { textDecoration: "line-through", color: "#9a988f" },
  taskMeta: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12.5,
    color: "#9a988f",
    marginTop: 3,
  },
  dot: { color: "#d3d1c6" },
  overdueText: { color: "#c53030", fontWeight: 600 },
  taskRight: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 },
  badge: {
    fontSize: 11,
    padding: "3px 9px",
    borderRadius: 20,
    fontWeight: 600,
    textTransform: "capitalize",
  },
  deleteBtn: {
    width: 24,
    height: 24,
    borderRadius: 7,
    border: "none",
    background: "transparent",
    color: "#b5b3a8",
    fontSize: 18,
    lineHeight: 1,
    cursor: "pointer",
  },
};
