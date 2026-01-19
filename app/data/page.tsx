"use client";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useEffect, useState } from "react";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function MapPage() {

  const [locations, setLocations] = useState<Array<Schema["Locations"]["type"]>>([]);

  async function deleteLocation(id: string) {
    if (!window.confirm("Remove this user-defined location?")) return;
    try {
      await client.models.Locations.delete({ id });
      // optimistic update — observeQuery should also refresh list
      setLocations((prev) => prev.filter((l) => l.id !== id));
    } catch (e) {
      console.error(e);
      window.alert("Failed to remove location");
    }
  }

  function listLocations() {
    client.models.Locations.observeQuery().subscribe({
      next: (data) => setLocations([...data.items]),
    });
  }

  // function deleteLocation(id: string) {
  //   client.models.Locations.delete({ id })
  // }

  useEffect(() => {
    listLocations();
  }, []);

  return (
    <main style={{ padding: '1.5rem' }}>
      <h1>Current Data</h1>
      <p>This page displays all the different types of data we have available to us, including any user defined data points (i.e. any markers added by the end users).</p>
      <section style={{ marginTop: '1.25rem' }}>
        <h2>Locations</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ddd' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ddd' }}>Latitude</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ddd' }}>Longitude</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ddd' }}>Type</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '0.75rem' }}>No locations available</td>
                </tr>
              ) : (
                locations.map((loc) => (
                  <tr key={loc.id}>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #f0f0f0' }}>{loc.id}</td>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #f0f0f0' }}>{loc.latitude ?? '-'}</td>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #f0f0f0' }}>{loc.longitude ?? '-'}</td>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #f0f0f0' }}>{loc.type ?? "user-defined"}</td>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #f0f0f0' }}>
                      {(loc.type ?? "user-defined") === "user-defined" ? (
                        <button onClick={() => deleteLocation(loc.id)} style={{ color: '#c00' }}>Remove</button>
                      ) : (
                        null
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>



  );
}

