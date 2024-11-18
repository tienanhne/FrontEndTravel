import { IoLocationSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

const PlaceCard = ({
  id,
  img,
  title,
  location,
  description,
  rating,
  type,
}: {
  id: number;
  img: string;
  title: string;
  location: string;
  description: string;
  rating: number;
  type: string;
}) => {
  return (
    <>
      <Link
        to={`/best-places/${id}`}
        onClick={() => {
          window.scrollTo(0, 0);
          window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }}
        state={{id, img, title, description, location, type, rating }}
      >
        <div className="p-4 shadow-lg transition-all duration-500 hover:shadow-xl dark:bg-slate-950 dark:text-white">
          <div className="overflow-hidden">
            <img
              src={img}
              alt="No image"
              className="mx-auto h-[220px] w-full object-cover transition duration-700 hover:skew-x-2 hover:scale-110"
            />
          </div>

          <div className="space-y-2 p-3">
            <h1 className="line-clamp-1 font-bold text-xl">{title}</h1>
            <div className="flex items-center gap-2 opacity-70">
              <IoLocationSharp />
              <span>{location}</span>
            </div>
            <p className="line-clamp-2">{description}</p>
            <div className="flex items-center justify-between border-t-2 py-3 !mt-3">
              <div className="opacity-70">
                <p>{type.toLocaleUpperCase()}</p>
              </div>
              <div className="flex items-center ml-2 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={i < (rating || 0) ? "#FFD700" : "#E5E7EB"}
                    className="w-5 h-5"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default PlaceCard;
