"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { ProjectDTO } from "@/lib/serialize";
import type { ProjectInput } from "@/lib/validation";
import { adminFetch } from "@/lib/admin-client";
import ProjectForm from "@/components/admin/ProjectForm";
import ConfirmModal from "@/components/admin/ConfirmModal";
import Toast, { type ToastMessage } from "@/components/admin/Toast";
import { useDragReorder } from "@/components/admin/useDragReorder";
import { PlusIcon } from "@/components/admin/admin-icons";

export default function ProjectsManager({
  projects,
}: {
  projects: ProjectDTO[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<ProjectDTO | "new" | null>(null);
  const [deleting, setDeleting] = useState<ProjectDTO | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const { list, rowProps } = useDragReorder(projects, "projects", setToast);

  async function handleSave(input: ProjectInput) {
    setBusy(true);
    const isNew = editing === "new";
    const result = isNew
      ? await adminFetch("/api/admin/projects", {
          method: "POST",
          body: JSON.stringify(input),
        })
      : await adminFetch(
          `/api/admin/projects/${(editing as ProjectDTO)._id}`,
          { method: "PUT", body: JSON.stringify(input) }
        );
    setBusy(false);
    if (!result.ok) {
      setToast({ type: "danger", text: result.error });
      return;
    }
    setToast({
      type: "success",
      text: isNew ? "Project created." : "Project updated.",
    });
    setEditing(null);
    router.refresh();
  }

  async function handleDelete() {
    if (!deleting) return;
    setBusy(true);
    const result = await adminFetch(`/api/admin/projects/${deleting._id}`, {
      method: "DELETE",
    });
    setBusy(false);
    if (!result.ok) {
      setToast({ type: "danger", text: result.error });
      return;
    }
    setToast({ type: "success", text: `"${deleting.title}" deleted.` });
    setDeleting(null);
    router.refresh();
  }

  if (editing) {
    return (
      <>
        <header className="admin-page-header">
          <span className="admin-eyebrow">Projects</span>
          <h1 className="admin-page-title">
            {editing === "new" ? "Add project" : `Edit: ${editing.title}`}
          </h1>
        </header>
        <ProjectForm
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
          <h1 className="admin-page-title">Projects</h1>
          <p className="admin-page-lead">
            {projects.length} project{projects.length === 1 ? "" : "s"} — drag
            rows to reorder how they appear on /projects.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary d-inline-flex align-items-center gap-2"
          onClick={() => setEditing("new")}
        >
          <PlusIcon size={16} /> Add project
        </button>
      </header>

      <div className="admin-table-wrap">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col" aria-label="Drag to reorder" />
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Slug</th>
              <th scope="col">Status</th>
              <th scope="col">Featured</th>
              <th scope="col">Updated</th>
              <th scope="col" className="text-end">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((project, index) => (
              <tr key={project._id} {...rowProps(index)}>
                <td className="drag-handle" title="Drag to reorder">
                  ⠿
                </td>
                <td>{index + 1}</td>
                <td className="fw-semibold">{project.title}</td>
                <td>
                  <code>{project.slug}</code>
                </td>
                <td>
                  {project.published !== false ? (
                    <span className="badge text-bg-success">Published</span>
                  ) : (
                    <span className="badge text-bg-secondary">Draft</span>
                  )}
                </td>
                <td>
                  {project.featured ? (
                    <span className="badge text-bg-primary">Featured</span>
                  ) : (
                    <span className="text-secondary">—</span>
                  )}
                </td>
                <td className="text-secondary">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </td>
                <td className="text-end">
                  <div className="btn-group btn-group-sm">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => setEditing(project)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => setDeleting(project)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-secondary py-4">
                  No projects yet — add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        show={deleting !== null}
        title="Delete project?"
        body={`"${deleting?.title}" will be removed from the site permanently. This cannot be undone.`}
        busy={busy}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
      <Toast message={toast} onClose={() => setToast(null)} />
    </>
  );
}
