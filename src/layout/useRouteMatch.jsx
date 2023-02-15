import { matchPath, useLocation } from 'react-router-dom';

export default function useMatchedRoute(routes) {
  const { pathname } = useLocation();
  for (const route of routes) {
    if (matchPath(pathname, { path: route.path, exact: true, strict: false })) {
      return route;
    }
  }
}