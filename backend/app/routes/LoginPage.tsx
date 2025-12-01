import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface LoginFormData {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    console.log("Submitting form data:", formData);

    try {
      const res = await fetch("http://localhost:8000/api/v1/login", {
        method: "POST",
        credentials: "include", // 👉 wajib agar cookie dikirim
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.detail?.[0]?.msg || "Login gagal");
        return;
      }

      const data = await res.json();
      console.log("Login success:", data);

      // 👉 redirect setelah login
      window.location.href = "/wisata"; // ubah sesuai kebutuhan

    } catch (err) {
      setError("Tidak dapat terhubung ke server");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      <div className="hidden lg:flex w-1/2 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
          alt="Login Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 p-12 z-20 text-white">
          <h2 className="text-4xl font-bold mb-4">Jelajahi Dunia Bersama Kami</h2>
          <p className="text-blue-100 text-lg max-w-md">
            Temukan penginapan impian dan destinasi wisata terbaik dengan penawaran eksklusif.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang Kembali</h1>
            <p className="text-gray-500">Silakan masukkan detail akun Anda untuk masuk.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {JSON.stringify(error)}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg"
                  placeholder="nama pengguna"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
            >
              Masuk
            </button>

          </form>

          {/* Register link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Belum punya akun?{' '}
            <a href="/register" className="font-bold text-blue-600 hover:text-blue-500 inline-flex items-center">
              Daftar sekarang <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
