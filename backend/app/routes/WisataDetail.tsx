import React from 'react'
import WisataDescription from '../../components/WisataDescription';
import Navbar from '../../components/Navbar';
import WisataReview from 'components/WisataReview';
import WisataFasilitas from 'components/WisataFasilitas';
import WisataLokasi from 'components/WisataLokasi';

const WisataDetail = () => {
  return (
    <>  
        <Navbar />
        <WisataDescription></WisataDescription>
        <WisataReview />
        <WisataFasilitas />
        <WisataLokasi />
    </>
  )
}

export default WisataDetail