"use client";

import { useEffect } from "react";

interface ConfirmModalProps {
  show: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Controlled Bootstrap-styled confirmation dialog (no Bootstrap JS).
 * Used for destructive actions — delete always routes through this.
 */
export default function ConfirmModal({
  show,
  title,
  body,
  confirmLabel = "Delete",
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!show) return undefined;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [show, onCancel]);

  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show d-block"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5" id="confirm-modal-title">
                {title}
              </h2>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onCancel}
                disabled={busy}
              />
            </div>
            <div className="modal-body">
              <p className="mb-0">{body}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onCancel}
                disabled={busy}
                autoFocus
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirm}
                disabled={busy}
              >
                {busy ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      aria-hidden
                    />
                    Working…
                  </>
                ) : (
                  confirmLabel
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}
