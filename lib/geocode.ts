interface GeoResult {
  lat: number;
  lng: number;
}

const cache = new Map<string, GeoResult>();

export async function geocode(placeName: string): Promise<GeoResult | null> {
  const key = placeName.toLowerCase().trim();
  if (cache.has(key)) return cache.get(key)!;

  try {
    const encoded = encodeURIComponent(placeName);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`,
      { headers: { 'User-Agent': 'Travell-App/1.0' } }
    );
    const json = await res.json();
    if (!json.length) return null;

    const result: GeoResult = {
      lat: parseFloat(json[0].lat),
      lng: parseFloat(json[0].lon),
    };
    cache.set(key, result);
    return result;
  } catch {
    return null;
  }
}

export async function geocodeActivities<T extends { lat: number; lng: number; location: string }>(
  items: T[]
): Promise<T[]> {
  return Promise.all(
    items.map(async (item) => {
      if (item.lat && item.lng) return item;
      const coords = await geocode(item.location);
      return coords ? { ...item, ...coords } : item;
    })
  );
}
