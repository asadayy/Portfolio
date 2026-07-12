"use client";

import { useState } from "react";

import type { ProjectDTO } from "@/lib/serialize";
import type { ProjectInput } from "@/lib/validation";
import ImageUploadField from "@/components/admin/ImageUploadField";
import MarkdownField from "@/components/admin/MarkdownField";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface ProjectFormProps {
  initial: ProjectDTO | null;
  busy: boolean;
  onSubmit: (input: ProjectInput) => void;
  onCancel: () => void;
}

export default function ProjectForm({
  initial,
  busy,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [shortDescription, setShortDescription] = useState(
    initial?.shortDescription ?? ""
  );
  const [longDescription, setLongDescription] = useState(
    initial?.longDescription ?? ""
  );
  const [techStack, setTechStack] = useState(
    (initial?.techStack ?? []).join(", ")
  );
  const [liveUrl, setLiveUrl] = useState(initial?.liveUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(initial?.githubUrl ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [published, setPublished] = useState(initial?.published ?? true);
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);

  const canSubmit =
    title.trim() &&
    slug.trim() &&
    shortDescription.trim() &&
    longDescription.trim() &&
    !busy;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      title: title.trim(),
      slug: slug.trim(),
      shortDescription: shortDescription.trim(),
      longDescription: longDescription.trim(),
      techStack: techStack
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean),
      liveUrl: liveUrl.trim(),
      githubUrl: githubUrl.trim(),
      imageUrl,
      featured,
      published,
      sortOrder,
    });
  }

  return (
    <form className="admin-editor" onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="project-title" className="form-label">
            Title *
          </label>
          <input
            id="project-title"
            type="text"
            className="form-control"
            maxLength={120}
            required
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (!slugTouched) setSlug(slugify(event.target.value));
            }}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="project-slug" className="form-label">
            Slug *
          </label>
          <input
            id="project-slug"
            type="text"
            className="form-control"
            required
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(slugify(event.target.value));
            }}
            aria-describedby="project-slug-help"
          />
          <div id="project-slug-help" className="form-text">
            URL: /projects/{slug || "…"}
          </div>
        </div>
        <div className="col-12">
          <label htmlFor="project-short" className="form-label">
            Short description * ({shortDescription.length}/300)
          </label>
          <textarea
            id="project-short"
            className="form-control"
            rows={2}
            maxLength={300}
            required
            value={shortDescription}
            onChange={(event) => setShortDescription(event.target.value)}
          />
        </div>
        <div className="col-12">
          <MarkdownField
            id="project-long"
            label="Long description * (markdown)"
            rows={12}
            required
            value={longDescription}
            onChange={setLongDescription}
            help="Markdown supported: headings, lists, bold, links, tables."
          />
        </div>
        <div className="col-12">
          <label htmlFor="project-tech" className="form-label">
            Tech stack (comma-separated)
          </label>
          <input
            id="project-tech"
            type="text"
            className="form-control"
            placeholder="React, Node.js, MongoDB"
            value={techStack}
            onChange={(event) => setTechStack(event.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="project-live" className="form-label">
            Live URL
          </label>
          <input
            id="project-live"
            type="url"
            className="form-control"
            placeholder="https://…"
            value={liveUrl}
            onChange={(event) => setLiveUrl(event.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="project-github" className="form-label">
            GitHub URL
          </label>
          <input
            id="project-github"
            type="url"
            className="form-control"
            placeholder="https://github.com/…"
            value={githubUrl}
            onChange={(event) => setGithubUrl(event.target.value)}
          />
        </div>
        <div className="col-12">
          <ImageUploadField
            id="project-image"
            label="Project image"
            value={imageUrl}
            onChange={setImageUrl}
          />
        </div>
        <div className="col-md-3 col-6">
          <label htmlFor="project-sort" className="form-label">
            Sort order
          </label>
          <input
            id="project-sort"
            type="number"
            className="form-control"
            min={0}
            value={sortOrder}
            onChange={(event) => setSortOrder(Number(event.target.value))}
          />
        </div>
        <div className="col-md-3 col-6 d-flex align-items-end">
          <div className="form-check form-switch mb-2">
            <input
              id="project-featured"
              type="checkbox"
              className="form-check-input"
              role="switch"
              checked={featured}
              onChange={(event) => setFeatured(event.target.checked)}
            />
            <label htmlFor="project-featured" className="form-check-label">
              Featured on homepage
            </label>
          </div>
        </div>
        <div className="col-md-3 col-6 d-flex align-items-end">
          <div className="form-check form-switch mb-2">
            <input
              id="project-published"
              type="checkbox"
              className="form-check-input"
              role="switch"
              checked={published}
              onChange={(event) => setPublished(event.target.checked)}
            />
            <label htmlFor="project-published" className="form-check-label">
              Published{!published && " (draft — hidden from site)"}
            </label>
          </div>
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
            "Save project"
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
