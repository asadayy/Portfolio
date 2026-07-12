"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { adminFetch } from "@/lib/admin-client";
import Toast, { type ToastMessage } from "@/components/admin/Toast";

interface ContentItem {
  key: string;
  value: string;
}

function prettifyKey(key: string): string {
  const label = key.replace(/_/g, " ");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function rowsFor(value: string): number {
  if (value.includes("\n") || value.length > 160) return 4;
  if (value.length > 80) return 2;
  return 1;
}

export default function ContentEditor({ items }: { items: ContentItem[] }) {
  const router = useRouter();
  const initial = useMemo(
    () => Object.fromEntries(items.map((item) => [item.key, item.value])),
    [items]
  );
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const dirtyKeys = items
    .map((item) => item.key)
    .filter((key) => values[key] !== initial[key]);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const result = await adminFetch("/api/admin/content", {
      method: "PUT",
      body: JSON.stringify({
        items: items.map((item) => ({
          key: item.key,
          value: values[item.key] ?? "",
        })),
      }),
    });
    setBusy(false);
    if (!result.ok) {
      setToast({ type: "danger", text: result.error });
      return;
    }
    setToast({ type: "success", text: "Site content saved." });
    router.refresh();
  }

  return (
    <>
      <header className="admin-page-header">
        <h1 className="h3 fw-bold mb-1">Site content</h1>
        <p className="text-secondary mb-0">
          Page copy and links used across the public site. Values marked TODO
          still need your real details.
        </p>
      </header>

      <form className="admin-editor" onSubmit={handleSave}>
        {items.map((item) => (
          <div className="mb-3" key={item.key}>
            <label htmlFor={`content-${item.key}`} className="form-label">
              {prettifyKey(item.key)}{" "}
              <code className="small text-secondary">{item.key}</code>
              {values[item.key] !== initial[item.key] && (
                <span className="badge text-bg-warning ms-2">unsaved</span>
              )}
            </label>
            <textarea
              id={`content-${item.key}`}
              className="form-control"
              rows={rowsFor(values[item.key] ?? "")}
              value={values[item.key] ?? ""}
              onChange={(event) =>
                setValues({ ...values, [item.key]: event.target.value })
              }
            />
          </div>
        ))}

        <div className="d-flex align-items-center gap-3 mt-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={busy || dirtyKeys.length === 0}
          >
            {busy ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  aria-hidden
                />
                Saving…
              </>
            ) : (
              "Save all"
            )}
          </button>
          <span className="text-secondary small">
            {dirtyKeys.length === 0
              ? "No unsaved changes"
              : `${dirtyKeys.length} unsaved change${dirtyKeys.length === 1 ? "" : "s"}`}
          </span>
        </div>
      </form>

      <Toast message={toast} onClose={() => setToast(null)} />
    </>
  );
}
