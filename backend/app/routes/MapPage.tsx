import Navbar from "components/Navbar";
import { useEffect, useState } from "react";

export default function MapPage() {
  const [MapComponent, setMapComponent] = useState<React.FC | null>(null);

  useEffect(() => {
    // Import hanya terjadi di browser, bukan saat initial render
    import("../../components/Maps").then((module) => {
      setMapComponent(() => module.default);
    });
  }, []);

  if (!MapComponent) return <p>Loading map...</p>;

  return (
  <>
    <Navbar />
    <MapComponent />
  </>
  );
}
