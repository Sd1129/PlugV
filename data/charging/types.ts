export type ChargingStation = {
  id: string;
  name: string;
  operator: string;
  state: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;

  phone?: string;
  website?: string;
  openingHours?: string;
  directionsUrl: string;

  connectors: {
    ccs2: boolean;
    chademo: boolean;
    acType2: boolean;
    gbt?: boolean;
  };

  charging: {
    ac: boolean;
    dcFast: boolean;
    maxPowerKW: number;
    reviewRating?: number;
    reviewCount?: number;
    lastChecked?: string;
    reviewSource?: "community" | "operator" | "plugv";
  };

  availability?: {
    status: "available" | "limited" | "busy" | "offline" | "unknown";
    availableConnectors?: number;
    totalConnectors?: number;
    lastUpdated?: string;
  };

  trust?: {
    verified: boolean;
    sourceType:
      | "OFFICIAL"
      | "MANUAL"
      | "CRAWLED"
      | "USER_SUBMITTED";
    sourceName?: string;
    lastCheckedAt?: string;
  };

  amenities: string[];
};
