import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { RootState } from "../../redux/store/store";
import { setBlogs, addBlogs } from "./BlogsSlice";
import BlogCard from "./BlogCard";
import BlogCardSkeleton from "./BlogCardSkeleton";

const limit = 6;

interface BlogsCompProps {
  isLoadMore: boolean;
}

const BlogsComp: React.FC<BlogsCompProps> = ({ isLoadMore }) => {
  const dispatch = useDispatch();
  const blogs = useSelector((state: RootState) => state.blogs.blogs);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchBlogs = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8888/api/v1/blog/blogs?page=${pageNumber}&limit=${limit}`
      );
      if (pageNumber === 1) {
        dispatch(setBlogs(response.data.result.data));
      } else {
        dispatch(addBlogs(response.data.result.data));
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(page);
  }, [page, dispatch]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="dark:bg-gray-900 dark:text-white py-10 bg-gray-50">
      <section data-aos="fade-up" className="container">
        <h1 className="border-l-8 border-primary/50 py-2 pl-4 text-3xl font-bold">
          Bài viết về địa điểm du lịch
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {blogs.map((item) => (
            <BlogCard
              key={item.id}
              id={item.id}
              image={item.thumbnail.url}
              createDate={item.createDate}
              title={item.title}
              content={item.content}
              userName={item.userName}
              totalLike={item.totalLike}
              status={item.status}
              tags={item.tags}
              categories={item.categories}
            />
          ))}
          {loading &&
            [...Array(limit)].map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
        </div>
        {isLoadMore && blogs.length > 6 ? (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleLoadMore}
              className="py-3 px-6 bg-white text-primary font-semibold rounded-lg shadow-lg hover:bg-primary hover:text-white hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
              disabled={loading}
            >
              {loading ? "Đang tải..." : "Xem thêm"}
            </button>
          </div>
        ) : (
          ""
        )}
      </section>
    </div>
  );
};

export default BlogsComp;
