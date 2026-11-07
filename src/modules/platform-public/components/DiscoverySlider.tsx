"use client";

import { TertiaryButton } from "@/shared/ui";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";

export function DiscoverySlider({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canMovePrevious, setCanMovePrevious] = useState(false);
  const [canMoveNext, setCanMoveNext] = useState(false);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    function updateControls() {
      const maxScrollLeft = Math.max(
        slider!.scrollWidth - slider!.clientWidth,
        0,
      );
      setCanMovePrevious(slider!.scrollLeft > 2);
      setCanMoveNext(slider!.scrollLeft < maxScrollLeft - 2);
    }

    function handleWheel(event: WheelEvent) {
      const horizontalDelta =
        event.shiftKey && event.deltaX === 0 ? event.deltaY : event.deltaX;
      if (Math.abs(horizontalDelta) < 0.5) return;
      event.preventDefault();
      event.stopPropagation();
      const unit =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? slider!.clientWidth
            : 1;
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
    slider.scrollBy({
      left: direction * Math.max(slider.clientWidth * 0.8, 280),
      behavior: "smooth",
    });
  }

  return (
    <div className="relative w-full max-w-full min-w-0 overscroll-x-contain">
      <div className="absolute h-4 w-full bottom-0 left-0" />
      <div
        aria-label={label}
        className="flex w-full gap-2 overflow-x-scroll overflow-y-hidden overscroll-x-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent px-8 pt-2 pb-8"
        ref={sliderRef}
        role="region"
      >
        {children}
      </div>
      {canMovePrevious ? (
        <TertiaryButton
          aria-label={`Ver anteriores en ${label}`}
          className="absolute top-1/2 left-4 z-20 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-cream-100 bg-white text-green-700 shadow-lg transition-color duration-200 ease-in-out hover:bg-green-600 hover:text-white"
          onClick={() => move(-1)}
          type="button"
        >
          <ChevronLeftIcon
            aria-hidden="true"
            className="size-[1.35rem]"
            strokeWidth={2.25}
          />
        </TertiaryButton>
      ) : null}
      {canMoveNext ? (
        <TertiaryButton
          aria-label={`Ver siguientes en ${label}`}
          className="absolute top-1/2 right-4 z-20 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-cream-100 bg-white text-green-700 shadow-lg transition-color duration-200 ease-in-out hover:bg-green-600 hover:text-white"
          onClick={() => move(1)}
          type="button"
        >
          <ChevronRightIcon
            aria-hidden="true"
            className="size-[1.35rem]"
            strokeWidth={2.25}
          />
        </TertiaryButton>
      ) : null}
    </div>
  );
}
