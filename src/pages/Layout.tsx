import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import OrderPopup from "../components/OrderPopup/OrderPopup";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <OrderPopup />
    </>
  );
};

export default Layout;
