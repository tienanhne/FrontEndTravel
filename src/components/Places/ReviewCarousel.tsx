import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import { FaStar } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Review {
  id: number;
  starRate: number;
  content: string;
  images: { id: number; url: string }[];
  user: { id: string; userName: string; avatar: string };
}

interface ReviewCarouselProps {
  locationId: number;
}

const ReviewCarousel: React.FC<ReviewCarouselProps> = ({ locationId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_API}/review/reviews/${locationId}/location?page=1&limit=12`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setReviews(response.data.result.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch reviews");
        setLoading(false);
      }
    };

    fetchReviews();
  }, [locationId]);

  if (loading) {
    return <div className="mt-3 text-md">Chưa có đánh giá</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    centerMode: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="review-carousel">
      <hr className="my-3" />
      <h2 className="text-xl text-primary mb-4">Reviews</h2>
      {reviews.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-300">
          Không có đánh giá nào
        </div>
      ) : (
        <Slider {...settings}>
          {reviews.map((review) => (
            <div key={review.id} className="p-4">
              <div className="bg-white rounded-lg shadow-lg p-4 dark:bg-gray-800">
                <div className="flex items-center mb-4">
                  <img
                    src={review.user.avatar || "/default-avatar.png"}
                    alt={review.user.userName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <p className="font-medium dark:text-white">
                      {review.user.userName}
                    </p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          color={i < review.starRate ? "#FFD700" : "#E5E7EB"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {review.content}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default ReviewCarousel;
