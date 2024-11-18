import React from "react";
import {  FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { NavbarLinks } from "./Navbar";
import { useSelector } from "react-redux";
import { State } from "../../redux/store/store";

const ResponsiveMenu = ({
  showMenu,
  setShowMenu,
}: {
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { account: user } = useSelector((state: State) => state.user);

  return (
    <div
      className={`${
        showMenu ? "left-0" : "-left-[100%]"
      } fixed bottom-0 top-0 z-20 flex h-screen w-[75%] flex-col justify-between bg-white dark:bg-gray-900 dark:text-white px-8 pb-6 pt-16 text-black transition-all duration-200 md:hidden rounded-r-xl shadow-md`}
    >
      <div className="card">
        <div className="flex items-center justify-start gap-3">
          {user?.avatar ? (
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
              <img
                src={user.avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <FaUserCircle size={50} />
          )}
          <div>{user && <h1>{user.firstName + " " + user.lastName}</h1>}</div>
        </div>
        <nav className="mt-12">
          <ul className="space-y-5">
            {NavbarLinks.map((data) => (
              <li key={data.name}>
                <Link
                  to={data.link}
                  onClick={() => setShowMenu(false)}
                  className="block text-lg font-medium px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {data.name}
                </Link>
              </li>
            ))}
            <li className="relative group">
              <Link
                to={`/history-travel`}
                className="flex items-center justify-between w-full px-4 py-2 text-lg font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Lịch trình của tôi
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="footer">
        <h1>
          Made with ❤ by{" "}
          <a href="https://github.com/tienanhne/FETravel_135">DinhTienLe</a>{" "}
        </h1>
      </div>
    </div>
  );
};

export default ResponsiveMenu;
