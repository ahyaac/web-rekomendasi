import React, { useState, useEffect } from 'react';
import { 
  Users, Moon, Mountain, Waves, Trees, FerrisWheel, Umbrella, 
  Wallet, Diamond, ArrowRight, CheckCircle2, Save, Loader2 
} from 'lucide-react';

import { apiFetch, apiPost } from 'api/api';
import Navbar from 'components/Navbar';

// Tipe data sesuai dengan struktur API Anda
interface UserPreferences {
  environment: 'Ramai' | 'Sepi' | '';
  tipe: 'Gunung' | 'Laut' | 'Taman' | 'Wahana' | 'Pantai' | '';
  price_category: 'Murah' | 'Mahal' | '';
}

const PreferencePage = () => {
  // State untuk menyimpan data preferensi
  const [preferences, setPreferences] = useState<UserPreferences>({
    environment: '',
    tipe: '',
    price_category: ''
  });

  // State untuk status loading dan feedback
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // 1. FETCH DATA (GET) saat halaman dimuat
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        console.log("Fetching preferences...");
        const response = await apiFetch('preferences');
        console.log("Response:", response);
        if (response) {
          const data = await response;
          console.log('Fetched preferences:', data);
          // Cek jika data preferences ada (tidak null)
          if (data.preferences) {
            console.log('data =', data.preferences)
            setPreferences(data.preferences);
          }
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  // 2. FUNGSI SIMPAN (PUT/POST)
  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      // Sesuaikan method dengan backend Anda (biasanya POST atau PUT untuk update)
      const response = await apiPost('preferences', preferences);
      if (response.ok) {
        setMessage({ text: 'Preferensi berhasil diperbarui!', type: 'success' });
      } else {
        setMessage({ text: 'Gagal menyimpan preferensi.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Terjadi kesalahan koneksi.', type: 'error' });
    } finally {
      setIsSaving(false);
      // Hilangkan pesan setelah 3 detik
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Komponen Kartu Pilihan
  const SelectionCard = ({ 
    isSelected, 
    onClick, 
    icon: Icon, 
    label 
  }: { 
    isSelected: boolean; 
    onClick: () => void; 
    icon: any; 
    label: string; 
  }) => (
    <div 
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 h-32
        ${isSelected 
          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md transform scale-[1.02]' 
          : 'border-gray-200 bg-white text-gray-500 hover:border-blue-200 hover:bg-gray-50'
        }
      `}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 animate-in fade-in zoom-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-blue-600" />
        </div>
      )}
      <Icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
      <span className="font-bold text-sm">{label}</span>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-2 text-blue-600" />
          <p>Memuat preferensi kamu...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Preferensi Liburan</h1>
          <p className="text-gray-500">Ubah pilihan di bawah ini sesuai keinginanmu saat ini.</p>
        </div>

        {/* Notifikasi */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg text-center font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-8">
          {/* Section 1: Environment */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-sm">1</span>
              Lingkungan
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <SelectionCard 
                label="Ramai" 
                icon={Users} 
                isSelected={preferences.environment === 'Ramai'}
                onClick={() => setPreferences({ ...preferences, environment: 'Ramai' })}
              />
              <SelectionCard 
                label="Sepi" 
                icon={Moon} 
                isSelected={preferences.environment === 'Sepi'}
                onClick={() => setPreferences({ ...preferences, environment: 'Sepi' })}
              />
            </div>
          </div>

          {/* Section 2: Tipe Wisata (Menggunakan key 'tipe' sesuai API) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-sm">2</span>
              Tipe Wisata
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(['Gunung', 'Laut', 'Pantai', 'Taman', 'Wahana'] as const).map((item) => (
                <SelectionCard 
                  key={item}
                  label={item}
                  icon={
                    item === 'Gunung' ? Mountain :
                    item === 'Laut' ? Waves :
                    item === 'Pantai' ? Umbrella :
                    item === 'Taman' ? Trees : FerrisWheel
                  }
                  isSelected={preferences.tipe === item}
                  onClick={() => setPreferences({ ...preferences, tipe: item })}
                />
              ))}
            </div>
          </div>

          {/* Section 3: Kategori Harga (Menggunakan key 'price_category' sesuai API) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-sm">3</span>
              Kategori Harga
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <SelectionCard 
                label="Murah" 
                icon={Wallet} 
                isSelected={preferences.price_category === 'Murah'}
                onClick={() => setPreferences({ ...preferences, price_category: 'Murah' })}
              />
              <SelectionCard 
                label="Mahal" 
                icon={Diamond} 
                isSelected={preferences.price_category === 'Mahal'}
                onClick={() => setPreferences({ ...preferences, price_category: 'Mahal' })}
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 sticky bottom-4 z-10">
            <button
              onClick={handleSave}
              disabled={isSaving || !preferences.environment || !preferences.tipe || !preferences.price_category}
              className={`
                w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all
                ${(isSaving || !preferences.environment || !preferences.tipe || !preferences.price_category)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1'
                }
              `}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Menyimpan Perubahan...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
  
};


export default PreferencePage;