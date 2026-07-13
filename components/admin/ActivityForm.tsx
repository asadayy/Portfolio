"use client";

import { useState } from "react";

import type { ActivityDTO } from "@/lib/serialize";
import type { ActivityInput } from "@/lib/validation";
import MarkdownField from "@/components/admin/MarkdownField";

interface ActivityFormProps {
  initial: ActivityDTO | null;
  busy: boolean;
  onSubmit: (input: ActivityInput) => void;
  onCancel: () => void;
}

export default function ActivityForm({
  initial,
  busy,
  onSubmit,
  onCancel,
}: ActivityFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);

  const canSubmit = title.trim() && description.trim() && !busy;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      sortOrder,
    });
  }

  return (
    <form className="admin-editor" onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        <div className="col-md-9">
          <label htmlFor="act-title" className="form-label">
            Title *
          </label>
          <input
            id="act-title"
            type="text"
            className="form-control"
            maxLength={120}
            required
            placeholder="Athletics, Event Coordination, Public Speaking…"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div className="col-md-3 col-6">
          <label htmlFor="act-sort" className="form-label">
            Sort order
          </label>
          <input
            id="act-sort"
            type="number"
            className="form-control"
            min={0}
            value={sortOrder}
            onChange={(event) => setSortOrder(Number(event.target.value))}
          />
        </div>
        <div className="col-12">
          <MarkdownField
            id="act-description"
            label="Description * (markdown)"
            rows={6}
            required
            placeholder={"Describe the role, achievement, or involvement."}
            value={description}
            onChange={setDescription}
          />
        </div>
      </div>

      <div className="d-flex gap-2 mt-4">
        <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
          {busy ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                aria-hidden
              />
              Saving…
            </>
          ) : (
            "Save entry"
          )}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
          disabled={busy}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
