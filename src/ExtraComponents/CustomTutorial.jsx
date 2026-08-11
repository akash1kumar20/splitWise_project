// src/ExtraComponents/CustomTutorial.jsx
// Zero-dependency tutorial engine — works with Vite 8, no library needed.
// Spotlight effect via box-shadow trick. Mobile-friendly positioning.

import { useState, useEffect, useCallback } from "react";

const PADDING = 6;

const getTooltipStyle = (rect, tooltipW = 300) => {
  if (!rect) {
    return {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
  }

  const viewW = window.innerWidth;
  const viewH = window.innerHeight;
  const tooltipH = 220;
  const gap = 14;

  // Prefer below target, fall back to above
  let top =
    rect.bottom + gap + tooltipH < viewH
      ? rect.bottom + gap
      : rect.top - tooltipH - gap;

  // Center horizontally relative to target
  let left = rect.left + rect.width / 2 - tooltipW / 2;
  left = Math.max(12, Math.min(left, viewW - tooltipW - 12));
  top = Math.max(12, top);

  return { position: "fixed", top, left, width: tooltipW };
};

const CustomTutorial = ({ steps, storageKey, delay = 900 }) => {
  const [idx, setIdx]         = useState(0);
  const [run, setRun]         = useState(false);
  const [rect, setRect]       = useState(null);
  const [, forceUpdate]       = useState(0);

  useEffect(() => {
    if (!localStorage.getItem(storageKey)) {
      const t = setTimeout(() => setRun(true), delay);
      return () => clearTimeout(t);
    }
  }, [storageKey, delay]);

  const measureTarget = useCallback(() => {
    const step = steps[idx];
    if (!step) return;
    if (!step.target || step.target === "body") {
      setRect(null);
      return;
    }
    const el = document.querySelector(step.target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // Wait for scroll then measure
      setTimeout(() => {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      }, 350);
    } else {
      setRect(null);
    }
  }, [idx, steps]);

  useEffect(() => {
    if (run) measureTarget();
  }, [run, measureTarget]);

  // Re-measure on resize
  useEffect(() => {
    if (!run) return;
    const handler = () => { measureTarget(); forceUpdate((n) => n + 1); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [run, measureTarget]);

  if (!run) return null;

  const step  = steps[idx];
  const total = steps.length;
  const isLast  = idx === total - 1;
  const isFirst = idx === 0;

  const finish = () => {
    localStorage.setItem(storageKey, "1");
    setRun(false);
  };

  const next = () => { setRect(null); setIdx((i) => i + 1); };
  const back = () => { setRect(null); setIdx((i) => i - 1); };

  return (
    <>
      {/* Dark overlay */}
      <div
        className="fixed inset-0 z-[9000]"
        style={{ background: "rgba(0,0,0,0.55)", pointerEvents: "none" }}
      />

      {/* Spotlight cutout via inverted box-shadow */}
      {rect && (
        <div
          className="fixed z-[9001] rounded-xl"
          style={{
            top:    rect.top    - PADDING,
            left:   rect.left   - PADDING,
            width:  rect.width  + PADDING * 2,
            height: rect.height + PADDING * 2,
            boxShadow:   "0 0 0 9999px rgba(0,0,0,0.55)",
            border: "2.5px solid #3b82f6",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="z-[9002] bg-white rounded-2xl shadow-2xl p-5"
        style={getTooltipStyle(rect)}
      >
        {/* Progress dots */}
        <div className="flex gap-1 mb-3">
          {steps.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === idx ? 20 : 8,
                background: i === idx ? "#3b82f6" : "#e5e7eb",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-sm text-gray-700 leading-relaxed">
          {step.content}
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={finish}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Skip tour
          </button>
          <div className="flex gap-2">
            {!isFirst && (
              <button
                onClick={back}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                ← Back
              </button>
            )}
            {isLast ? (
              <button
                onClick={finish}
                className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg font-semibold transition-colors"
              >
                Done ✓
              </button>
            ) : (
              <button
                onClick={next}
                className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg font-semibold transition-colors"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomTutorial;
