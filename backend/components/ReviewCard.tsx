interface ReviewCardProps {
  rating: string;
  name: string;
  tripType: string;
  review_text: string;
}

const ReviewCard = ({ rating, name, tripType = 'Liburan Pagi', review_text }: ReviewCardProps) => {
  return (
    <div className="min-w-[300px] max-w-[300px] md:min-w-[350px] md:max-w-[350px] border border-gray-200 rounded-xl p-4 bg-white shrink-0 h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-end gap-1">
          <span className="font-bold text-gray-900 text-lg">{rating}</span>
          <span className="text-gray-400 text-xs mb-1">/5</span>
        </div>
      </div>
      
      <div className="mb-3">
        <span className="font-bold text-gray-900 text-sm">{name}</span>
        <span className="text-gray-400 mx-1">•</span>
        <span className="text-gray-500 text-sm">{tripType}</span>
      </div>
      
      <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
        {review_text}
      </p>
    </div>
  );
};

export default ReviewCard;