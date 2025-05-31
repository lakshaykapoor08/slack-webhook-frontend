import { routes } from "@/routes/routes";
import type { AxiosRequestConfig } from "axios";

export function axiosToCurl(config: AxiosRequestConfig): string {
  const baseUrl = import.meta.env.VITE_BASE_URL as string;
  const method = config.method?.toUpperCase() || "GET";
  const url = baseUrl + "/" + (config.url || "");
  const headers = config.headers || {};
  const data = config.data ? JSON.stringify(config.data) : "";
  let curl = `curl -X ${method} '${url}'`;

  for (const [key, value] of Object.entries(headers)) {
    curl += ` -H '${key}: ${value}'`;
  }

  if (headers["Content-Type"] === "application/x-www-form-urlencoded" && data) {
    const formattedData = new URLSearchParams(data).toString();
    curl += ` -d '${formattedData}'`;
  } else if (["POST", "PUT", "PATCH", "DELETE"].includes(method) && data) {
    curl += ` -d '${JSON.stringify(data)}'`;
  }

  return curl;
}

interface RouteMeta {
  layoutTitle: string;
  metaTitle: string;
}

interface Route {
  root?: string;
  meta?: RouteMeta;
  [key: string]: any;
}

function matchPath(routePath: string, pathname: string): boolean {
  const routeSegments = routePath.split("/").filter(Boolean);
  const pathSegments = pathname.split("/").filter(Boolean);

  if (routeSegments.length !== pathSegments.length) {
    return false;
  }

  return routeSegments.every((segment, index) => {
    return segment.startsWith(":") || segment === pathSegments[index];
  });
}

export function findRouteByPathname(
  pathname: string,
  routeObj: Route = routes
): Route | null {
  for (const key in routeObj) {
    if (routeObj[key]?.root && matchPath(routeObj[key].root, pathname)) {
      return routeObj[key];
    }
    if (typeof routeObj[key] === "object" && routeObj[key] !== null) {
      const found = findRouteByPathname(pathname, routeObj[key]);
      if (found) {
        return found;
      }
    }
  }
  return null;
}
