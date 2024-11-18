import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";

const SimpleLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default SimpleLayout;
