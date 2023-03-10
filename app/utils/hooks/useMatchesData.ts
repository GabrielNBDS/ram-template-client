import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

export default function useMatchesData<T>(id: string): T {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  
  return route!.data as T;
}