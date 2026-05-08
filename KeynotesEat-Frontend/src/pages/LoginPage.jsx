import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setError("Email dan password wajib diisi!");
      return;
    }
    setError("");
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* Sisi Kiri */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-6 md:px-20 py-16">
        <div className="w-full max-w-sm flex flex-col gap-6">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">Keynotes Eat</h1>
            <p className="text-gray-400 mt-2 text-sm">Masuk ke akunmu dulu yuk!</p>
          </div>

          <div className="border border-gray-100 rounded-2xl p-6 shadow-md flex flex-col gap-5 bg-white transition hover:shadow-lg">

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@email.com"
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="flex flex-col gap-2 relative">
              <label className="text-sm font-medium text-gray-600">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex justify-end">
              <a href="#" className="text-sm text-orange-500 hover:underline">Lupa password?</a>
            </div>

            <button
              onClick={handleLogin}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Masuk
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200"></div>
              <p className="text-xs text-gray-400">atau</p>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <button className="border border-gray-200 hover:bg-gray-50 text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google" className="w-5 h-5" />
              Masuk dengan Google
            </button>

          </div>

          <p className="text-sm text-center text-gray-500">
            Belum punya akun?{" "}
            <a href="#" className="text-orange-500 font-medium hover:underline">Daftarrrr</a>
          </p>

        </div>
      </div>

      {/* Sisi Kanan */}
      <div className="hidden md:flex w-1/2 bg-orange-50 items-center justify-center">
        <p className="text-orange-200 text-sm">maskot coming soon 👀</p>
      </div>

    </div>
  );
}