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
        "flex rounded-lg border-none bg-green-500 text-white hover:brightness-90 hover:contrast-125 hover:bg-green-500",
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
        "flex rounded-lg border-green-500/25 text-green-600 hover:border-green-500/75 hover:bg-white",
        (className as string) || "",
      )}
      {...props}
    >
      {children}
    </Btn>
  );
};

export const TertiaryButton: typeof Btn = ({
  children,
  className,
  ...props
}) => {
  return (
    <Btn
      className={twMerge(
        "flex rounded-lg text-green-700 opacity-75 hover:opacity-100 bg-none border-none active:scale-[unset] hover:bg-[none_!important] hover:brightness-100",
        (className as string) || "",
      )}
      {...props}
    >
      {children}
    </Btn>
  );
};
