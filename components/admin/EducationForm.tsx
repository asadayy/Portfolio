"use client";

import { useState } from "react";

import type { EducationDTO } from "@/lib/serialize";
import type { EducationInput } from "@/lib/validation";
import MarkdownField from "@/components/admin/MarkdownField";

function toDateInput(iso: string | null | undefined): string {
  return iso ? iso.slice(0, 10) : "";
}

interface EducationFormProps {
  initial: EducationDTO | null;
  busy: boolean;
  onSubmit: (input: EducationInput) => void;
  onCancel: () => void;
}

export default function EducationForm({
  initial,
  busy,
  onSubmit,
  onCancel,
}: EducationFormProps) {
  const [degree, setDegree] = useState(initial?.degree ?? "");
  const [institution, setInstitution] = useState(initial?.institution ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [startDate, setStartDate] = useState(toDateInput(initial?.startDate));
  const [endDate, setEndDate] = useState(toDateInput(initial?.endDate));
  const [current, setCurrent] = useState(
    initial ? initial.endDate === null : false
  );
  const [grade, setGrade] = useState(initial?.grade ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);

  const canSubmit =
    degree.trim() &&
    institution.trim() &&
    startDate &&
    (current || endDate) &&
    !busy;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      degree: degree.trim(),
      institution: institution.trim(),
      location: location.trim(),
      startDate,
      endDate: current ? null : endDate,
      grade: grade.trim(),
      description: description.trim(),
      sortOrder,
    });
  }

  return (
    <form className="admin-editor" onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="edu-degree" className="form-label">
            Degree / qualification *
          </label>
          <input
            id="edu-degree"
            type="text"
            className="form-control"
            maxLength={160}
            required
            placeholder="B.Sc. Software Engineering"
            value={degree}
            onChange={(event) => setDegree(event.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="edu-institution" className="form-label">
            Institution *
          </label>
          <input
            id="edu-institution"
            type="text"
            className="form-control"
            maxLength={200}
            required
            value={institution}
            onChange={(event) => setInstitution(event.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="edu-location" className="form-label">
            Location
          </label>
          <input
            id="edu-location"
            type="text"
            className="form-control"
            maxLength={120}
            placeholder="City, Country"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="edu-grade" className="form-label">
            Grade
          </label>
          <input
            id="edu-grade"
            type="text"
            className="form-control"
            maxLength={120}
            placeholder="CGPA: 3.2 / 4.00"
            value={grade}
            onChange={(event) => setGrade(event.target.value)}
          />
        </div>
        <div className="col-md-3 col-6">
          <label htmlFor="edu-start" className="form-label">
            Start date *
          </label>
          <input
            id="edu-start"
            type="date"
            className="form-control"
            required
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </div>
        <div className="col-md-3 col-6">
          <label htmlFor="edu-end" className="form-label">
            End date {current ? "(current)" : "*"}
          </label>
          <input
            id="edu-end"
            type="date"
            className="form-control"
            value={endDate}
            min={startDate || undefined}
            disabled={current}
            onChange={(event) => setEndDate(event.target.value)}
          />
          <div className="form-check mt-2">
            <input
              id="edu-current"
              type="checkbox"
              className="form-check-input"
              checked={current}
              onChange={(event) => setCurrent(event.target.checked)}
            />
            <label htmlFor="edu-current" className="form-check-label">
              Currently studying (&quot;Present&quot;)
            </label>
          </div>
        </div>
        <div className="col-12">
          <MarkdownField
            id="edu-description"
            label="Details (optional, markdown)"
            rows={5}
            placeholder={"- Relevant coursework, honours, or focus areas"}
            value={description}
            onChange={setDescription}
          />
        </div>
        <div className="col-md-3 col-6">
          <label htmlFor="edu-sort" className="form-label">
            Sort order
          </label>
          <input
            id="edu-sort"
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
