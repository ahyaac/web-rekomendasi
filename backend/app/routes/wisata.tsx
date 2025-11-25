import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import WisataCard from '../../components/WisataCard';
import { apiFetch } from '../../api/api';

const Wisata = () => {
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
    <>
      <Navbar />
      <div className="flex w-[85%] 2xl:w-[50%] mx-auto mt-5 gap-4">
        
        {/* Kolom kiri */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          {detailWisata.map((wisataItem, index) => (
            <WisataCard
              top={index + 1}
              key={wisataItem.id}
              title={wisataItem.title}
              address={wisataItem.address}
              ticket_price={wisataItem.ticket_price}
              total_rating={wisataItem.total_rating}
              total_review={wisataItem.total_review}
              description={wisataItem.description}
            />
          ))}
        </div>

        {/* Kolom kanan */}
        <div className="w-[350px] h-[calc(100vh-120px)] sticky top-[120px] bg-blue-200">
          {/* Map nanti di sini */}
        </div>
      </div>
    </>
  );
};

export default Wisata;
