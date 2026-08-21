import { useState } from "react";
import { Modal } from "./Modal";
import { Tabs, type TabItem } from "./Tabs";
import { Disclosure } from "./Disclosure";

const tabItems: TabItem[] = [
  { id: "overview", label: "Overview", content: <p>Overview panel content.</p> },
  { id: "details", label: "Details", content: <p>Details panel content.</p> },
  { id: "settings", label: "Settings", content: <p>Settings panel content.</p> },
];

export default function PlaygroundApp() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ maxWidth: 560, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Accessible components playground</h1>

      <section style={{ marginBottom: 32 }}>
        <h2>Modal</h2>
        <button type="button" onClick={() => setModalOpen(true)}>
          Open modal
        </button>
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          titleId="demo-modal-title"
          title="Example modal"
        >
          <p>
            Try Tab / Shift+Tab to confirm focus stays trapped, and Escape to
            close.
          </p>
          <input placeholder="Focusable field" />
        </Modal>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2>Tabs</h2>
        <Tabs items={tabItems} label="Example tabs" />
      </section>

      <section>
        <h2>Disclosure</h2>
        <Disclosure id="faq-1" summary="What is this playground?">
          <p>Three hand-built accessible components for FE-02.</p>
        </Disclosure>
        <Disclosure id="faq-2" summary="Why build these by hand first?">
          <p>To understand what a library like shadcn/ui handles for you.</p>
        </Disclosure>
      </section>
    </div>
  );
}
