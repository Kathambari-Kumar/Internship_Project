// lib/geocode.ts
export async function getCoordinates(address: string) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    console.log(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
    if (!apiKey) throw new Error("Missing Google Maps API key");
  
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
  
    const res = await fetch(url);
    console.log(url);
    const data = await res.json();
    console.log("data status",data.status);
    if (data.status === "OK") {
      const location = data.results[0].geometry.location;
      console.log("location", location);
      return {
        lat: location.lat,
        lng: location.lng,
      }
    } else {
      throw new Error("Geocoding failed: " + data.status);
    }
  }
  