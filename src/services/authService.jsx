import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_API_URL;

const authService = {
  loginDriver: async (email, password, navigate) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/driver/login`, {
        email: email,
        password: password,
      });
      const { accessToken, refreshToken } = response.data.data;

      Cookies.set("accessToken", accessToken, {
        secure: true,
        sameSite: "none",
        expires: 1,
      });
      Cookies.set("refreshToken", refreshToken, { secure: true, sameSite: "none", expires: 7 });
      navigate("/dashboard");
      return response.data;
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#d33",
        showCloseButton: true,
      });
    }
  },

  logoutDriver: async (refreshToken) => {
    try {
      const response = axios.post(`${BASE_URL}/api/driver/logout`, {
        refresh_token: refreshToken,
      });

      Cookies.remove("refreshToken");
      Cookies.remove("accessToken");
      return response.data;
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Gagal Melakukan Logout",
        text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#d33",
        showCloseButton: true,
      });
    }
  },
  refreshUser: async (refreshTokenChange, navigate) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/auth`, {
        refresh_token: refreshTokenChange,
      });

      const { accessToken, refreshToken } = response.data.data;

      Cookies.set("accessToken", accessToken, {
        secure: true,
        sameSite: "none",
        expires: 1,
      });
      Cookies.set("refreshToken", refreshToken, { secure: true, sameSite: "none", expires: 7 });
      navigate("/dashboard");

      return response.data;
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Gagal Refresh Token",
        text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#d33",
        showCloseButton: true,
      });

      navigate("/login");
    }
  },
};

export default authService;
