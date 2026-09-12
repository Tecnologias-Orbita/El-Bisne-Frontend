import type { IComponent } from "@tecnologias-orbita/orbita-ui-react";
import { twMerge } from "tailwind-merge";
import { TertiaryButton } from "../buttons/Buttons";

interface Props extends IComponent {
  items: {
    text: React.ReactNode;
    href: string;
    active?: boolean;
  }[];
  onChange?: (index: number) => void;
}

export default function HorizontalLinksList({
  items,
  className,
  onChange,
}: Props) {
  return (
    !!items.length && (
      <ul
        className={twMerge(
          "grid grid-flow-col bg-white border border-green-700/25 rounded-full text-green-700 w-max p-1",
          className,
        )}
      >
        {items.map((i, index) => (
          <li key={i.href} onClick={() => onChange?.(index)}>
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
