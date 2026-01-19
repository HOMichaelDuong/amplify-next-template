"use client";

import { useCallback, useState } from 'react';
import { Map, Marker, Popup} from 'react-map-gl/maplibre';
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

type MarkerType = {
  latitude: number;
  longitude: number;
};
// type Props = {
//   markers?: MarkerType[];
// };

type Props = {
  markers?: MarkerType[];
  onMapClick?: (coords: MarkerType) => void;
  selectedPopupInfo?: string | null;
  showPopup?: boolean;
  addMarkerMode?: boolean;
  onAddMarker?: (marker: MarkerType) => void;
  onMarkerClick?: (index: number, coords: MarkerType) => void;
  selectedCoords?: MarkerType | null;
};
export default function MapWithMovingMarker({ markers = [], onMapClick, selectedPopupInfo, showPopup, addMarkerMode = false, onMarkerClick, selectedCoords }: Props) {
  const [markerLocation, setMarkerLocation] = useState<MarkerType | null>(null);
  const [showUserMarkers, setShowUserMarkers] = useState(true);
  const [tempMarkerLocation, setTempMarkerLocation] = useState<MarkerType| null>(null);
  const [popupInfo, setPopupInfo] = useState<string | null>(null);
  const [tempMarkerName, setTempMarkerName] = useState<string>('');
  const [tempMarkerDescription, setTempMarkerDescription] = useState<string>('');

  // const updateMarker = () =>
  //   setMarkerLocation(prev => ({
  //     latitude: prev.latitude + 5,
  //     longitude: prev.longitude + 5,
  //   }));
  const onClick = useCallback((event: any) => {
    const { lngLat } = event;
    // If addMarkerMode is enabled, create a temporary marker and call onMapClick
    if (addMarkerMode) {
      const coords = { latitude: lngLat.lat, longitude: lngLat.lng };
      setTempMarkerLocation(coords);
      const info = `Longitude: ${lngLat.lng}, Latitude: ${lngLat.lat}`;
      setPopupInfo(info);
      if (onMapClick) {
        try {
          onMapClick(coords);
        } catch (err) {
          console.error('onMapClick handler threw:', err);
        }
      }
    }
    // If not in add mode, clicking on map does nothing (only markers are interactive)
  }, [addMarkerMode, onMapClick]);


  return (
    <>
    <Button onClick={() => setShowUserMarkers(!showUserMarkers)}>{showUserMarkers ? "Hide" : "Show"} user markers</Button>
    <br />
    <br />
    <div style={{ width: '100%', height: '500px' }}>

      <Map
        initialViewState={{
        longitude: 4,
        latitude: 50,
        zoom: 3.5,
        }}
        onClick={onClick}

        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
    >
        {/* Render markers passed via props */}
        {showUserMarkers && markers.map((m, i) => (
          <Marker
            key={`marker-${m.latitude}-${m.longitude}-${i}`}
            longitude={m.longitude}
            latitude={m.latitude}
            anchor="bottom"
          >
            <div
              onClick={(e) => {
                // prevent map click from firing
                e.stopPropagation();
                if (onMarkerClick) onMarkerClick(i, m);
              }}
              style={{ cursor: 'pointer', color: 'white' }}
              title="Marker"
            >
              📍
            </div>
          </Marker>
        ))}

        {/* Add a stateful Marker component to the Map at the specified latitude and longitude */}
        {/* {markerLocation && <Marker longitude={markerLocation.longitude} latitude={markerLocation.latitude} anchor="bottom" />} */}
        {/* {tempMarkerLocation && (<><Marker longitude={tempMarkerLocation.longitude} latitude={tempMarkerLocation.latitude} anchor="bottom" /><Popup latitude={tempMarkerLocation.latitude} longitude={tempMarkerLocation.longitude} closeButton={true} closeOnClick={false} anchor="top">Temporary Marker</Popup></>)} */}
        {/* Show popup for selectedCoords (existing marker) or temporary marker (adding) */}
        {selectedCoords && showPopup && (
          <Popup
            latitude={selectedCoords.latitude}
            longitude={selectedCoords.longitude}
            closeButton={true}
            closeOnClick={false}
            anchor="top"
          >
            {selectedPopupInfo ?? popupInfo}
          </Popup>
        )}
        {(!selectedCoords && tempMarkerLocation && showPopup) && (
          <Popup
            latitude={tempMarkerLocation.latitude}
            longitude={tempMarkerLocation.longitude}
            closeButton={true}
            closeOnClick={false}
            anchor="top"
          >
            {selectedPopupInfo ?? popupInfo} <br/> <strong>Add this marker below </strong>
          </Popup>
        )}
    </Map>
      {/* <MapView>
        <Marker latitude={latitude} longitude={longitude} />
      </MapView> */}
    </div>
    </>
  );
}