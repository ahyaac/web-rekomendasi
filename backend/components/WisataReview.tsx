import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ReviewCard from './ReviewCard';



const WisataReview = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 320;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const reviews = [
    {
      id: 1,
      rating: '5,0',
      date: '20 Nov 2025',
      name: 'Laurensia Nurkusuma Dewi',
      tripType: 'Trip Pasangan',
      text: 'Affordable accommodation, does not disappoint. Room equipped with a working desk. Outstanding staff skills.'
    },
    {
      id: 2,
      rating: '5,0',
      date: '19 Nov 2025',
      name: 'Permana Putra',
      tripType: 'Trip Pasangan',
      text: 'Refreshing clean atmosphere.'
    },
    {
      id: 3,
      rating: '5,0',
      date: '18 Nov 2025',
      name: 'RN',
      tripType: 'Trip Keluarga',
      text: 'Dekat stasiun, tempat strategis, kamar bersih dan nyaman.'
    },
    {
      id: 4,
      rating: '4,8',
      date: '15 Nov 2025',
      name: 'Budi Santoso',
      tripType: 'Trip Bisnis',
      text: 'Pelayanan sangat ramah, proses check-in cepat. Sarapan bervariasi dan enak.'
    },
    {
      id: 5,
      rating: '4,5',
      date: '12 Nov 2025',
      name: 'Siti Aminah',
      tripType: 'Trip Solo',
      text: 'Lokasi sangat strategis di pusat kota. Mudah mencari makan di sekitar hotel.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 font-sans bg-white border-b border-gray-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Review</h2>
        <button className="text-blue-600 font-bold text-sm hover:underline">
          Lihat semua
        </button>
      </div>

      <div className="flex justify-between items-end mb-6">
        <div className="flex items-end gap-3">
          <div className="flex items-end text-gray-900 leading-none">
            <span className="text-5xl font-bold">4,1</span>
            <span className="text-xl font-bold text-gray-500 mb-1">/5</span>
          </div>
          <div className="flex flex-col justify-end mb-1">
            <span className="font-bold text-gray-900">Bagus</span>
            <span className="text-gray-500 text-sm">Dari 2778 review</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => scroll('left')}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-900 hover:text-black transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reviews.map((review) => (
          <ReviewCard 
            key={review.id}
            rating={review.rating}
            date={review.date}
            name={review.name}
            tripType={review.tripType}
            text={review.text}
          />
        ))}
      </div>
    </div>
  );
};

export default WisataReview;