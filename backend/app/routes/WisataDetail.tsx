import WisataDescription from '../../components/WisataDescription';
import Navbar from '../../components/Navbar';
import WisataReview from 'components/WisataReview';
import WisataFasilitas from 'components/WisataFasilitas';
import WisataLokasi from 'components/WisataLokasi';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/api';
import { useParams } from 'react-router';


const WisataDetail = () => {
    const [detailWisata, setDetailWisata] = useState<any>([]);
    const [detailReviews, setDetailReviews] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    let params = useParams();
  
    useEffect(() => {
      async function fetchWisata() {
        try {
          const [dataWisata, dataReviews] = await Promise.all([
            apiFetch(`wisata/${params.id}`),
            apiFetch(`reviews/${params.id}`)
          ]);
          setDetailWisata(dataWisata.wisata);
          setDetailReviews(dataReviews.reviews);
        } catch (err) {
          setError((err as Error).message); 
        }
        setLoading(false);
      }
      fetchWisata();
    }, []);
  
    console.log(detailWisata);
    console.log(detailReviews);
  
    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  
  return (
    
    <>  
        <Navbar />
        <WisataDescription title={detailWisata.title}
          total_review={detailWisata.total_review}
          ticket_price={detailWisata.ticket_price}
          address={detailWisata.address}
          total_rating={detailWisata.total_rating} />
        <WisataReview reviews={detailReviews} 
         total_review={detailWisata.total_review}
         total_rating={detailWisata.total_rating} />
        <WisataFasilitas />
        <WisataLokasi />
    </>
  )
}

export default WisataDetail