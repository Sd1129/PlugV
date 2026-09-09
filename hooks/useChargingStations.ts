"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import type { ChargingStation } from "@/data/charging/stations";
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
  states?: string[];
  citiesByState?: Record<string, string[]>;
  suggestions?: string[];
  operators?: string[];
  coverage?: {
    mode: "india" | "city-radius" | "location";
    city?: string;
    radiusKm?: number;
  };
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
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [coverage, setCoverage] = useState<ChargingApiResponse["coverage"]>({ mode: "india" });
  const [selectedCity, setSelectedCity] = useState("");
  const [sortBy, setSortBy] = useState<ChargingSortMode>("distance-asc");
  const [fastOnly, setFastOnly] = useState(false);
  const [ccs2Only, setCcs2Only] = useState(false);
  const [chademoOnly, setChademoOnly] = useState(false);
  const [connector, setConnector] = useState("");
  const [operator, setOperator] = useState("");
  const [powerBand, setPowerBand] = useState("");
  const [liveOnly, setLiveOnly] = useState(false);
  const [reservableOnly, setReservableOnly] = useState(false);
  const [operators, setOperators] = useState<string[]>([]);

  const [nearbyMode, setNearbyMode] = useState(false);
  const [userLocation, setUserLocation] = useState<NearbyLocation | null>(null);

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationNote, setLocationNote] = useState<string | null>(null);

  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [mapStations, setMapStations] = useState<ChargingStation[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] =
    useState<ChargingStation | null>(null);

  const origin = useMemo(() => {
    if (userLocation) return userLocation;
    return null;
  }, [userLocation]);

  const distanceByStationId = useMemo<Record<string, string>>(() => {
    if (!origin) return {};

    return mapStations.reduce<Record<string, string>>((acc, station) => {
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
  }, [origin, mapStations]);

  const buildParams = useCallback(
    (nextOffset: number, requestedLimit = pageSize) => {
      const params = new URLSearchParams({
        search: selectedCity ? "" : deferredSearchQuery,
        fastOnly: String(fastOnly),
        ccs2Only: String(ccs2Only),
        chademoOnly: String(chademoOnly),
        sortBy,
        limit: String(requestedLimit),
        offset: String(nextOffset),
      });

      if (connector) params.set("connector", connector);
      if (operator) params.set("operator", operator);
      if (liveOnly) params.set("liveOnly", "true");
      if (reservableOnly) params.set("reservableOnly", "true");

      const [minimumPower, maximumPower] = powerBand.split("-");
      if (minimumPower) params.set("minPowerKW", minimumPower);
      if (maximumPower) params.set("maxPowerKW", maximumPower);

      if (nearbyMode) {
        params.set("ignoreCityFilter", "true");
      } else if (selectedCity) {
        params.set("city", selectedCity);
      }

      if (userLocation) {
        params.set("originLat", String(userLocation.lat));
        params.set("originLng", String(userLocation.lng));
      }

      return params;
    },
    [
      chademoOnly,
      connector,
      ccs2Only,
      fastOnly,
      liveOnly,
      nearbyMode,
      operator,
      pageSize,
      powerBand,
      reservableOnly,
      deferredSearchQuery,
      selectedCity,
      sortBy,
      userLocation,
    ]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadStations() {
      setLoading(true);
      setError(null);

      try {
        const [response, mapResponse] = await Promise.all([
          fetch(`/api/charging?${buildParams(0).toString()}`, { cache: "no-store" }),
          fetch(`/api/charging?${buildParams(0, 100).toString()}`, { cache: "no-store" }),
        ]);

        if (!response.ok) {
          throw new Error(
            `Unable to load charging stations (${response.status})`
          );
        }

        const data = (await response.json()) as ChargingApiResponse;
        const mapData = mapResponse.ok
          ? ((await mapResponse.json()) as ChargingApiResponse)
          : data;

        if (cancelled) return;

        setStations(data.stations ?? []);
        setMapStations(mapData.stations ?? data.stations ?? []);
        setTotal(data.total ?? 0);
        setOffset((data.stations ?? []).length);
        setSuggestions(data.suggestions ?? []);
        setOperators(data.operators ?? []);
        setCoverage(data.coverage ?? { mode: "india" });
      } catch (err) {
        if (cancelled) return;

        setStations([]);
        setMapStations([]);
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
  }, [buildParams, nearbyMode]);

  const activeStation = useMemo(() => {
    if (
      selectedStation &&
      mapStations.some((station) => station.id === selectedStation.id)
    ) {
      return selectedStation;
    }

    return stations[0] ?? null;
  }, [mapStations, selectedStation, stations]);

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

  const updateSearchQuery = useCallback((value: string) => {
    setSelectedCity("");
    setSearchQuery(value);
  }, []);

  const selectCitySuggestion = useCallback((city: string) => {
    setSelectedCity(city);
    setSearchQuery(city);
    setNearbyMode(false);
    setUserLocation(null);
    setLocationNote(null);
  }, []);

  return {
    searchQuery,
    setSearchQuery: updateSearchQuery,
    suggestions,
    coverage,
    selectedCity,
    selectCitySuggestion,
    sortBy,
    setSortBy,
    fastOnly,
    ccs2Only,
    chademoOnly,
    connector,
    setConnector,
    operator,
    setOperator,
    operators,
    powerBand,
    setPowerBand,
    liveOnly,
    toggleLiveOnly: () => setLiveOnly((current) => !current),
    reservableOnly,
    toggleReservableOnly: () => setReservableOnly((current) => !current),
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
    mapStations,
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
