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
type Props = {
  markers?: MarkerType[];
};

export default function MapWithMovingMarker({ markers = [] }: Props) {
  const [markerLocation, setMarkerLocation] = useState<MarkerType | null>(null);
  const [showUserMarkers, setShowUserMarkers] = useState(true);
  const [tempMarkerLocation, setTempMarkerLocation] = useState<MarkerType| null>(null);
  const [popupInfo, setPopupInfo] = useState<string | null>(null);

  // const updateMarker = () =>
  //   setMarkerLocation(prev => ({
  //     latitude: prev.latitude + 5,
  //     longitude: prev.longitude + 5,
  //   }));
  const onClick = useCallback((event: any) => {

    console.log('Map clicked at: ', event.lngLat);
    setTempMarkerLocation({ latitude: event.lngLat.lat, longitude: event.lngLat.lng });

    const info = `Longitude: ${event.lngLat.lng}, Latitude: ${event.lngLat.lat}`;
    setPopupInfo(info);

    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${event.lngLat.lat}&lon=${event.lngLat.lng}&format=json`)
    .then(response => response.json()).then(data => {
      if (data && data.display_name) {
        setPopupInfo(`You clicked at:\n${data.display_name} \n ${info}`);
      }
    }).catch(err => {
      console.error('Error fetching location name:', err);
    });

  }, []);


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
          />
        ))}

        {/* Add a stateful Marker component to the Map at the specified latitude and longitude */}
        {/* {markerLocation && <Marker longitude={markerLocation.longitude} latitude={markerLocation.latitude} anchor="bottom" />} */}
        {/* {tempMarkerLocation && (<><Marker longitude={tempMarkerLocation.longitude} latitude={tempMarkerLocation.latitude} anchor="bottom" /><Popup latitude={tempMarkerLocation.latitude} longitude={tempMarkerLocation.longitude} closeButton={true} closeOnClick={false} anchor="top">Temporary Marker</Popup></>)} */}
        {tempMarkerLocation && (<><Popup latitude={tempMarkerLocation.latitude} longitude={tempMarkerLocation.longitude} closeButton={true} closeOnClick={false} anchor="top">{popupInfo} <br/> <strong>Add this marker below </strong></Popup></>)}
    </Map>
      {/* <MapView>
        <Marker latitude={latitude} longitude={longitude} />
      </MapView> */}
    </div>
    </>
  );
}