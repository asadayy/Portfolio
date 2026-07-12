"use client";

import { useState } from "react";

import Markdown from "@/components/Markdown";

interface MarkdownFieldProps {
  id: string;
  label: string;
  value: string;
  rows?: number;
  required?: boolean;
  placeholder?: string;
  help?: string;
  onChange: (value: string) => void;
}

/**
 * Markdown textarea with a live preview toggle. Preview renders through the
 * same Markdown component the public site uses, so what you see is what
 * ships.
 */
export default function MarkdownField({
  id,
  label,
  value,
  rows = 10,
  required = false,
  placeholder,
  help,
  onChange,
}: MarkdownFieldProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-1">
        <label htmlFor={id} className="form-label mb-0">
          {label}
        </label>
        <div
          className="btn-group btn-group-sm"
          role="group"
          aria-label="Editor mode"
        >
          <button
            type="button"
            className={`btn ${showPreview ? "btn-outline-primary" : "btn-primary"}`}
            aria-pressed={!showPreview}
            onClick={() => setShowPreview(false)}
          >
            Write
          </button>
          <button
            type="button"
            className={`btn ${showPreview ? "btn-primary" : "btn-outline-primary"}`}
            aria-pressed={showPreview}
            onClick={() => setShowPreview(true)}
          >
            Preview
          </button>
        </div>
      </div>

      <div className="row g-3">
        <div className={showPreview ? "col-lg-6" : "col-12"}>
          <textarea
            id={id}
            className="form-control"
            rows={rows}
            required={required}
            placeholder={placeholder}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-describedby={help ? `${id}-help` : undefined}
          />
        </div>
        {showPreview && (
          <div className="col-lg-6">
            <div
              className="markdown-preview"
              aria-label="Markdown preview"
              style={{ minHeight: `${rows * 1.75}rem` }}
            >
              {value.trim() ? (
                <Markdown>{value}</Markdown>
              ) : (
                <p className="text-secondary mb-0">Nothing to preview yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
      {help && (
        <div id={`${id}-help`} className="form-text">
          {help}
        </div>
      )}
    </div>
  );
}
