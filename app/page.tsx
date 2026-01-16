"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
// import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
import {
  Map,
} from 'react-map-gl/maplibre';
import MapWithMovingMarker from "@/app/components/MapView";

Amplify.configure(outputs);

const client = generateClient<Schema>();


export default function App() {

  const [selected, setSelected] = useState(null);
  
  const [locations, setLocations] = useState<Array<Schema["Locations"]["type"]>>([]);

  const { signOut } = useAuthenticator();

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

  return (
    <main>
      <h1>My locations</h1>
      <button onClick={createLocation}>+ new</button>
      <ul>
        {locations.map((location) => (
          <li 
            onClick={() => deleteLocation(location.id)}  
            key={location.id}>{`Latitude: ${location.latitude}, Longitude: ${location.longitude}`}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new location.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div>
      <div> 
        <h1>A map of the world</h1>
        <MapWithMovingMarker/>
        {/* <Map
          initialViewState={{
            latitude: 40,
            longitude: -100,
            zoom: 3.5,
            bearing: 0,
            pitch: 0
          }}
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        >

        </Map> */}
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}
