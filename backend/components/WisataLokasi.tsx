import React from 'react';
import { MapPin, Utensils, ShoppingBag, TrainFront, Landmark, Hospital } from 'lucide-react';


const WisataLokasi = () => {
  
  const destinations = [
    {
      icon: <TrainFront size={18} className="text-blue-500" />,
      name: "Stasiun Surabaya Gubeng (SGU)",
      category: "Stasiun kereta",
      distance: "164m"
    },
    {
      icon: <Landmark size={18} className="text-green-600" />,
      name: "Monumen Kapal Selam Surabaya",
      category: "Landmark lain",
      distance: "189m"
    },
    {
      icon: <Utensils size={18} className="text-orange-500" />,
      name: "Barby's Grand City Mal",
      category: "Restoran",
      distance: "373m"
    },
    {
      icon: <ShoppingBag size={18} className="text-purple-500" />,
      name: "Plaza Surabaya",
      category: "Tempat belanja",
      distance: "403m"
    },
    {
      icon: <Hospital size={18} className="text-red-500" />,
      name: "RS Husada Utama",
      category: "Rumah sakit",
      distance: "544m"
    }
  ];

  return (
    <div id="lokasi" className="max-w-7xl mx-auto p-6 bg-white font-sans">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Lokasi</h2>
        <button className="text-blue-600 font-bold text-sm hover:underline">
          Lihat peta
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[450px]">
        <div className="w-full lg:w-7/12 h-full rounded-xl overflow-hidden border border-gray-200 relative bg-gray-100">
          <div className="absolute inset-0 flex items-center justify-center bg-blue-50/50">
             <img 
                src="https://upload.wikimedia.org/wikipedia/commons/e/ec/OpenStreetMap_Standard.png" 
                alt="Map Placeholder" 
                className="w-full h-full object-cover opacity-60 grayscale-[20%]"
             />
             <div className="absolute z-10">
                <MapPin className="text-red-600 fill-red-600 drop-shadow-lg" size={48} />
             </div>
          </div>
        </div>

        <div className="w-full lg:w-5/12 flex flex-col h-full">
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            Jl. Sumatera No.1-15, Pacar Keling, Tambaksari, Kota Surabaya, Jawa Timur 60281, Indonesia
          </p>

          <h3 className="font-bold text-gray-900 mb-3">Destinasi Terdekat</h3>

          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-blue-600 text-xs font-bold whitespace-nowrap">
              <MapPin size={14} />
              Terdekat
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-full text-gray-600 text-xs font-medium whitespace-nowrap hover:bg-gray-50">
              <Utensils size={14} />
              Kuliner
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-full text-gray-600 text-xs font-medium whitespace-nowrap hover:bg-gray-50">
              <ShoppingBag size={14} />
              Tempat belanja
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex flex-col">
              {destinations.map((item, index) => (
                <div key={index} className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{item.category}</div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{item.distance}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100">
             <p className="text-[10px] text-gray-400 leading-tight">
               Jarak di atas diukur berdasarkan garis lurus. Jarak perjalanan yang sebenarnya mungkin berbeda.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WisataLokasi;