import { useState, type ReactNode } from "react";

interface DisclosureProps {
  id: string;
  summary: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

/**
 * Disclosure implementing the APG Disclosure (Show/Hide) pattern:
 * https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 *
 * - a single <button> controls visibility of the associated content
 * - aria-expanded reflects open/closed state
 * - aria-controls points at the content's id
 * - Enter/Space activation is native <button> behavior, no custom
 *   keyboard handling required
 */
export function Disclosure({ id, summary, children, defaultOpen = false }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = `disclosure-content-${id}`;
  const buttonId = `disclosure-button-${id}`;

  return (
    <div style={styles.wrapper}>
      <button
        type="button"
        id={buttonId}
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((prev) => !prev)}
        style={styles.button}
      >
        <span style={{ ...styles.icon, ...(open ? styles.iconOpen : {}) }}>
          ▸
        </span>
        {summary}
      </button>
      <div
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
        style={styles.content}
      >
        {children}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { borderBottom: "1px solid #eee" },
  button: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
    textAlign: "left" as const,
    padding: "10px 4px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  },
  icon: {
    display: "inline-block",
    transition: "transform 0.15s ease",
    fontSize: 12,
  },
  iconOpen: { transform: "rotate(90deg)" },
  content: { padding: "0 4px 12px 24px", fontSize: 14, color: "#3a3934" },
};
