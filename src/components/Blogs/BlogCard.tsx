import { Link } from "react-router-dom";

interface BlogCardProps {
  id: number;
  image: string;
  createDate: string;
  title: string;
  content: string;
  tags: string[];
  categories: string[];
  userName: string;
  totalLike: number;
  status: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  image,
  createDate,
  title,
  content,
  userName,
  tags,
}) => {
  return (
    <Link
      to={`/blogs/${title}`}
      onClick={() => {
        window.scrollTo(0, 0);
      }}
      state={{ id, image, tags, createDate, title, content, userName }}
    >
      <div className="p-4 shadow-lg transition-all duration-500 hover:shadow-xl dark:bg-slate-950 dark:text-white">
        <div className="overflow-hidden">
          <img
            src={image}
            alt="Blog Thumbnail"
            className="mx-auto h-[250px] w-full object-cover transition duration-700 hover:skew-x-2 hover:scale-110"
          />
        </div>
        <div className="flex justify-between pt-2 text-slate-600">
          <p>{new Date(createDate).toLocaleDateString("Vi-VN")}</p>
          <p className="line-clamp-1">
            By <strong>{userName}</strong>
          </p>
        </div>
        <div className="space-y-2 py-3">
          <h1 className="line-clamp-1 font-bold">{title}</h1>
          <p className="line-clamp-2">{content}</p>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
