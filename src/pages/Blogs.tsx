import React from "react";
import BlogsComp from "../components/Blogs/BlogsComp";

import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { useUser } from "../context/UserContext";
import { useSelector } from "react-redux";
import { State } from "../redux/store/store";

const Blogs: React.FC = () => {
  const navigate = useNavigate();
  const { handleOrderPopup } = useUser();
  const { account } = useSelector((state: State) => state.user);

  const handleWriteBlogClick = () => {
    if (account) {
      navigate("/WriteBlog");
      return;
    }
    handleOrderPopup();
  };
  return (
    <div className="pt-14 bg-gray-50">
      <BlogsComp  />
      <div className="flex justify-center items-center dark:bg-gray-900 ">
        <button
          onClick={handleWriteBlogClick}
          className="bg-gradient-to-r from-primary mb-4 via-secondary to-button hover:bg-gradient-to-l transition-all duration-300 text-white px-5 py-3 rounded-lg text-lg font-semibold shadow-lg flex items-center space-x-2 transform hover:scale-105"
        >
          <FiEdit className="text-xl" />
          <span>Tạo bài viết</span>
        </button>
      </div>
    </div>
  );
};

export default Blogs;
