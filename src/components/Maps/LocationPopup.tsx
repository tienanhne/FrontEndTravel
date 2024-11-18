/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import WeatherSmartCard from "../Weather/WeatherChart";
import IMG4 from "../../assets/places/place4.jpg";
import { toast } from "react-toastify";

interface LocationPopupProps {
  lat: number;
  lng: number;
  selectedDate: string;
}

interface LocationData {
  display_name: string;
  type: string;
  thumbnail?: { url: string };
  starRate: number;
  place_id: number;
}

interface ReviewData {
  id: number;
  starRate: number;
  content: string;
  images: { id: number; url: string }[];
  user: { id: string; userName: string; avatar: string };
}

const LocationPopup: React.FC<LocationPopupProps> = ({
  lat,
  lng,
  selectedDate,
}) => {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [userReview, setUserReview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);
  const [reviewId, setReviewId] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchLocationData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8888/api/v1/location/locations/lookup?lon=${lng}&lat=${lat}`,
          { signal: abortController.signal }
        );
        const data = response.data.result;
        setLocationData({
          display_name: data.display_name,
          type: data.type,
          thumbnail: data.thumbnail,
          starRate: data.starRate,
          place_id: data.place_id,
        });
        setLoading(false);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          setError("Failed to fetch location data");
        }
        setLoading(false);
      }
    };

    fetchLocationData();
    return () => {
      abortController.abort();
    };
  }, [lat, lng]);

  useEffect(() => {
    const fetchReviewData = async () => {
      if (!locationData) return;

      try {
        const response = await axios.get(
          `http://localhost:8888/api/v1/review/reviews/detail/${locationData.place_id}`
        );
        const data = response.data.result;

        if (data && data.user) {
          setReviewData(data);
          setReviewId(data.id);
          setUserRating(data.starRate);
          setUserReview(data.content);
          setHasReviewed(true);
        } else {
          setHasReviewed(false);
        }
      } catch (err) {
        setError("Failed to fetch review data");
      }
    };

    if (locationData) {
      fetchReviewData();
    }
  }, [locationData]);

  const handleRatingChange = (rating: number) => {
    setUserRating(rating);
  };

  const handleReviewSubmit = async () => {
    if (!locationData) return;

    const reviewData = {
      locationId: locationData.place_id,
      content: userReview,
      starRate: userRating,
      imageIds: null,
    };

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      let response;
      if (hasReviewed && reviewId) {
        response = await axios.put(
          `http://localhost:8888/api/v1/review/reviews/${reviewId}`,
          reviewData
        );
        toast.success("Cập nhật nhận xét thành công");
      } else {
        response = await axios.post(
          "http://localhost:8888/api/v1/review/reviews",
          reviewData
        );
        toast.success("Nhận xét địa điểm thành công");

        setReviewId(response.data.id);
      }

      console.log("Review response: ", response.data);
      setIsSubmitting(false);
      setUserReview("");
      setUserRating(0);

      const updatedLocationResponse = await axios.get(
        `http://localhost:8888/api/v1/location/locations/lookup?lon=${lng}&lat=${lat}`
      );
      const updatedLocationData = updatedLocationResponse.data.result;
      setLocationData({
        display_name: updatedLocationData.display_name,
        type: updatedLocationData.type,
        thumbnail: updatedLocationData.thumbnail,
        starRate: updatedLocationData.starRate,
        place_id: updatedLocationData.place_id,
      });

      setHasReviewed(true);
    } catch (err) {
      setSubmitError("Failed to submit or update review");
      toast.error("Cập nhật nhận xét thất bại");
      setIsSubmitting(false);
    }
  };

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto no-scrollbar">
      <h2
        title={locationData?.display_name || "Unknown location"}
        className="text-xl font-semibold text-gray-900 truncate"
      >
        {locationData?.display_name || "No name"}
      </h2>
      <img
        src={locationData?.thumbnail?.url || IMG4}
        alt={locationData?.display_name || "No name"}
        className="w-full h-32 object-cover rounded-lg shadow-md"
      />
      <p className="text-gray-700 ">
        Type:{" "}
        <strong>{locationData?.type.toLocaleUpperCase() || "Unknown"}</strong>
      </p>
      <div className="flex items-center">
        <strong className="font-medium text-gray-700">Đánh giá:</strong>
        <div className="flex items-center ml-2 space-x-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={i < (locationData?.starRate || 0) ? "#FFD700" : "#E5E7EB"}
              className="w-5 h-5"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>
        <span className="ml-2 text-gray-600">
          ({locationData?.starRate || 0})
        </span>
      </div>

      {/* Existing review */}
      {hasReviewed ? (
        <div className="border-t pt-4 border-gray-200">
          <h3 className="text-md text-gray-800">Chỉnh sửa nhận xét của bạn</h3>
          <textarea
            className="w-full h-16 p-1 mt-2 border rounded-md resize-none overflow-y-auto"
            placeholder="Nhận xét của bạn.."
            value={userReview}
            onChange={(e) => setUserReview(e.target.value)}
          ></textarea>

          <div className="mt-2">
            <p className="text-gray-800">Đánh giá của bạn:</p>
            <div className="flex space-x-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={i < userRating ? "#FFD700" : "#E5E7EB"}
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => handleRatingChange(i + 1)}
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
          </div>

          {submitError && <div className="text-red-500">{submitError}</div>}

          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded-lg mt-4"
            onClick={handleReviewSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Cập nhật nhận xét"}
          </button>
        </div>
      ) : (
        <div className="border-t pt-4 border-gray-200">
          <h3 className="text-md text-gray-800">Nhận xét của bạn</h3>
          <textarea
            className="w-full h-16 p-1 mt-2 border rounded-md resize-none overflow-y-auto"
            placeholder="Nhận xét của bạn.."
            value={userReview}
            onChange={(e) => setUserReview(e.target.value)}
          ></textarea>

          <div className="mt-2">
            <p className="text-gray-800">Đánh giá:</p>
            <div className="flex space-x-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={i < userRating ? "#FFD700" : "#E5E7EB"}
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => handleRatingChange(i + 1)}
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
          </div>

          {submitError && <div className="text-red-500">{submitError}</div>}

          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded-lg mt-4"
            onClick={handleReviewSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Gửi nhận xét"}
          </button>
        </div>
      )}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <WeatherSmartCard
          lat={lat}
          lng={lng}
          selectedDate={new Date(selectedDate.toString())}
        />
      </div>
    </div>
  );
};

export default LocationPopup;
