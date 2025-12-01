import React from 'react';
import { Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PopupMapsCardProps {
    id: number;
    title: string;
    address: string;
    total_rating: number;
    total_review: number;
    ticket_price?: number;
}

const PopupMapsCard = ({ id,title,address, total_rating, total_review, ticket_price  }: PopupMapsCardProps) => {
    const navigate = useNavigate();

    return (
    <div onClick={() => navigate(`/wisata/${id}`)} className="w-[220px] bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow font-sans cursor-pointer group">
      <div className="relative h-[160px]">
        <img 
          src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
          alt="Arimbi Stay" 
          className="w-full h-full object-cover"
        />
        
        <button className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-black/20 transition-colors">
          <Heart className="w-5 h-5 text-white drop-shadow-md" />
        </button>

        <div className="absolute bottom-0 left-0 flex">
          <div className="bg-yellow-400 text-blue-900 text-[10px] font-black px-2 py-1 clip-path-slant-r pr-3 flex items-center">
            GREAT OFFER!
          </div>
          <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 -ml-1 flex items-center">
            MEMBER DEALS
          </div>
        </div>
      </div>

      <div className="p-3 flex flex-col">
        <h3 className="text-sm font-bold text-gray-900 leading-tight">{title}</h3>
        
        <div className="flex items-center">
          <div className="flex">
            {[1, 2, 3].map((star) => (
              <Star key={star} className="w-3 h-3 fill-orange-500 text-orange-500" />
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-500">{address}</p>
        <p className="text-xs text-gray-500">{total_rating}/5 ({total_review})</p>

        <div className="mt-auto">
          <p className="text-xs text-gray-400 line-through decoration-gray-400">IDR {ticket_price ? ticket_price + 10000 : ''}</p>
          <p className="text-lg font-bold text-red-600 leading-none">IDR {ticket_price}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">Belum termasuk pajak</p>
        </div>
      </div>
    </div>
  );
};

export default PopupMapsCard;