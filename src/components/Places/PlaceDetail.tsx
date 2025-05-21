import { useLocation, useParams } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";
import ReviewCarousel from "./ReviewCarousel";
import React, { useEffect } from "react";
import parse from 'html-react-parser';
type Introduce = {
  title: string;
  content: string;
  collections: {
    id: number;
    url: string;
  }[];
}
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
const {id: locationId} = useParams();
  const { id, img, title, description, location, type, rating } = locationState;
  console.log(locationState);
  const [isLoading, setIsLoading] = React.useState(true);
  const [introduce, setIntroduce] = React.useState<Introduce | null>(null);
  useEffect(() => {
    const fetchIntroduce = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_API}/location/introduces/${locationId}/location`
        );
        const data = await response.json();
        setIntroduce(data.result);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching introduce:", error);
      }
    };

    fetchIntroduce();

  }, []);
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
          {introduce && <div className='flex justify-center items-center py-4'>
                    <div className='w-[80%] dark:bg-black dark:text-white bg-white shadow-lg rounded-lg p-4'>
                        <h2 className='text-2xl font-bold mb-4'>{introduce.title}</h2>
                        <div className='text-gray-700 mb-4'>
                            {parse(introduce.content)}
                        <div className='flex  items-center gap-4'>
                             {introduce.collections && introduce.collections.length > 0  && introduce.collections.map((item: any) => (   <img src={item.url} alt="Location" className='w-[300px] h-[200px] rounded-lg mt-4' />))}
                        </div>
                        
                    </div>
                </div>
                </div>}

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
