"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

export function DiscoverySlider({ children, label }: { children: ReactNode; label: string }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canMovePrevious, setCanMovePrevious] = useState(false);
  const [canMoveNext, setCanMoveNext] = useState(false);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    function updateControls() {
      const maxScrollLeft = Math.max(slider!.scrollWidth - slider!.clientWidth, 0);
      setCanMovePrevious(slider!.scrollLeft > 2);
      setCanMoveNext(slider!.scrollLeft < maxScrollLeft - 2);
    }

    function handleWheel(event: WheelEvent) {
      const horizontalDelta = event.shiftKey && event.deltaX === 0 ? event.deltaY : event.deltaX;
      if (Math.abs(horizontalDelta) < 0.5) return;
      event.preventDefault();
      event.stopPropagation();
      const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? slider!.clientWidth : 1;
      slider!.scrollLeft += horizontalDelta * unit;
    }

    updateControls();
    slider.addEventListener("wheel", handleWheel, { passive: false });
    slider.addEventListener("scroll", updateControls, { passive: true });
    const resizeObserver = new ResizeObserver(updateControls);
    resizeObserver.observe(slider);
    const mutationObserver = new MutationObserver(updateControls);
    mutationObserver.observe(slider, { childList: true });
    return () => {
      slider.removeEventListener("wheel", handleWheel);
      slider.removeEventListener("scroll", updateControls);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [children]);

  function move(direction: -1 | 1) {
    const slider = sliderRef.current;
    if (!slider) return;
    slider.scrollBy({ left: direction * Math.max(slider.clientWidth * 0.8, 280), behavior: "smooth" });
  }

  return (
    <div className="discovery-slider-shell">
      <div
        aria-label={label}
        className="discovery-slider"
        ref={sliderRef}
        role="region"
      >
        {children}
      </div>
      {canMovePrevious ? <button aria-label={`Ver anteriores en ${label}`} className="discovery-slider-arrow previous" onClick={() => move(-1)} type="button"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m14.5 6-6 6 6 6" /></svg></button> : null}
      {canMoveNext ? <button aria-label={`Ver siguientes en ${label}`} className="discovery-slider-arrow next" onClick={() => move(1)} type="button"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9.5 6 6 6-6 6" /></svg></button> : null}
    </div>
  );
}
