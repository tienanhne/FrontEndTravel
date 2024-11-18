/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import Logo from "../../assets/logo.png";
import { NavLink, Link } from "react-router-dom";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";
import { LuSunMoon, LuMoon } from "react-icons/lu";
import ResponsiveMenu from "./ResponsiveMenu";
import { useUser } from "../../context/UserContext";
import UserDropdown, { fetchUserProfile } from "../UserDropdown/UserDropdown";
import { useDispatch } from "react-redux";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { State } from "../../redux/store/store";

type TypeLink = {
  name: string;
  link: string;
};

// eslint-disable-next-line react-refresh/only-export-components
export const NavbarLinks: TypeLink[] = [
  {
    name: "Trang chủ",
    link: "/",
  },
  {
    name: "Giới thiệu",
    link: "/about",
  },
  {
    name: "Bài viết",
    link: "/blogs",
  },
];

// eslint-disable-next-line react-refresh/only-export-components

const Navbar: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { handleOrderPopup, darkMode, handleThemeSwitch } = useUser();
  const { account: user } = useSelector((state: State) => state.user);
  const dispatch = useDispatch();

  const { isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => await fetchUserProfile(dispatch),
    staleTime: 1000 * 6,
    cacheTime: 1000 * 6,
    retry: 1,
  });

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      <nav className="fixed top-0 right-0 w-full z-50 bg-white dark:text-white backdrop-blur-sm text-black shadow-md dark:bg-gray-800">
        <div className="container py-3 sm:py-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4  font-bold text-2xl">
              <Link to={"/"} onClick={() => window.scrollTo(0, 0)}>
                <img src={Logo} alt="" className="h-16" />
              </Link>
            </div>
            <div className="hidden md:block">
              <ul className="flex items-center gap-6 ">
                <li className="py-4">
                  <NavLink
                    to="/"
                    className={(navData) =>
                      navData.isActive ? "active" : "none"
                    }
                  >
                    Trang chủ
                  </NavLink>
                </li>
                <li className="py-4">
                  <NavLink
                    to="/blogs"
                    className={(navData) =>
                      navData.isActive ? "active" : "none"
                    }
                  >
                    Bài viết
                  </NavLink>
                </li>
                <li className="py-4">
                  <NavLink
                    to="/best-places"
                    className={(navData) =>
                      navData.isActive ? "active" : "none"
                    }
                  >
                    Địa điểm HOT
                  </NavLink>
                </li>
                <li className="py-4">
                  <NavLink
                    to="/about"
                    className={(navData) =>
                      navData.isActive ? "active" : "none"
                    }
                  >
                    Giới thiệu
                  </NavLink>
                </li>
                <li className="group relative cursor-pointer">
                  <NavLink
                    to={`/history-travel`}
                    className={(navData) =>
                      `flex h-[72px] items-center gap-[2px] ${
                        navData.isActive ? "active" : "none"
                      }`
                    }
                  >
                    Lịch trình của tôi{" "}
                  </NavLink>
                </li>
              </ul>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="relative inline-block align-middle select-none transition duration-200 ease-in"
                title="toggleMode"
              >
                {darkMode ? (
                  <LuSunMoon
                    className="w-6 h-6 text-dark cursor-pointer"
                    onClick={handleThemeSwitch}
                  />
                ) : (
                  <LuMoon
                    className="w-6 h-6 text-gray-700 cursor-pointer"
                    onClick={handleThemeSwitch}
                  />
                )}
              </div>
              {user ? (
                <UserDropdown />
              ) : (
                <button
                  className="bg-gradient-to-r from-primary to-secondary hover:bg-bg-gradient-to-r hover:from-secondary hover:bg-primary transition-all duration-600 text-white px-3 py-2 rounded-full"
                  onClick={handleOrderPopup}
                >
                  Lên lịch trình
                </button>
              )}

              <div className="md:hidden block">
                {showMenu ? (
                  <HiMenuAlt1
                    onClick={toggleMenu}
                    className=" cursor-pointer transition-all"
                    size={30}
                  />
                ) : (
                  <HiMenuAlt3
                    onClick={toggleMenu}
                    className="cursor-pointer transition-all"
                    size={30}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <ResponsiveMenu setShowMenu={setShowMenu} showMenu={showMenu} />
      </nav>
    </>
  );
};

export default Navbar;
