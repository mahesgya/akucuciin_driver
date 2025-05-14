import RootRedirect from "./hooks/rootRedirect";
import AdminDashboard from "./pages/dashboardPage";
import LoginAdmin from "./pages/loginPage";

const Routess = [
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "/login",
    element: <LoginAdmin />,
  },
  {
    path: "/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/dashboard/order",
    element: <AdminDashboard />,
  },
 
];

export default Routess;
