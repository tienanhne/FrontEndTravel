/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useRecommendDestinations.ts
import { useState } from "react";

export const useRecommendDestinations = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async (lat: string, lon: string) => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      console.log(JSON.stringify({ current_lat: lat, current_lon: lon }));

      const response = await fetch(
        `${import.meta.env.VITE_BASE_API}/recommend/recommends`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ current_lat: lat, current_lon: lon }),
        }
      );
      const data = await response.json();
      console.log(data)
      setRecommendations(data.result.recommends.slice(0, 6));
    } catch (err: any) {
      setError("Lỗi khi lấy gợi ý địa điểm");
    } finally {
      setLoading(false);
    }
  };

  return { recommendations, setRecommendations, fetchRecommendations, loading, error };
};
