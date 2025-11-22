import React from 'react'
import SearchBar from './SearchBar'

const Navbar = () => {
  return (
    <div className='w-full h-[120px] font-poppins z-50 sticky top-0 bg-white shadow-2xs flex items-center gap-1 border-b border-gray-300'>
        <div className='text-sky-700 text-6xl p-2 ml-3 font-poppins mr-5'>Jawa</div>
        <SearchBar />
        <div className='flex gap-1 ml-auto'>
            <div className='p-2 bg-sky-200 rounded-xl hover:bg-sky-100'>Tempat Wisata</div>
            <div className='p-2 rounded-xl hover:bg-gray-100'>maps</div>
        </div>
        
        <div className='flex gap-2 ml-auto mr-10'>
            <button className='bg-sky-600 p-3 px-8 rounded-md hover:bg-sky-300 hover:text-white text-white text-bold font-poppins'>Masuk</button>
            <button className='bg-sky-100 p-3 px-8 rounded-md hover:bg-sky-300 hover:text-white text-sky-600 text-bold font-poppins'>Daftar</button>
        </div>
    </div>
  )
}

export default Navbar