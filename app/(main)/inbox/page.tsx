"use client";

import { useSidebarAdjustment } from "@/hooks/use-sidebar-adjustment";

export default function Inbox() {
  const sidebarAdjustment = useSidebarAdjustment();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center transition-all duration-300"
      style={{
        marginLeft: sidebarAdjustment,
      }}
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Inbox</h1>
        <p>This is the inbox page.</p>
      </div>
    </div>
  );
}
