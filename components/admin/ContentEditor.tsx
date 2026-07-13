"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { adminFetch } from "@/lib/admin-client";
import Toast, { type ToastMessage } from "@/components/admin/Toast";
import ImageUploadField from "@/components/admin/ImageUploadField";
import FileUploadField from "@/components/admin/FileUploadField";

interface ContentItem {
  key: string;
  value: string;
}

// Keys ending in _image get an image uploader instead of a text field.
function isImageKey(key: string): boolean {
  return key.endsWith("_image");
}

// The resume gets a document (PDF) uploader.
function isDocumentKey(key: string): boolean {
  return key === "resume_url";
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
        <span className="admin-eyebrow">Content</span>
        <h1 className="admin-page-title">Site content</h1>
        <p className="admin-page-lead">
          Page copy and links used across the public site. Values marked TODO
          still need your real details.
        </p>
      </header>

      <form className="admin-editor" onSubmit={handleSave}>
        {items.map((item) => {
          const dirty = values[item.key] !== initial[item.key];
          const keyTag = (
            <>
              <code className="small text-secondary">{item.key}</code>
              {dirty && (
                <span className="badge text-bg-warning ms-2">unsaved</span>
              )}
            </>
          );

          if (isImageKey(item.key)) {
            return (
              <div className="mb-4" key={item.key}>
                <ImageUploadField
                  id={`content-${item.key}`}
                  label={prettifyKey(item.key)}
                  value={values[item.key] ?? ""}
                  onChange={(url) => setValues({ ...values, [item.key]: url })}
                />
                <div className="form-text mt-1">{keyTag}</div>
              </div>
            );
          }

          if (isDocumentKey(item.key)) {
            return (
              <div className="mb-4" key={item.key}>
                <FileUploadField
                  id={`content-${item.key}`}
                  label={prettifyKey(item.key)}
                  value={values[item.key] ?? ""}
                  onChange={(url) => setValues({ ...values, [item.key]: url })}
                  helpText="Upload your resume as a PDF (max 4 MB), or paste a link below."
                />
                <input
                  type="text"
                  className="form-control form-control-sm mt-2"
                  placeholder="https://…"
                  value={values[item.key] ?? ""}
                  onChange={(event) =>
                    setValues({ ...values, [item.key]: event.target.value })
                  }
                  aria-label={`${prettifyKey(item.key)} URL`}
                />
                <div className="form-text mt-1">{keyTag}</div>
              </div>
            );
          }

          return (
            <div className="mb-3" key={item.key}>
              <label htmlFor={`content-${item.key}`} className="form-label">
                {prettifyKey(item.key)} {keyTag}
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
          );
        })}

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
