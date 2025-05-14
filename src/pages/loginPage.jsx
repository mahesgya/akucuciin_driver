import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await authService.loginDriver(email, password, navigate);
      setEmail("");
      setPassword("");

    } catch (err) {
      setError(err.message || "Terjadi Kesalahan Saat Login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tl from-[#64b5f6] via-[#b3e5fc] to-[#64b5f6]">
      <div className="max-w-md w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
      <img src="/images/LogoAkucuciin.png" alt="Logo AkuCuciin" className=" w-32 h-auto lg:w-[200px] mx-auto mb-2" />

        {error && <p className="text-red-600 bg-red-100 border border-red-500 rounded-md text-center p-3 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email Anda"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#64b5f6]"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password Anda"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#64b5f6]"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-3 p-3 bg-[#64b5f6] text-white rounded-xl font-semibold shadow-md hover:from-gray-900 hover:to-black focus:outline-none focus:ring-2 focus:ring-black hover:shadow-lg transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-4">© {new Date().getFullYear()} Driver Akucuciin</p>
      </div>
    </div>
  );
};

export default LoginAdmin;
