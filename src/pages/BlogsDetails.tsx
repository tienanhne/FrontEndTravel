import { useLocation } from "react-router-dom";
import BlogsComp from "../components/Blogs/BlogsComp";
import CommentComponent from "../components/Comments/CommentSection";
import parse from "html-react-parser";
import { FaUser, FaCalendarAlt, FaTag } from "react-icons/fa";

const BlogsDetails = () => {
  const location = useLocation();
  const {
    id,
    image,
    tags = [],
    createDate,
    title,
    content,
    userName,
  } = location.state || {};

  return (
    <div className="dark:bg-gray-900 bg-gradient-to-r from-blue-100 via-green-50 to-yellow-50 dark:text-white min-h-screen">
      {/* Image Banner */}
      <div className="h-[360px] overflow-hidden rounded-b-3xl shadow-lg relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="container max-w-4xl mx-auto px-6 py-10">
        {/* Meta info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-700 dark:text-gray-300 mb-6 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <FaUser className="text-blue-600 dark:text-blue-400" />
            <span className="font-semibold">{userName || "Ẩn danh"}</span>
          </div>

          <div className="flex items-center space-x-3">
            <FaCalendarAlt className="text-orange-500 dark:text-orange-400" />
            <span>
              {createDate
                ? new Date(createDate).toLocaleDateString("vi-VN")
                : "Chưa có ngày"}
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-blue-700 dark:text-blue-300 mb-8 drop-shadow-md">
          {title || "Tiêu đề không xác định"}
        </h1>

        {/* Content */}
        <div className="prose prose-blue prose-lg max-w-full dark:prose-invert">
          {parse(content || "<p>Nội dung chưa được cập nhật.</p>")}
        </div>

        {/* Tags */}
        <div className="mt-10">
          <h3 className="flex items-center text-xl font-semibold text-orange-600 mb-4">
            <FaTag className="mr-2" /> Hashtags
          </h3>
          <div className="flex flex-wrap gap-3">
            {tags.length > 0 ? (
              tags.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="bg-orange-100 text-orange-800 px-4 py-1 rounded-full font-medium cursor-pointer hover:bg-orange-200 transition"
                >
                  #{tag}
                </span>
              ))
            ) : (
              <p className="text-gray-500 italic">Không có hashtags nào</p>
            )}
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className=" mx-auto px-6 py-6 border-t border-gray-300 dark:border-gray-700">
        <CommentComponent idPost={id} />
      </div>

      {/* Related Blogs */}
      <div className=" mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-6">
          Bài viết liên quan
        </h2>
        <BlogsComp />
      </div>
    </div>
  );
};

export default BlogsDetails;
