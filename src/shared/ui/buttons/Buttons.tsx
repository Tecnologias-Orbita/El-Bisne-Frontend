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
        "rounded-lg border-none bg-green-500 text-white hover:brightness-90 hover:contrast-125 hover:bg-green-500",
        (className as string) || "",
      )}
      {...props}
    >
      {children}
    </Btn>
  );
};

export const SecondaryButton: typeof Btn = ({
  children,
  className,
  ...props
}) => {
  return (
    <Btn
      className={twMerge(
        "rounded-lg border-green-500/25 text-green-600 hover:border-green-500/75 hover:bg-white",
        (className as string) || "",
      )}
      {...props}
    >
      {children}
    </Btn>
  );
};
