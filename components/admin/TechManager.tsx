"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { TechStackItemDTO } from "@/lib/serialize";
import { TECH_CATEGORIES } from "@/lib/constants";
import { adminFetch } from "@/lib/admin-client";
import ConfirmModal from "@/components/admin/ConfirmModal";
import Toast, { type ToastMessage } from "@/components/admin/Toast";
import { useDragReorder } from "@/components/admin/useDragReorder";

const EMPTY_FORM = {
  name: "",
  category: "Frontend" as string,
  iconUrl: "",
  sortOrder: 0,
};

export default function TechManager({
  items,
}: {
  items: TechStackItemDTO[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleting, setDeleting] = useState<TechStackItemDTO | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const { list, rowProps } = useDragReorder(items, "tech", setToast);

  function startNew() {
    setForm(EMPTY_FORM);
    setEditingId("new");
  }

  function startEdit(item: TechStackItemDTO) {
    setForm({
      name: item.name,
      category: item.category,
      iconUrl: item.iconUrl ?? "",
      sortOrder: item.sortOrder,
    });
    setEditingId(item._id);
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const isNew = editingId === "new";
    const result = isNew
      ? await adminFetch("/api/admin/tech", {
          method: "POST",
          body: JSON.stringify(form),
        })
      : await adminFetch(`/api/admin/tech/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
    setBusy(false);
    if (!result.ok) {
      setToast({ type: "danger", text: result.error });
      return;
    }
    setToast({
      type: "success",
      text: isNew ? "Tech item added." : "Tech item updated.",
    });
    setEditingId(null);
    router.refresh();
  }

  async function handleDelete() {
    if (!deleting) return;
    setBusy(true);
    const result = await adminFetch(`/api/admin/tech/${deleting._id}`, {
      method: "DELETE",
    });
    setBusy(false);
    if (!result.ok) {
      setToast({ type: "danger", text: result.error });
      return;
    }
    setToast({ type: "success", text: `"${deleting.name}" deleted.` });
    setDeleting(null);
    router.refresh();
  }

  return (
    <>
      <header className="admin-page-header d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div>
          <h1 className="h3 fw-bold mb-1">Tech stack</h1>
          <p className="text-secondary mb-0">
            {items.length} items, grouped by category on the homepage — drag
            rows to reorder within a category.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={startNew}>
          + Add tech
        </button>
      </header>

      {editingId !== null && (
        <form className="admin-editor mb-4" onSubmit={handleSave}>
          <h2 className="h6 fw-bold mb-3">
            {editingId === "new" ? "Add tech item" : "Edit tech item"}
          </h2>
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="tech-name" className="form-label">
                Name *
              </label>
              <input
                id="tech-name"
                type="text"
                className="form-control"
                maxLength={60}
                required
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
              />
            </div>
            <div className="col-md-3 col-6">
              <label htmlFor="tech-category" className="form-label">
                Category *
              </label>
              <select
                id="tech-category"
                className="form-select"
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value })
                }
              >
                {TECH_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label htmlFor="tech-icon" className="form-label">
                Icon URL
              </label>
              <input
                id="tech-icon"
                type="text"
                className="form-control"
                placeholder="https://… or /uploads/…"
                value={form.iconUrl}
                onChange={(event) =>
                  setForm({ ...form, iconUrl: event.target.value })
                }
              />
            </div>
            <div className="col-md-2 col-6">
              <label htmlFor="tech-sort" className="form-label">
                Sort order
              </label>
              <input
                id="tech-sort"
                type="number"
                className="form-control"
                min={0}
                value={form.sortOrder}
                onChange={(event) =>
                  setForm({ ...form, sortOrder: Number(event.target.value) })
                }
              />
            </div>
          </div>
          <div className="d-flex gap-2 mt-3">
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={busy || !form.name.trim()}
            >
              {busy ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setEditingId(null)}
              disabled={busy}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="admin-table-wrap">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col" aria-label="Drag to reorder" />
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Category</th>
              <th scope="col" className="text-end">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={item._id} {...rowProps(index)}>
                <td className="drag-handle" title="Drag to reorder">
                  ⠿
                </td>
                <td>{index + 1}</td>
                <td className="fw-semibold">{item.name}</td>
                <td>
                  <span className="badge badge-tech">{item.category}</span>
                </td>
                <td className="text-end">
                  <div className="btn-group btn-group-sm">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => startEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => setDeleting(item)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-secondary py-4">
                  No tech items yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        show={deleting !== null}
        title="Delete tech item?"
        body={`"${deleting?.name}" will be removed from the tech grid. This cannot be undone.`}
        busy={busy}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
      <Toast message={toast} onClose={() => setToast(null)} />
    </>
  );
}
