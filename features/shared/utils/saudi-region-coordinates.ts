export type MapCoordinates = {
  lat: number;
  lng: number;
};

/** Default map pin. Matches the Riyadh city center used before a region is chosen. */
export const RIYADH_MAP_LOCATION: MapCoordinates = {
  lat: 24.7136,
  lng: 46.6753,
};

/**
 * Approximate centers for `/regions` ids.
 * The lookup API only returns id + name, so a manual address otherwise
 * keeps the untouched Riyadh pin.
 */
export const SAUDI_REGION_COORDINATES: Record<number, MapCoordinates> = {
  1: RIYADH_MAP_LOCATION,
  2: { lat: 21.3891, lng: 39.8579 },
  3: { lat: 24.5247, lng: 39.5692 },
  4: { lat: 26.326, lng: 43.975 },
  5: { lat: 26.4207, lng: 50.0888 },
  6: { lat: 18.2164, lng: 42.5053 },
  7: { lat: 28.3838, lng: 36.555 },
  8: { lat: 27.5114, lng: 41.7208 },
  9: { lat: 30.9753, lng: 41.0381 },
  10: { lat: 16.8892, lng: 42.5511 },
  11: { lat: 17.4924, lng: 44.1277 },
  12: { lat: 20.0129, lng: 41.4677 },
  13: { lat: 29.9697, lng: 40.2064 },
};

export function isUntouchedRiyadhPin(location: MapCoordinates) {
  return (
    Math.abs(location.lat - RIYADH_MAP_LOCATION.lat) < 0.000001 &&
    Math.abs(location.lng - RIYADH_MAP_LOCATION.lng) < 0.000001
  );
}

export function resolveSubmittedMapLocation({
  addressMethod,
  propertyPlaceId,
  mapLocation,
}: {
  addressMethod: string;
  propertyPlaceId?: number | "" | null;
  mapLocation: MapCoordinates;
}): MapCoordinates {
  if (addressMethod !== "manual" || !isUntouchedRiyadhPin(mapLocation)) {
    return mapLocation;
  }

  const regionId = Number(propertyPlaceId);
  return SAUDI_REGION_COORDINATES[regionId] ?? mapLocation;
}
