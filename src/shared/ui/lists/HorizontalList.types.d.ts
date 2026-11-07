import type React from "react";

export type HorizontalListItem = {
  text: React.ReactNode;
  href?: string;
  slug?: string;
  active?: boolean;
};
