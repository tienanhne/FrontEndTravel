import { useLocation } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";
import ReviewCarousel from "./ReviewCarousel";

const PlaceDetail = () => {
  const locationState = useLocation().state as {
    id: number;
    img: string;
    title: string;
    description: string;
    location: string;
    type: string;
    rating: number;
  };

  const { id, img, title, description, location, type, rating } = locationState;
  console.log(locationState);
  return (
    <div className="pt-16 dark:bg-gray-900 dark:text-white">
      <div
        className="h-64 bg-cover object-cover bg-center"
        style={{ backgroundImage: `url(${img})` }}
      />
      <div className="container dark:bg-gray-900 overflow-hidden">
        <div className="p-6">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">{title}</h1>

          <div className="flex items-center gap-2 mb-4 text-gray-600 dark:text-gray-400">
            <IoLocationSharp className="text-xl" />
            <span>{location}</span>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            {description}
          </p>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center space-x-2">
              <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                Type:
              </p>
              <p className="text-lg dark:text-white">{type}</p>
            </div>

            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={i < rating ? "#FFD700" : "#E5E7EB"}
                  className="w-6 h-6"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                ({rating}/5)
              </span>
            </div>
          </div>

          <ReviewCarousel locationId={id} />
        </div>
      </div>
    </div>
  );
};

export default PlaceDetail;
