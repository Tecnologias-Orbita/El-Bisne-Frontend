import {
  BurgerToXIcon,
  IComponent,
  MobileMenu,
} from "@tecnologias-orbita/orbita-ui-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { TertiaryButton } from "../ui";

interface Props extends IComponent {
  items: {
    text: React.ReactNode;
    href: string;
    active?: boolean;
  }[];
}

export default function MobileNavMenu({ items, className, ...props }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className={className} {...props}>
      <TertiaryButton
        className={twMerge(
          "z-20000 p-2 rounded-full flex items-center gap-2 w-max bg-linear-to-b from-green-600 from-50% to-green-400 text-white opacity-100 hover:contrast-110 hover:brightness-90 shadow-lg",
          open ? "fixed top-3 right-4" : "relative",
        )}
        onClick={() => setOpen((p) => !p)}
      >
        <BurgerToXIcon active={open} className="size-6" />
      </TertiaryButton>
      <MobileMenu.Container className="z-10000 pt-12" visible={open}>
        {!!items.length && (
          <MobileMenu.List>
            {items.map((i, ix) => (
              <MobileMenu.Item
                key={ix}
                href={i.href}
                className={twMerge(
                  "border-b border-green-500",
                  i.active && "bg-black/5",
                )}
              >
                {i.text}
              </MobileMenu.Item>
            ))}
          </MobileMenu.List>
        )}
      </MobileMenu.Container>
    </div>
  );
}
