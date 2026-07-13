"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { ActivityDTO } from "@/lib/serialize";
import type { ActivityInput } from "@/lib/validation";
import { adminFetch } from "@/lib/admin-client";
import ActivityForm from "@/components/admin/ActivityForm";
import ConfirmModal from "@/components/admin/ConfirmModal";
import Toast, { type ToastMessage } from "@/components/admin/Toast";
import { useDragReorder } from "@/components/admin/useDragReorder";
import { PlusIcon } from "@/components/admin/admin-icons";

export default function ActivityManager({
  activities,
}: {
  activities: ActivityDTO[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<ActivityDTO | "new" | null>(null);
  const [deleting, setDeleting] = useState<ActivityDTO | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const { list, rowProps } = useDragReorder(activities, "activities", setToast);

  async function handleSave(input: ActivityInput) {
    setBusy(true);
    const isNew = editing === "new";
    const result = isNew
      ? await adminFetch("/api/admin/activities", {
          method: "POST",
          body: JSON.stringify(input),
        })
      : await adminFetch(
          `/api/admin/activities/${(editing as ActivityDTO)._id}`,
          { method: "PUT", body: JSON.stringify(input) }
        );
    setBusy(false);
    if (!result.ok) {
      setToast({ type: "danger", text: result.error });
      return;
    }
    setToast({
      type: "success",
      text: isNew ? "Activity created." : "Activity updated.",
    });
    setEditing(null);
    router.refresh();
  }

  async function handleDelete() {
    if (!deleting) return;
    setBusy(true);
    const result = await adminFetch(`/api/admin/activities/${deleting._id}`, {
      method: "DELETE",
    });
    setBusy(false);
    if (!result.ok) {
      setToast({ type: "danger", text: result.error });
      return;
    }
    setToast({ type: "success", text: "Activity deleted." });
    setDeleting(null);
    router.refresh();
  }

  if (editing) {
    return (
      <>
        <header className="admin-page-header">
          <span className="admin-eyebrow">Activities</span>
          <h1 className="admin-page-title">
            {editing === "new" ? "Add activity" : `Edit: ${editing.title}`}
          </h1>
        </header>
        <ActivityForm
          initial={editing === "new" ? null : editing}
          busy={busy}
          onSubmit={handleSave}
          onCancel={() => setEditing(null)}
        />
        <Toast message={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  return (
    <>
      <header className="admin-page-header with-action">
        <div>
          <span className="admin-eyebrow">Content</span>
          <h1 className="admin-page-title">Activities</h1>
          <p className="admin-page-lead">
            {activities.length} entr{activities.length === 1 ? "y" : "ies"} —
            leadership &amp; extracurriculars. Drag rows to reorder.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary d-inline-flex align-items-center gap-2"
          onClick={() => setEditing("new")}
        >
          <PlusIcon size={16} /> Add activity
        </button>
      </header>

      <div className="admin-table-wrap">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col" aria-label="Drag to reorder" />
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col" className="text-end">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((entry, index) => (
              <tr key={entry._id} {...rowProps(index)}>
                <td className="drag-handle" title="Drag to reorder">
                  ⠿
                </td>
                <td>{index + 1}</td>
                <td className="fw-semibold">{entry.title}</td>
                <td className="text-end">
                  <div className="btn-group btn-group-sm">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => setEditing(entry)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => setDeleting(entry)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-secondary py-4">
                  No activities yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        show={deleting !== null}
        title="Delete activity?"
        body={`"${deleting?.title}" will be removed permanently. This cannot be undone.`}
        busy={busy}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
      <Toast message={toast} onClose={() => setToast(null)} />
    </>
  );
}
