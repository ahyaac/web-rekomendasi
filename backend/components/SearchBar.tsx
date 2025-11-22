import React from 'react'
import { IoMdSearch } from "react-icons/io";

const SearchBar = () => {
  return (
    <div className='flex items-center w-fit p-1 bg-gray-200 rounded-3xl max-w-[500px] min-w-[100px]'>
      <input
        className='p-2 bg-transparent focus:outline-none grow' 
        type="text"
        placeholder="Cari..." 
      />
      {}
      <IoMdSearch className="mx-2 text-xl text-gray-600" />
    </div>
    
  )
}

export default SearchBar