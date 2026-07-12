"use client";

import { useEffect } from "react";

export interface ToastMessage {
  type: "success" | "danger";
  text: string;
}

interface ToastProps {
  message: ToastMessage | null;
  onClose: () => void;
}

/** Fixed bottom-right toast; auto-dismisses successes, errors stay longer. */
export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    if (!message) return undefined;
    const timeout = setTimeout(
      onClose,
      message.type === "success" ? 3500 : 7000
    );
    return () => clearTimeout(timeout);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="admin-toast-region" aria-live="polite">
      <div
        className={`toast show text-bg-${message.type} border-0`}
        role="status"
      >
        <div className="d-flex">
          <div className="toast-body">{message.text}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            aria-label="Dismiss notification"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}
