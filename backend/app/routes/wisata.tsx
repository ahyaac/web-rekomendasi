import React from 'react'
import Navbar from '../../components/Navbar'
import WisataCard from 'components/WisataCard'

const wisata = () => {
  return (
    <>
    <Navbar/>
    <div className="flex w-3/4 mx-auto mt-5 gap-4">
        {/* Kolom kiri: daftar card */}
        <div className="flex-1 grid grid-cols-2 gap-4">
            <WisataCard />
            <WisataCard />
            <WisataCard />
            <WisataCard />
            <WisataCard />
            <WisataCard />
            <WisataCard />
            <WisataCard />
            <WisataCard />
            <WisataCard />
            <WisataCard />
            <WisataCard />
            <WisataCard />
            <WisataCard />
            <WisataCard /> 
        </div>
        {/* Kolom kanan: map full height */}
        <div className="w-[350px] h-[calc(100vh-120px)] sticky top-[120px] bg-blue-200">
            {/* Nanti isi dengan Map */}
        </div>
    </div>
    </>
  )
}

export default wisata