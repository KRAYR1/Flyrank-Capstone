import { useState, useRef, type ReactNode, type KeyboardEvent } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  label: string;
  defaultTabId?: string;
}

/**
 * Tabs implementing the APG Tabs pattern (automatic activation, horizontal,
 * with wrap-around):
 * https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 *
 * - tablist has role="tablist"
 * - each tab has role="tab", aria-selected, aria-controls
 * - each panel has role="tabpanel", aria-labelledby
 * - roving tabindex: only the active tab is in the Tab sequence
 * - ArrowLeft/ArrowRight move + activate focus; Home/End jump to ends
 */
export function Tabs({ items, label, defaultTabId }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function activate(id: string) {
    setActiveId(id);
    tabRefs.current[id]?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const lastIndex = items.length - 1;

    switch (e.key) {
      case "ArrowRight": {
        e.preventDefault();
        const next = index === lastIndex ? 0 : index + 1;
        activate(items[next].id);
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        const prev = index === 0 ? lastIndex : index - 1;
        activate(items[prev].id);
        break;
      }
      case "Home":
        e.preventDefault();
        activate(items[0].id);
        break;
      case "End":
        e.preventDefault();
        activate(items[lastIndex].id);
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <div role="tablist" aria-label={label} style={styles.tablist}>
        {items.map((item, index) => {
          const selected = item.id === activeId;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[item.id] = el;
              }}
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              style={{
                ...styles.tab,
                ...(selected ? styles.tabSelected : {}),
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`panel-${item.id}`}
          aria-labelledby={`tab-${item.id}`}
          hidden={item.id !== activeId}
          tabIndex={0}
          style={styles.panel}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

const styles = {
  tablist: { display: "flex", gap: 4, borderBottom: "1px solid #e5e3dc" },
  tab: {
    padding: "8px 16px",
    border: "none",
    background: "transparent",
    borderBottom: "2px solid transparent",
    cursor: "pointer",
    fontSize: 14,
  },
  tabSelected: {
    borderBottom: "2px solid #1f1e1b",
    fontWeight: 600,
  },
  panel: { padding: "16px 4px" },
};
