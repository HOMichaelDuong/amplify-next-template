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

Amplify.configure(outputs);

const client = generateClient<Schema>();


export default function App() {

  const [locations, setLocations] = useState<Array<Schema["Locations"]["type"]>>([]);

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
      // isUserDefined: true,
    });
  }

  const markerPoints = locations.map(loc => ({
    latitude: Number(loc.latitude ?? 0),
    longitude: Number(loc.longitude ?? 0),
    // isUserDefined: loc.isUserDefined ?? false,
  }));

  return (
    <main>
      <h1>My locations</h1>
      <button onClick={createLocation}>+ new</button>
      <ul>
        {locations.map((location) => (
          <li 
            // onClick={() => deleteLocation(location.id)}  
            key={location.id}>{`Latitude: ${location.latitude}, Longitude: ${location.longitude}`}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new location.
        <br />
      </div>
      <div> 
        <h1>A map of the world</h1>
        <MapWithMovingMarker markers={markerPoints}/>
      </div>
    </main>
  );
}

