import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { type LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icon agar tidak error di Vite + React Router
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface Location {
  id: number;
  name: string;
  position: LatLngExpression;
}

const locations: Location[] = [
  { id: 1, name: "Jakarta", position: [-6.2, 106.8] },
  { id: 2, name: "Bandung", position: [-6.9, 107.6] },
  { id: 3, name: "Surabaya", position: [-7.25, 112.75] },
];

export default function RealMap() {
  return (
     <MapContainer center={[-6.2, 106.8]} zoom={6} style={{ height: "100vh" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {locations.map((loc) => (
        <Marker 
          key={loc.id} 
          position={loc.position} 
        >
          <Popup>{loc.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
