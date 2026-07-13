"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { adminFetch } from "@/lib/admin-client";
import type { ToastMessage } from "@/components/admin/Toast";

type ReorderType =
  | "projects"
  | "experience"
  | "education"
  | "activities"
  | "certificates"
  | "tech";

/**
 * HTML5 drag-and-drop row reordering for the admin tables. Reorders the
 * local list live while dragging, then persists once on drag end via
 * /api/admin/reorder. Touch devices can still use the numeric sortOrder
 * field in the edit forms.
 */
export function useDragReorder<T extends { _id: string }>(
  items: T[],
  type: ReorderType,
  notify: (toast: ToastMessage) => void
) {
  const router = useRouter();
  const [list, setList] = useState<T[]>(items);
  const [saving, setSaving] = useState(false);
  const dragIndex = useRef<number | null>(null);
  const dirty = useRef(false);

  // Server refresh delivers the canonical order — resync local state.
  useEffect(() => {
    setList(items);
  }, [items]);

  async function commit(ordered: T[]) {
    setSaving(true);
    const result = await adminFetch("/api/admin/reorder", {
      method: "POST",
      body: JSON.stringify({ type, ids: ordered.map((item) => item._id) }),
    });
    setSaving(false);
    if (!result.ok) {
      notify({ type: "danger", text: result.error });
      setList(items); // roll back optimistic order
      return;
    }
    notify({ type: "success", text: "Order saved." });
    router.refresh();
  }

  function rowProps(index: number) {
    return {
      draggable: true,
      onDragStart: (event: React.DragEvent) => {
        dragIndex.current = index;
        dirty.current = false;
        event.dataTransfer.effectAllowed = "move";
      },
      onDragEnter: () => {
        const from = dragIndex.current;
        if (from === null || from === index) return;
        setList((current) => {
          const next = [...current];
          const [moved] = next.splice(from, 1);
          next.splice(index, 0, moved);
          return next;
        });
        dragIndex.current = index;
        dirty.current = true;
      },
      onDragOver: (event: React.DragEvent) => event.preventDefault(),
      onDragEnd: () => {
        const wasDirty = dirty.current;
        dragIndex.current = null;
        dirty.current = false;
        if (wasDirty) {
          setList((current) => {
            commit(current);
            return current;
          });
        }
      },
    };
  }

  return { list, saving, rowProps };
}
