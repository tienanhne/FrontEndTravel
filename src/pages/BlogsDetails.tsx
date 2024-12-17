import { useLocation } from "react-router-dom";
import BlogsComp from "../components/Blogs/BlogsComp";
import CommentComponent from "../components/Comments/CommentSection";

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
    <div className="pt-20 dark:bg-gray-900 bg-gray-50 dark:text-white">
      <div className="h-[300px] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="mx-auto h-[300px] w-full object-cover transition duration-700 hover:scale-110"
        />
      </div>
      <div className="container">
        <p className="text-slate-600 dark:text-dark text-sm py-3">
          Viết bởi <strong>{userName}</strong> vào{" "}
          {new Date(createDate).toLocaleDateString("vi-VN")}
        </p>

        <h1 className="text-2xl font-semibold">{title}</h1>
        <p>{content}</p>

        <div className="mt-4 flex items-center">
          <h3 className="font-semibold mr-2">Hastag:</h3>
          <div className="flex flex-wrap gap-2">
            {tags.length > 0 ? (
              tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light rounded-full px-3 py-1 text-sm"
                >
                  {tag}
                </span>
              ))
            ) : (
              <p>No tags available</p>
            )}
          </div>
        </div>
      </div>

      {/* CommentComponent */}
      <CommentComponent idPost={id} />
      <BlogsComp />
    </div>
  );
};

export default BlogsDetails;
