// export default function DashboardPage() {
//   return (
//     <main style={{ padding: '1.5rem' }}>
//       <h1>Dashboard</h1>
//       <p>This is an example dashboard page.</p>
//     </main>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import MapWithMovingMarker from "@/app/components/MapView";
import { reverseGeocode } from '@/app/utils/reverseGeocode';

Amplify.configure(outputs);

const client = generateClient<Schema>();


export default function App() {

  const [locations, setLocations] = useState<Array<Schema["Locations"]["type"]>>([]);
  const [selectedCoords, setSelectedCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [formName, setFormName] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [addMarkerMode, setAddMarkerMode] = useState<boolean>(false);

  function listLocations() {
    client.models.Locations.observeQuery().subscribe({
      next: (data) => setLocations([...data.items]),
    });
  }

  function deleteLocation(id: string) {
    client.models.Locations.delete({ id })
  }
  useEffect(() => {
    listLocations();
  }, []);

  function createLocation() {
    client.models.Locations.create({
      latitude: parseFloat(window.prompt("Latitude") || "0"),
      longitude: parseFloat(window.prompt("Longitude") || "0"),
    });
  }

  const markerPoints = locations.map(loc => ({
    latitude: Number(loc.latitude ?? 0),
    longitude: Number(loc.longitude ?? 0),
  }));

  return (
    <main>
      <div> 
        <h1>A map of the world</h1>
        <button onClick={() => setAddMarkerMode(!addMarkerMode)} style={{ marginBottom: '1rem' }}>
          {addMarkerMode ? 'Exit Add Marker Mode' : 'Enter Add Marker Mode'}
        </button>
        {addMarkerMode && <p>Click on the map to add a new marker.</p>} 
        <MapWithMovingMarker
          markers={markerPoints}
          onMapClick={(coords) => {
            setSelectedCoords(coords);
            // perform reverse geocoding here and set selected label
            reverseGeocode(coords.latitude, coords.longitude)
              .then((displayName) => {
                if (displayName) {
                  setSelectedLabel(`You clicked at:\n${displayName}`);
                  setFormName(displayName);
                } else {
                  setSelectedLabel(null);
                  setFormName("");
                }
              })
              .catch((err) => {
                console.error('Reverse geocoding failed:', err);
                setSelectedLabel(null);
                setFormName("");
              });
            setShowPopup(true);
          }}
          selectedPopupInfo={selectedLabel}
          showPopup={showPopup}
          addMarkerMode={addMarkerMode}
          selectedCoords={selectedCoords}
          onMarkerClick={(i, coords) => {
            // When clicking an existing marker, show its popup and populate form values if available
            setSelectedCoords(coords);
            reverseGeocode(coords.latitude, coords.longitude)
              .then((displayName) => {
                if (displayName) {
                  setSelectedLabel(`You clicked at:\n${displayName}`);
                  setFormName(displayName);
                } else {
                  setSelectedLabel(null);
                  setFormName("");
                }
              })
              .catch((err) => {
                console.error('Reverse geocoding failed:', err);
                setSelectedLabel(null);
                setFormName("");
              });
            setShowPopup(true);
          }}
        />
      </div>
      {selectedCoords && (
        <div style={{ padding: '1rem', border: '1px solid #ccc', marginTop: '1rem' }}>
          <strong>Selected coordinates:</strong>
          <div>Latitude: {selectedCoords.latitude}</div>
          <div>Longitude: {selectedCoords.longitude}</div>
          {selectedLabel && <div style={{ whiteSpace: 'pre-wrap' }}>{selectedLabel}</div>}
          {addMarkerMode && <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              const created = await client.models.Locations.create({
                latitude: selectedCoords.latitude,
                longitude: selectedCoords.longitude,
                type: "user-defined",
                location: selectedLabel || "Unknown location",
                name: formName || selectedLabel || "Unnamed location",
                description: formDescription || "Added by user from map",
              });
              console.log('Create result:', created);
            } catch (err) {
              console.error('Create failed:', err);
              alert('Failed to create location: ' + (err instanceof Error ? err.message : String(err)));
              return;
            } finally {
              setSelectedCoords(null);
              setSelectedLabel(null);
              setFormName("");
              setFormDescription("");
              setShowPopup(false);
            }
          }}>
            <div style={{ marginTop: '0.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Name</label>
              <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder={selectedLabel || 'Name'} />
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Description</label>
              <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Description" />
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <button type="submit">Add selected location</button>
              <button type="button" style={{ marginLeft: '0.5rem' }} onClick={() => {
                setSelectedCoords(null);
                setSelectedLabel(null);
                setFormName("");
                setFormDescription("");
              }}>Cancel</button>
            </div>
          </form>
          }
        </div>
      )}
      {/* <h1>Add Location</h1>
      <button onClick={createLocation}>+ new</button> */}
      <hr/>
      {/* <h1>My locations</h1> */}
      {/* <button onClick={createLocation}>+ new</button> */}
      {/* <ul>
        {locations.map((location) => (
          <li 
            // onClick={() => deleteLocation(location.id)}  
            key={location.id}>{`Latitude: ${location.latitude}, Longitude: ${location.longitude}`}</li>
        ))}
      </ul> */}

    </main>
  );
}

