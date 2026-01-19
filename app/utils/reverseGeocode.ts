export async function reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(
      latitude
    )}&lon=${encodeURIComponent(longitude)}&format=json`;
    const res = await fetch(url, {
      headers: {
        // Nominatim recommends setting a referer/user-agent identifying your application
        'Accept': 'application/json',
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.display_name) return data.display_name;
    return null;
  } catch (err) {
    // swallow network errors and return null so callers can handle gracefully
    // eslint-disable-next-line no-console
    console.error('reverseGeocode error', err);
    return null;
  }
}
