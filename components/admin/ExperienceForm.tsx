"use client";

import { useState } from "react";

import type { ExperienceDTO } from "@/lib/serialize";
import type { ExperienceInput } from "@/lib/validation";

function toDateInput(iso: string | null | undefined): string {
  return iso ? iso.slice(0, 10) : "";
}

interface ExperienceFormProps {
  initial: ExperienceDTO | null;
  busy: boolean;
  onSubmit: (input: ExperienceInput) => void;
  onCancel: () => void;
}

export default function ExperienceForm({
  initial,
  busy,
  onSubmit,
  onCancel,
}: ExperienceFormProps) {
  const [role, setRole] = useState(initial?.role ?? "");
  const [organization, setOrganization] = useState(
    initial?.organization ?? ""
  );
  const [location, setLocation] = useState(initial?.location ?? "");
  const [startDate, setStartDate] = useState(toDateInput(initial?.startDate));
  const [endDate, setEndDate] = useState(toDateInput(initial?.endDate));
  const [current, setCurrent] = useState(
    initial ? initial.endDate === null : false
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [techUsed, setTechUsed] = useState(
    (initial?.techUsed ?? []).join(", ")
  );
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);

  const canSubmit =
    role.trim() &&
    organization.trim() &&
    location.trim() &&
    startDate &&
    (current || endDate) &&
    description.trim() &&
    !busy;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      role: role.trim(),
      organization: organization.trim(),
      location: location.trim(),
      startDate,
      endDate: current ? null : endDate,
      description: description.trim(),
      techUsed: techUsed
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean),
      sortOrder,
    });
  }

  return (
    <form className="admin-editor" onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="exp-role" className="form-label">
            Role *
          </label>
          <input
            id="exp-role"
            type="text"
            className="form-control"
            maxLength={120}
            required
            value={role}
            onChange={(event) => setRole(event.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="exp-org" className="form-label">
            Organization *
          </label>
          <input
            id="exp-org"
            type="text"
            className="form-control"
            maxLength={160}
            required
            value={organization}
            onChange={(event) => setOrganization(event.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="exp-location" className="form-label">
            Location *
          </label>
          <input
            id="exp-location"
            type="text"
            className="form-control"
            maxLength={120}
            required
            placeholder="City, Country"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
        </div>
        <div className="col-md-3 col-6">
          <label htmlFor="exp-start" className="form-label">
            Start date *
          </label>
          <input
            id="exp-start"
            type="date"
            className="form-control"
            required
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </div>
        <div className="col-md-3 col-6">
          <label htmlFor="exp-end" className="form-label">
            End date {current ? "(current)" : "*"}
          </label>
          <input
            id="exp-end"
            type="date"
            className="form-control"
            value={endDate}
            min={startDate || undefined}
            disabled={current}
            onChange={(event) => setEndDate(event.target.value)}
          />
          <div className="form-check mt-2">
            <input
              id="exp-current"
              type="checkbox"
              className="form-check-input"
              checked={current}
              onChange={(event) => setCurrent(event.target.checked)}
            />
            <label htmlFor="exp-current" className="form-check-label">
              Current role (&quot;Present&quot;)
            </label>
          </div>
        </div>
        <div className="col-12">
          <label htmlFor="exp-description" className="form-label">
            Description * (markdown — achievement-focused bullets)
          </label>
          <textarea
            id="exp-description"
            className="form-control"
            rows={8}
            required
            placeholder={"- Built X that did Y\n- Shipped Z used by N people"}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <div className="col-md-9">
          <label htmlFor="exp-tech" className="form-label">
            Tech used (comma-separated)
          </label>
          <input
            id="exp-tech"
            type="text"
            className="form-control"
            placeholder="React.js, Node.js, MSSQL"
            value={techUsed}
            onChange={(event) => setTechUsed(event.target.value)}
          />
        </div>
        <div className="col-md-3 col-6">
          <label htmlFor="exp-sort" className="form-label">
            Sort order
          </label>
          <input
            id="exp-sort"
            type="number"
            className="form-control"
            min={0}
            value={sortOrder}
            onChange={(event) => setSortOrder(Number(event.target.value))}
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
