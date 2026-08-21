"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getCitiesByState,
  states,
  type ChargingStation,
} from "@/data/charging/stations";
import type {
  ChargingSortMode,
  NearbyLocation,
} from "@/components/charging/ChargingControls";

type ChargingApiResponse = {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  stations: ChargingStation[];
};

const CITY_CENTERS: Record<string, NearbyLocation> = {
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  "New Delhi": { lat: 28.6139, lng: 77.209 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
};

function haversineKm(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number
): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) *
      Math.cos(toRad(bLat)) *
      Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
}

function formatDistanceLabel(distanceKm: number): string {
  if (!Number.isFinite(distanceKm)) return "Distance unavailable";

  if (distanceKm < 1) {
    const meters = Math.max(50, Math.round(distanceKm * 1000));
    return `${meters} m away`;
  }

  const decimals = distanceKm < 10 ? 1 : 0;
  return `${distanceKm.toFixed(decimals)} km away`;
}

export function useChargingStations(pageSize = 12) {
  const initialState = states[0] ?? "";

  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedCity, setSelectedCity] = useState("");

  const cities = useMemo(
    () => getCitiesByState(selectedState),
    [selectedState]
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<ChargingSortMode>("distance-asc");
  const [fastOnly, setFastOnly] = useState(false);
  const [ccs2Only, setCcs2Only] = useState(false);
  const [chademoOnly, setChademoOnly] = useState(false);

  const [nearbyMode, setNearbyMode] = useState(false);
  const [userLocation, setUserLocation] = useState<NearbyLocation | null>(null);

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationNote, setLocationNote] = useState<string | null>(null);

  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] =
    useState<ChargingStation | null>(null);

  const selectState = useCallback((state: string) => {
    setSelectedState(state);
    setSelectedCity("");
  }, []);

  const origin = useMemo(() => {
    if (userLocation) return userLocation;
    return CITY_CENTERS[selectedCity] ?? null;
  }, [selectedCity, userLocation]);

  const distanceByStationId = useMemo<Record<string, string>>(() => {
    if (!origin) return {};

    return stations.reduce<Record<string, string>>((acc, station) => {
      if (
        !Number.isFinite(station.latitude) ||
        !Number.isFinite(station.longitude)
      ) {
        return acc;
      }

      const distanceKm = haversineKm(
        origin.lat,
        origin.lng,
        station.latitude,
        station.longitude
      );

      acc[station.id] = formatDistanceLabel(distanceKm);
      return acc;
    }, {});
  }, [origin, stations]);

  const buildParams = useCallback(
    (nextOffset: number) => {
      const params = new URLSearchParams({
        search: searchQuery,
        fastOnly: String(fastOnly),
        ccs2Only: String(ccs2Only),
        chademoOnly: String(chademoOnly),
        sortBy,
        limit: String(pageSize),
        offset: String(nextOffset),
      });

      if (!nearbyMode) {
        params.set("state", selectedState);
        if (selectedCity) params.set("city", selectedCity);
      } else {
        params.set("ignoreCityFilter", "true");
      }

      if (userLocation) {
        params.set("originLat", String(userLocation.lat));
        params.set("originLng", String(userLocation.lng));
      }

      return params;
    },
    [
      chademoOnly,
      ccs2Only,
      fastOnly,
      nearbyMode,
      pageSize,
      searchQuery,
      selectedCity,
      selectedState,
      sortBy,
      userLocation,
    ]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadStations() {
      if (!nearbyMode && !selectedState) {
        setStations([]);
        setTotal(0);
        setOffset(0);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/charging?${buildParams(0).toString()}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load charging stations (${response.status})`
          );
        }

        const data = (await response.json()) as ChargingApiResponse;

        if (cancelled) return;

        setStations(data.stations ?? []);
        setTotal(data.total ?? 0);
        setOffset((data.stations ?? []).length);
      } catch (err) {
        if (cancelled) return;

        setStations([]);
        setTotal(0);
        setOffset(0);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load charging stations."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadStations();

    return () => {
      cancelled = true;
    };
  }, [buildParams, nearbyMode, selectedState, selectedCity]);

  const activeStation = useMemo(() => {
    if (
      selectedStation &&
      stations.some((station) => station.id === selectedStation.id)
    ) {
      return selectedStation;
    }

    return stations[0] ?? null;
  }, [selectedStation, stations]);

  function useMyLocation() {
    if (!navigator.geolocation) {
      setNearbyMode(true);
      setUserLocation(null);
      setSortBy("distance-asc");
      setLocationNote(
        "Location is not supported by this browser. Using city center fallback."
      );
      return;
    }

    setLocationLoading(true);
    setLocationNote(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setNearbyMode(true);
        setSortBy("distance-asc");
        setLocationLoading(false);
        setLocationNote("Using your live location.");
      },
      () => {
        setUserLocation(null);
        setNearbyMode(true);
        setSortBy("distance-asc");
        setLocationLoading(false);
        setLocationNote("Location denied. Using city center fallback.");
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }

  async function loadMore() {
    if (loading || offset >= total) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/charging?${buildParams(offset).toString()}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`Unable to load more stations (${response.status})`);
      }

      const data = (await response.json()) as ChargingApiResponse;

      setStations((current) => [...current, ...(data.stations ?? [])]);
      setOffset((current) => current + (data.stations ?? []).length);
      setTotal(data.total ?? total);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load more charging stations."
      );
    } finally {
      setLoading(false);
    }
  }

  const showing = stations.length;
  const remaining = Math.max(total - showing, 0);
  const canLoadMore = offset < total;

  return {
    states,
    cities,
    selectedState,
    selectedCity,
    setSelectedState: selectState,
    setSelectedCity,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    fastOnly,
    ccs2Only,
    chademoOnly,
    toggleFastOnly: () => setFastOnly((current) => !current),
    toggleCcs2Only: () => setCcs2Only((current) => !current),
    toggleChademoOnly: () => setChademoOnly((current) => !current),
    nearbyMode,
    userLocation,
    locationLoading,
    locationNote,
    useMyLocation,
    backToCitySearch: () => {
      setNearbyMode(false);
      setUserLocation(null);
      setLocationNote(null);
    },
    stations,
    distanceByStationId,
    total,
    offset,
    loading,
    error,
    selectedStation: activeStation,
    setSelectedStation,
    showing,
    remaining,
    canLoadMore,
    loadMore,
  };
}
