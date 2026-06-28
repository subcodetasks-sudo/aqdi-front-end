"use client";

import { useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export type OsmMapLocation = {
  lat: number;
  lng: number;
};

type OsmLocationPickerMapProps = {
  value: OsmMapLocation;
  onChange: (location: OsmMapLocation) => void;
  mapTitle: string;
  hint?: string;
  coordinatesLabel?: string;
};

function roundCoordinate(value: number) {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function MapClickHandler({
  onChange,
}: {
  onChange: (location: OsmMapLocation) => void;
}) {
  useMapEvents({
    click(event) {
      onChange({
        lat: roundCoordinate(event.latlng.lat),
        lng: roundCoordinate(event.latlng.lng),
      });
    },
  });

  return null;
}

const markerIcon = L.divIcon({
  className: "osm-location-marker",
  html: '<span class="osm-location-marker-dot" aria-hidden="true"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export default function OsmLocationPickerMap({
  value,
  onChange,
  mapTitle,
  hint,
  coordinatesLabel,
}: OsmLocationPickerMapProps) {
  const position = useMemo<[number, number]>(
    () => [value.lat, value.lng],
    [value.lat, value.lng],
  );

  return (
    <div className="space-y-2">
      {hint ? <p className="text-sm text-[#7f7f7f]">{hint}</p> : null}

      <div
        className="relative overflow-hidden rounded-3xl border border-[#e8e8e8]"
        aria-label={mapTitle}
      >
        <MapContainer
          center={position}
          zoom={13}
          className="osm-location-picker-map h-72 w-full cursor-crosshair md:h-80"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={markerIcon} />
          <MapClickHandler onChange={onChange} />
        </MapContainer>
      </div>

      {coordinatesLabel ? (
        <p className="text-center text-xs text-[#7f7f7f]">
          {coordinatesLabel}: {value.lat}, {value.lng}
        </p>
      ) : null}
    </div>
  );
}
