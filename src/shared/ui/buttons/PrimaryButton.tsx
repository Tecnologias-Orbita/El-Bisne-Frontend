"use client";

import { Btn } from "@tecnologias-orbita/orbita-ui-react";
import { twMerge } from "tailwind-merge";

export const PrimaryButton: typeof Btn = ({
  children,
  className,
  ...props
}) => {
  return (
    <Btn
      className={twMerge(
        "rounded-lg border-none bg-green text-white hover:brightness-90 hover:bg-green",
        (className as string) || "",
      )}
      {...props}
    >
      {children}
    </Btn>
  );
};
