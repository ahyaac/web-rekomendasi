import React, { useContext } from 'react'
import SearchBar from './SearchBar'
import { AuthContext } from 'api/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;


const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);

  console.log("Navbar user:", user);
  const logout = () => {
    fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    }).finally(() => setUser(null));
  };

  const location = useLocation();
  const navigate = useNavigate();

  const getButtonClass = (path: string) => {
    const isActive = location.pathname === path;
    return `p-2 rounded-xl cursor-pointer transition-colors ${
      isActive ? 'bg-sky-200' : 'hover:bg-gray-100 bg-transparent'
    }`;
  };

  return (
    <div className='w-full h-[120px] font-poppins z-50 sticky top-0 bg-white shadow-2xs flex items-center gap-1 border-b border-gray-300'>
      
      <div className='text-sky-700 text-6xl p-2 ml-3 font-poppins mr-5'>Jawa</div>

      <SearchBar />

      <div className='flex gap-1 ml-auto'>
      <div 
        className={getButtonClass('/wisata')} 
        onClick={() => navigate('/wisata')}
      >
        Tempat Wisata
      </div>
      <div 
        className={getButtonClass('/map')} 
        onClick={() => navigate('/map')}
      >
        Maps
      </div>
      <div 
        className={getButtonClass('/preferences')} 
        onClick={() => navigate('/preferences')}
      >
        Preferences
      </div>
    </div>

      {/* Jika belum login */}
      {!user && (
        <div className='flex gap-2 ml-auto mr-10'>
          <a href="/login" className='bg-sky-600 p-3 px-8 rounded-md hover:bg-sky-300 hover:text-white text-white text-bold font-poppins'>
            Masuk
          </a>
          <a href="/register" className='bg-sky-100 p-3 px-8 rounded-md hover:bg-sky-300 hover:text-white text-sky-600 text-bold font-poppins'>
            Daftar
          </a>
        </div>
      )}

      {/* Jika sudah login */}
      {user && (
        <div className='flex items-center gap-4 ml-auto mr-10'>
          <div className='font-semibold text-sky-700'>
            👋 Halo, {user.user.username}
          </div>

          <button 
            onClick={logout}
            className='bg-red-500 p-3 px-5 rounded-md text-white hover:bg-red-600'
          >
            Logout
          </button>
        </div>
      )}

    </div>
  )
}

export default Navbar
