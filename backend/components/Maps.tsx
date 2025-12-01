import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { type LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import PopupMapsCard from "./PopupMapsCard";
import { useState } from "react";
import { useEffect } from "react";
import { apiFetch } from "../api/api";
import { redIcon } from "./MarkIcon/redIcon";
import { greenIcon } from "./MarkIcon/greenIcon";
import { goldIcon } from "./MarkIcon/goldIcon";

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
    const [detailWisata, setDetailWisata] = useState<Array<any>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
      useEffect(() => {
        async function fetchWisata() {
          try {
            const data = await apiFetch('wisata');
            setDetailWisata(data.wisata);
          } catch (err) {
            setError((err as Error).message);
          }
          setLoading(false);
        }
        fetchWisata();
      }, []);
    
      console.log(detailWisata);
    
      if (loading) return <p className="text-center mt-10">Loading...</p>;
      if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  
  return (
     <MapContainer center={[-6.2, 106.8]} zoom={6} style={{ height: "100vh" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {detailWisata.map((wisata) => (
        <Marker 
          key={wisata.id}
          icon={wisata.total_review > 2000 ? redIcon : wisata.total_review > 500 ? goldIcon : greenIcon}
          position={[wisata.latitude, wisata.longitude]} 
        >
            <Popup className="custom-popup">
                <PopupMapsCard
                key={wisata.id}
                id={wisata.id}
                title={wisata.title}
                 address={wisata.address}
                 ticket_price={wisata.ticket_price}
                 total_rating={wisata.total_rating}
                 total_review={wisata.total_review}/>
            </Popup>
          
        </Marker>
      ))}
    </MapContainer>
  );
}
