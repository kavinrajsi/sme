"use client";

export default function OpenDemoButton({ className, children }) {
  return (
    <button
      className={className}
      onClick={() => window.dispatchEvent(new Event("open-demo-modal"))}
    >
      {children}
    </button>
  );
}
