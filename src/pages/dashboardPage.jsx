import { useState, useEffect } from "react";
import { FaHome, FaBars, FaTimes, FaSignOutAlt, FaShoppingCart } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import authService from "../services/authService";
import Swal from "sweetalert2";
import HomePage from "./admin_pages/homePage";
import { matchPath } from "react-router-dom";
import OrderTable from "./admin_pages/orderPage";

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");

  const menuMapping = {
    "/dashboard": "Home",
    "/dashboard/order": "Order",
  };

  const [activeMenu, setActiveMenu] = useState(menuMapping[location.pathname] || "Home");

  useEffect(() => {
    const refreshAuthToken = async () => {
      try {
        await authService.refreshUser(refreshToken, navigate);
      } catch (error) {
        console.error("Error refreshing token:", error);
        navigate("/login");
      }
    };

    refreshAuthToken();

    const interval = setInterval(refreshAuthToken, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fotoMatch = matchPath("/dashboard/foto/:idLaundry", location.pathname);

    if (fotoMatch) {
      setActiveMenu("Foto Laundry");
    } else {
      setActiveMenu(menuMapping[location.pathname] || "Home");
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await authService.logoutAdmin(Cookies.get("refreshToken"));
      navigate("/login");
    } catch (error) {
      console.error("Logout Error: ", error);
      Swal.fire("Gagal Logout", "Terjadi kesalahan saat logout.", "error");
    }
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);

    switch (menu) {
      case "Order":
        navigate("/dashboard/order");
        break;
      default:
        navigate("/dashboard");
    }
  };

  const renderContent = () => {
    switch (location.pathname) {
      case "/dashboard/order":
        return <OrderTable />;
      default:
        return <HomePage />;
    }
  };

  if (!accessToken) {
    Swal.fire({
      icon: "error",
      title: "Anda Belum Login",
      text: "Silahkan Melakukan Login Terlebih Dahulu.",
      confirmButtonText: "Coba Lagi",
      confirmButtonColor: "#d33",
      showCloseButton: true,
    });
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-200 via-white to-gray-100 text-gray-700">
      {!isOpen && (
        <div className="block w-14 h-screen bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 flex items-start justify-center">
          <button onClick={toggleSidebar} className="p-3 text-md text-white lg:text-2xl">
            <FaBars />
          </button>
        </div>
      )}

      <div className={`transform ${isOpen ? "translate-x-0 block top-0 left-0 min-h-screen pb-8 bg-white w-[40vh] transition-transform duration-300 z-50 shadow-xl" : "hidden"}`}>
        <div className="font-quick p-6 text-center flex flex-row items-center justify-center space-x-2 font-bold text-lg md:text-2xl lg:text-2xl">
          <img src="/images/LogoAkucuciin.png" alt="" className="w-25 lg:w-[200px]" />
          {isOpen && (
            <button onClick={toggleSidebar} className="text-md text-indigo-500 lg:text-2xl">
              <FaTimes />
            </button>
          )}
        </div>

        <nav className="flex-1 p-1  space-y-4 w-full flex flex-col justify-center items-center lg:p-4">
          {[
            { name: "Home", path: "/dashboard", icon: <FaHome className="text-sm md:text-xl lg:text-2xl mr-3" /> },
            { name: "Order", path: "/dashboard/order", icon: <FaShoppingCart className="text-sm md:text-xl lg:text-2xl mr-3" /> },
          ].map((menu) => (
            <button
              key={menu.name}
              className={`text-sm lg:text-xl w-full font-medium font-quick flex items-center p-1 lg:p-3 rounded-md transition-all
        ${activeMenu === menu.name ? "bg-indigo-500 text-white" : "bg-none text-gray-700 hover:bg-gray-100"}`}
              onClick={() => handleMenuClick(menu.name)}
            >
              {menu.icon} {menu.name}
            </button>
          ))}

          <button onClick={handleLogout} className="font-semibold w-full flex items-center p-1 lg:p-3 rounded-md text-sm lg:text-xl bg-transparent text-red-600 hover:bg-red-600 hover:text-white mt-4 transition-all">
            <FaSignOutAlt className=" text-sm md:text-xl lg:text-2xl mr-3 transition-all" />
            Logout
          </button>
        </nav>

        <div className="p-4 text-center mt-auto">
          <p className="text-sm text-gray-400 font-quick">&copy; 2024 Admin Akucuciin</p>
        </div>
      </div>

      {isOpen && <div className="fixed inset-0 bg-black opacity-50 md:hidden" onClick={toggleSidebar}></div>}

      <div className="flex-1">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
