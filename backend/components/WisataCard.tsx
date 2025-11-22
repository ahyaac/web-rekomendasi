import React from 'react'
import { Star, MapPin, Heart } from 'lucide-react';


const WisataCard = () => {
  return (
    <div className="flex w-full max-w-[900px] bg-white border border-gray-200 rounded-xl p-3 gap-4 font-sans shadow-sm hover:shadow-md transition-shadow col-span-2">
      <div className="w-[280px] shrink-0 flex flex-col gap-1">
        <div className="relative h-44 rounded-lg overflow-hidden">
          <div className="absolute top-0 left-0 z-10 flex">
            <span className="bg-yellow-400 text-blue-900 text-[10px] font-bold px-2 py-1 flex items-center">
              GREAT OFFER
            </span>
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 flex items-center">
              MEMBER DEALS
            </span>
          </div>
          <button className="absolute top-2 right-2 z-10 bg-black/20 hover:bg-black/40 p-1.5 rounded-full transition-colors">
            <Heart className="w-4 h-4 text-white" />
          </button>
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
            alt="Hotel Main" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-3 gap-1 h-16">
          <img 
            src="https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
            alt="Thumb 1" 
            className="w-full h-full object-cover rounded-md"
          />
          <img 
            src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
            alt="Thumb 2" 
            className="w-full h-full object-cover rounded-md"
          />
          <div className="relative w-full h-full rounded-md overflow-hidden cursor-pointer group">
            <img 
              src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
              alt="Thumb 3" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/60 transition-colors">
              <span className="text-white text-xs font-bold">Lihat semua</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <Star className="w-3 h-3 fill-orange-700" /> Top Hotel 2
              </span>
              <span className="text-red-500 text-xs font-semibold">1 kamar tersisa</span>
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <div className="bg-blue-600 p-0.5 rounded-sm">
                <span className="text-[10px] text-white font-bold px-1">PLUS</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Sahid Surabaya</h2>
            </div>

            <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
              <div className="flex text-orange-400">
                <Star className="w-3 h-3 fill-orange-400" />
                <Star className="w-3 h-3 fill-orange-400" />
                <Star className="w-3 h-3 fill-orange-400" />
              </div>
              <MapPin className="w-3 h-3" />
              <span>Genteng, Surabaya</span>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-gray-600">
              <span className="font-bold text-sm">4,1/5</span>
              <span className="text-xs text-gray-400">(2.778)</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">"Akses mudah"</p>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-1">
          <p className="text-green-600 text-xs font-medium">Couple traveler puas nginep di sini</p>
          <p className="text-green-600 text-xs">Sarapan Gratis, Parkir Gratis, Wifi Gratis</p>
        </div>

        <div className="border-t border-gray-100 my-3"></div>

        <div className="flex justify-between items-end mt-auto">
          <div className="flex items-center gap-1.5 text-gray-600 text-sm">
            <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">P</div>
            <span className="text-gray-500 text-xs">Dapetin hingga 2.972 poin</span>
          </div>

          <div className="border border-gray-200 rounded-lg p-2 shadow-[0_2px_8px_rgba(0,0,0,0.05)] bg-white min-w-[180px]">
            <div className="text-right">
              <div className="flex justify-end items-center gap-2 mb-0.5">
                <span className="text-gray-400 text-xs line-through decoration-gray-400">IDR 798.873</span>
                <span className="text-red-600 font-bold text-xs">-60%</span>
              </div>
              <div className="text-red-600 font-bold text-lg leading-none">
                IDR 327.512
              </div>
              <div className="text-gray-500 text-[10px] mt-1">
                (setelah pajak: IDR 396.290)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WisataCard