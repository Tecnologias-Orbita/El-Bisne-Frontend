"use client";

import { Btn } from "@tecnologias-orbita/orbita-ui-react";
import { twMerge } from "tailwind-merge";

export const SecondaryButton: typeof Btn = ({
  children,
  className,
  ...props
}) => {
  return (
    <Btn
      className={twMerge(
        "rounded-lg border-green bg-green/5 text-green hover:bg-green/10",
        (className as string) || "",
      )}
      {...props}
    >
      {children}
    </Btn>
  );
};
