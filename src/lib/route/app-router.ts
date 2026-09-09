export enum APP_ROUTER {
  HOME = "/",
  LOGIN = "/login",
  WELCOME = "/welcome",
  BISNE_NEW = "/bisne/new",
}

interface Props {
  path?: string;
  query?: Record<string, string>;
}

export function mutateRoute(base: APP_ROUTER, { path, query }: Props) {
  return `${base}${path ? "/".concat(path.replace(/^\//, "")) : ""}${query ? `?${new URLSearchParams(query).toString()}` : ""}`;
}
