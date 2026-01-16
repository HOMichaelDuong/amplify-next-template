"use client";

import { useState } from 'react';
import { Map, Marker} from 'react-map-gl/maplibre';
import { Amplify } from 'aws-amplify';
import { Button } from '@aws-amplify/ui-react';
import { MapView } from '@aws-amplify/ui-react-geo';

import '@aws-amplify/ui-react-geo/styles.css';
import 'maplibre-gl/dist/maplibre-gl.css';

// export default function BasicMap() {
//   return (
//     <div style={{ width: '100%', height: '500px' }}>
//       <MapView
//         initialViewState={{
//           latitude: 37.8,
//           longitude: -122.4,
//           zoom: 14,
//         }}
//         style={{ width: '100%', height: '100%' }}
//         mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
//       />
//     </div>
//   );
// }

export default function MapWithMovingMarker() {
  const [{ latitude, longitude }, setMarkerLocation] = useState({
    latitude: 40,
    longitude: -100,
  });

  const updateMarker = () =>
    setMarkerLocation(prev => ({
      latitude: prev.latitude + 5,
      longitude: prev.longitude + 5,
    }));

  return (
    <>
    <Button onClick={updateMarker}>Move Marker</Button>
    <div style={{ width: '100%', height: '500px' }}>

      <Map
        initialViewState={{
        longitude: -100,
        latitude: 40,
        zoom: 3.5
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
    >
        <Marker longitude={longitude} latitude={latitude} anchor="bottom" />
    </Map>
      {/* <MapView>
        <Marker latitude={latitude} longitude={longitude} />
      </MapView> */}
    </div>
    </>
  );
}