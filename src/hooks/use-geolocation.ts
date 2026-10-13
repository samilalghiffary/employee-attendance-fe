"use client";

import { useCallback, useEffect, useState } from "react";

export interface GeoLocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export interface UseGeolocationOptions {
  enabled?: boolean;
}

export function useGeolocation(options?: UseGeolocationOptions) {
  const enabled = options?.enabled ?? true;

  const [state, setState] = useState<GeoLocationState>(() => {
    const isSupported = typeof window !== "undefined" && Boolean(navigator?.geolocation);
    return {
      latitude: null,
      longitude: null,
      error:
        !isSupported && enabled ? "Geolocation is not supported by your browser." : null,
      loading: isSupported && enabled,
    };
  });

  const requestPosition = useCallback(() => {
    if (!enabled || typeof window === "undefined" || !navigator?.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
          error: null,
          loading: false,
        });
      },
      (error) => {
        setState({
          latitude: null,
          longitude: null,
          error: error.message || "Failed to retrieve GPS location.",
          loading: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [enabled]);

  const refetch = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    requestPosition();
  }, [requestPosition]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined" || !navigator?.geolocation) {
      return;
    }

    let isMounted = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!isMounted) return;
        setState({
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
          error: null,
          loading: false,
        });
      },
      (error) => {
        if (!isMounted) return;
        setState({
          latitude: null,
          longitude: null,
          error: error.message || "Failed to retrieve GPS location.",
          loading: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );

    return () => {
      isMounted = false;
    };
  }, [enabled]);

  return {
    ...state,
    refetch,
  };
}
