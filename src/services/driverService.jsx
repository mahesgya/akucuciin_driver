import axios from "axios";
import Swal from "sweetalert2";
const BASE_URL = import.meta.env.VITE_API_URL;

const driverService = {
  getDriverProfile: async (accessToken) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/driver`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data;
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Gagal Mendapatkan Data Profil.",
        text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#d33",
        showCloseButton: true,
      });
    }
  },
  getOrderDriver: async (accessToken) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/driver/orders`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data;
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Gagal Mendapatkan Data Order.",
        text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#d33",
        showCloseButton: true,
      });
    }
  },
  putOrderDriver: async (accessToken, idOrder, formData) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/driver/order/${idOrder}`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      await Swal.fire({
        icon: "succes",
        title: "Berhasil",
        text: "Berhasil Mengubah Status Order.",
        confirmButtonText: "Ok",
        confirmButtonColor: "#28a745",
        showCloseButton: true,
      });
      return response.data;
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Gagal Mendgubah Status Order.",
        text: error.response?.data?.errors || "Terjadi kesalahan, coba lagi.",
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#d33",
        showCloseButton: true,
      });
    }
  },
};

export default driverService;
