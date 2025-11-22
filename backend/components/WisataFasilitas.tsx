import React from 'react';
import { Wifi, AirVent, Clock, ArrowUpDown, Utensils, Armchair, Users, ParkingCircle } from 'lucide-react';

const WisataFasilitas = () => {
  const popularFacilities = [
    { icon: <Wifi size={20} />, label: "WiFi" },
    { icon: <AirVent size={20} />, label: "AC" },
    { icon: <Clock size={20} />, label: "Resepsionis 24 Jam" },
    { icon: <ArrowUpDown size={20} />, label: "Lift" },
    { icon: <Utensils size={20} />, label: "Restoran" },
    { icon: <Armchair size={20} />, label: "Ruang Tamu" },
    { icon: <Users size={20} />, label: "Fasilitas Rapat" },
    { icon: <ParkingCircle size={20} />, label: "Parkir Gratis" },
  ];

  const categories = [
    {
      title: "Fasilitas Umum",
      count: 9,
      items: ["Ruang Merokok", "AC", "Lobi", "WiFi Publik", "Lift", "Restoran", "Ruang Tamu", "Toilet", "Parkir (Gratis)"]
    },
    {
      title: "Hewan Peliharaan",
      count: 1,
      items: ["Hewan Peliharaan Tidak Diperbolehkan"]
    },
    {
      title: "Layanan Hotel",
      count: 6,
      items: ["Penitipan Bagasi", "Resepsionis 24 Jam", "Resepsionis", "Layanan Laundry/Dry Cleaning", "Brankas Hotel", "Layanan Concierge"]
    },
    {
      title: "Fasilitas Lainnya",
      count: 1,
      items: ["Keamanan"]
    },
    {
      title: "Makanan & Minuman",
      count: 2,
      items: ["Lemari Es", "Kafe atau Kedai Kopi"]
    },
    {
      title: "Fasilitas Bisnis",
      count: 2,
      items: ["Ruang Rapat", "Pusat Bisnis"]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white font-sans text-gray-800 border-b border-gray-300">
      <div className="pb-8 border-b border-gray-200">
        <h2 className="text-xl font-bold mb-6 text-gray-900">Fasilitas Populer</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
          {popularFacilities.map((facility, index) => (
            <div key={index} className="flex items-center gap-3 text-gray-600">
              <div className="text-gray-700">{facility.icon}</div>
              <span className="text-sm font-medium">{facility.label}</span>
            </div>
          ))}
        </div>
      </div>

      {categories.map((category, index) => (
        <div key={index} className={`py-6 ${index !== categories.length - 1 ? 'border-b border-gray-200' : ''}`}>
          <div className="flex items-center gap-2 mb-6">
            <h3 className="font-bold text-gray-900">{category.title}</h3>
            {category.count && (
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded">
                {category.count}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-y-4 gap-x-4">
            {category.items.map((item, idx) => (
              <div key={idx} className="text-gray-500 text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WisataFasilitas;