import React from 'react';
import { Star, MapPin, Heart, Gift, ChevronLeft, ChevronRight, ShieldCheck, ShoppingBag, Utensils } from 'lucide-react';

interface HotelDetailProps {
  title: string;
  total_review: number;
  ticket_price: string;
  address: string;
  total_rating: number;
}

function extractProvinceCountry(address: string): string {
  if (!address) return "";

  const parts = address.split(",").map(p => p.trim());
  let province = parts[parts.length - 2];
  const country = parts[parts.length - 1];
  province = province.replace(/\d{4,6}/, "").trim();
  return `${province}, ${country}`;
}


const HotelDetail = ({title, total_review,total_rating, ticket_price, address}: HotelDetailProps) => {
  return (
    <div className="max-w-7xl mx-auto p-4 font-sans bg-white border-b border-gray-200">
      <div className="text-xs text-gray-400 mb-4 flex gap-1">
        <span>Pantai</span>
        <span>{'>'}</span>
        <span>Jawa Timur</span>
        <span>{'>'}</span>
        <span>Surabaya</span>
        <span>{'>'}</span>
        <span>Genteng</span>
        <span>{'>'}</span>
        <span className="font-semibold text-gray-800">Sahid Surabaya</span>
      </div>

      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] rounded-xl overflow-hidden relative">
        <div className="col-span-2 row-span-2 relative">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Main" 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <span className="text-yellow-400">●</span> tiket.com
            </div>
          </div>
        </div>
        
        <div className="col-span-1 row-span-1">
          <img 
            src="https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
            alt="Exterior" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="col-span-1 row-span-1 relative">
          <img 
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
            alt="Restaurant" 
            className="w-full h-full object-cover"
          />
          <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100">
            <Heart className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="col-span-1 row-span-1">
          <img 
            src="https://images.unsplash.com/photo-1577329539447-01967eb38d27?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
            alt="Meeting Room" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="col-span-1 row-span-1 relative group cursor-pointer">
          <img 
            src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
            alt="Lobby" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/70 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm transition-colors">
            Lihat semua foto
          </div>
        </div>
      </div>

      <div className="mt-6 border-b border-gray-200">
        <div className="flex gap-8">
          {['Info Umum', 'Review', 'Fasilitas Populer', 'Lokasi', 'Tentang'].map((tab, index) => (
            <button 
              key={tab}
              className={`pb-3 text-sm font-bold transition-colors ${index === 0 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-between items-start">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="border border-gray-300 rounded px-1 text-[10px] text-gray-500 font-medium">Wisata</div>
            <div className="flex">
              {[1, 2, 3].map(i => <Star key={i} className="w-3 h-3 fill-gray-400 text-gray-400" />)}
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
          
          <div className="flex items-center gap-2 text-sm mb-4">
            <div className="bg-blue-50 text-blue-600 font-bold px-1.5 py-0.5 rounded text-xs">{total_rating}/5</div>
            <span className="text-gray-500 underline decoration-gray-400 decoration-dotted underline-offset-2 cursor-pointer">({total_review} review)</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500 underline decoration-gray-400 decoration-dotted underline-offset-2 cursor-pointer">{extractProvinceCountry(address)}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1 rounded">
              <ShieldCheck className="w-3 h-3 text-white" />
            </div>
            <span className="text-gray-600 text-sm font-medium">Preferred Partner Plus</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="text-right">
          <div className="bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded inline-block mb-1">
            Diskon 60%
          </div>
          <div className="text-gray-500 text-sm line-through">Mulai dari</div>
          <div className="text-gray-400 text-sm line-through decoration-gray-400">IDR {ticket_price + 60000}</div>
          <div className="text-red-600 text-2xl font-bold mt-1">IDR {ticket_price}</div>
          <div className="text-gray-400 text-xs mb-4">per/orang/ticket</div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors">
            Pesan
          </button>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Serunya Tempat Wisata di Sini</h2>
          <div className="flex gap-2">
            <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-400">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-800">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="border border-gray-200 rounded-xl p-4 flex gap-3 items-start hover:shadow-md transition-shadow cursor-default">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
               <span className="text-xl">👥</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">Bisa buat nginep rame-rame</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Nikmati fasilitas menarik, seperti Pertunjukan Tari.</p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-4 flex gap-3 items-start hover:shadow-md transition-shadow cursor-default">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
              <Utensils className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">Tersedia tempat makan</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Nggak perlu keluar buat beli makanan! Ada restoran dan kafe di akomodasi ini.</p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-4 flex gap-3 items-start hover:shadow-md transition-shadow cursor-default">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">Dekat tempat belanja</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Cuma 403 m ke Plaza Surabaya dan 566 m ke Grand City Mall Surabaya</p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-4 flex gap-3 items-start hover:shadow-md transition-shadow cursor-default">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">Strategis dekat tempat umum</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Cuma 167 m ke Stasiun Gubeng, memudahkan Perjalananmu.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;