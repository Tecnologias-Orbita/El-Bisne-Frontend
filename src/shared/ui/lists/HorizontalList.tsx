import type { IComponent } from "@tecnologias-orbita/orbita-ui-react";
import { twMerge } from "tailwind-merge";
import { TertiaryButton } from "../buttons/Buttons";
import type { HorizontalListItem } from "./HorizontalList.types";

interface LinksProps extends IComponent {
  items: HorizontalListItem[];
}

export function HorizontalLinksList({ items, className }: LinksProps) {
  return (
    !!items.length && (
      <ul
        className={twMerge(
          "grid grid-flow-col bg-white border border-green-700/25 rounded-full text-green-700 w-max p-1",
          className,
        )}
      >
        {items.map((i) => (
          <li key={i.href}>
            <TertiaryButton
              link
              href={i.href}
              className={twMerge(
                "px-4 py-2 rounded-full flex items-center gap-2 w-max",
                i.active &&
                  "bg-linear-to-b from-green-600 from-50% to-green-400 text-white opacity-100 hover:contrast-110 hover:brightness-90",
              )}
            >
              {i.text}
            </TertiaryButton>
          </li>
        ))}
      </ul>
    )
  );
}

interface RatioProps extends IComponent {
  items: HorizontalListItem[];
  onChange: (index: number) => void;
}

export function HorizontalRatioList({
  items,
  className,
  onChange,
}: RatioProps) {
  return (
    !!items.length && (
      <ul
        className={twMerge(
          "grid grid-flow-col bg-white border border-green-700/25 rounded-full text-green-700 w-max p-1",
          className,
        )}
      >
        {items.map((i, index) => (
          <li key={index}>
            <TertiaryButton
              onClick={() => onChange(index)}
              className={twMerge(
                "px-4 py-2 rounded-full flex items-center gap-2 w-max",
                i.active &&
                  "bg-linear-to-b from-green-600 from-50% to-green-400 text-white opacity-100 hover:contrast-110 hover:brightness-90",
              )}
            >
              {i.text}
            </TertiaryButton>
          </li>
        ))}
      </ul>
    )
  );
}
