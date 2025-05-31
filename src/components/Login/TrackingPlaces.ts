// Api/checkin.ts
import axios from "axios";

export const trackingPlaces = async (place_id: number[]) => {
  const accessToken = localStorage.getItem("accessToken");
  return await axios.post(
    `${import.meta.env.VITE_BASE_API}/recommend/recommends/check`,
    { place_id },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};
