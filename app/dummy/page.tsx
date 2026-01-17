"use client";

import MapWithMovingMarker from "../components/MapView";

export default function MapPage() {
  return (
    <main style={{ padding: '1.5rem' }}>
      <h1>Map</h1>
      <MapWithMovingMarker />
    </main>
  );
}

