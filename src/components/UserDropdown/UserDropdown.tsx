/* eslint-disable prefer-const */
/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Dispatch, UnknownAction } from "redux";
import { setAccount } from "../Login/userSlice";
import { useSelector } from "react-redux";
import { State } from "../../redux/store/store";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export const fetchUserProfile = async (dispatch: Dispatch<UnknownAction>) => {
  const accessToken = localStorage.getItem("accessToken");

  let headers = {
    Accept: "application/json",
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    Authorization: `Bearer ${accessToken}`,
  };
  try {
    const response = await axios.get(
      "http://localhost:8888/api/v1/profile/users/my-profile",
      { headers }
    );

    if (response.status == 200) {
      dispatch(setAccount({ account: response.data.result }));
    }
  } catch (error) {
    console.error("Failed to fetch user profile", error);
  }
};

const UserDropdown: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { account } = useSelector((state: State) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    fetchUserProfile(dispatch);
  }, [dispatch]);

  const logout = async () => {
    let headers = {
      Accept: "application/json",
      "Content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
    };
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = Cookies.get("refreshToken");
      if (!accessToken) return;
      const response = await axios.post(
        "http://localhost:8888/api/v1/identity/auth/logout",
        {
          token: refreshToken,
        },
        { headers }
      );

      console.log(response);

      localStorage.removeItem("accessToken");
      Cookies.remove("refreshToken");
   //   window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-2 focus:outline-none"
        onClick={toggleDropdown}
      >
        {account?.avatar ? (
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
            <img
              src={account.avatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <FaUserCircle className="text-3xl text-primary" />
        )}

        <span className="text-sm dark:text-white text-primary">
          {account ? `${account.firstName} ${account.lastName}` : "User"}
        </span>
      </button>
      {dropdownOpen && (
        <div className="absolute dark:text-primary right-[-10px] mt-2 w-40 bg-white rounded-md shadow-lg z-10">
          <ul className="py-1">
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate("edit-profile")}
            >
              Chỉnh sửa
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => logout()}
            >
              Đăng xuất
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
