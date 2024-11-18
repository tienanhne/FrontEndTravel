import React, { useEffect, useState } from "react";
import TravelCard from "./TravelCard";
import axios from "axios";
import { Location } from "../../redux/type";
import { useSelector } from "react-redux";
import { State } from "../../redux/store/store";
import { useUser } from "../../context/UserContext";
import TravelCardSkeleton from "./TravelCardSkeleton";

interface Trip {
  id: number;
  title: string;
  startDate: string;
  permission: string;
  endDate: string;
  image: string;
  location: Location;
}

const HistoryTravel: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [visibleTrips, setVisibleTrips] = useState<number>(6);
  const { account: user } = useSelector((state: State) => state.user);
  const { handleOrderPopup } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          "http://localhost:8888/api/v1/trip/trips/my-trip",
          config
        );
        const data: Trip[] = response.data.result;
        setTrips(data);
        setLoading(true);
      } catch (error) {
        console.error("Error fetching trips:", error);
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (!user) {
    sessionStorage.setItem("redirect", "/history-travel");
  }

  const loadMoreTrips = () => {
    setVisibleTrips((prev) => prev + 6);
  };
  if (!loading) {
    return (
      <div className="dark:bg-gray-900 dark:text-white py-10">
        {!user ? (
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="mb-6 text-lg font-semibold text-gray-700">
                Bạn cần đăng nhập để xem nội dung chuyến đi của bạn
              </div>
              <button
                onClick={handleOrderPopup}
                className="px-6 py-3 bg-primary text-white rounded-lg shadow-md hover:bg-secondary transition-colors"
              >
                Đăng nhập
              </button>
            </div>
          </div>
        ) : (
          <section data-aos="fade-up" className="container">
            <h1 className="my-8 border-l-8 border-primary/50 py-2 pl-2 text-3xl font-bold">
              Chuyến đi của tôi
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {trips.slice(0, visibleTrips).map((trip) => (
                <TravelCardSkeleton key={trip.id} />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }
  return (
    <div className="dark:bg-gray-900 dark:text-white py-10">
      {!user ? (
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="mb-6 text-lg font-semibold text-gray-700">
              Bạn cần đăng nhập để xem nội dung chuyến đi của bạn
            </div>
            <button
              onClick={handleOrderPopup}
              className="px-6 py-3 bg-primary text-white rounded-lg shadow-md hover:bg-secondary transition-colors"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      ) : (
        <section data-aos="fade-up" className="container">
          <h1 className="my-8 border-l-8 border-primary/50 py-2 pl-2 text-3xl font-bold">
            Chuyến đi của tôi
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {trips.slice(0, visibleTrips).map((trip) => (
              <TravelCard
                id={trip.id}
                key={trip.id}
                title={trip.title}
                startDate={trip.startDate}
                endDate={trip.endDate}
                permission={trip.permission}
                location={trip.location}
              />
            ))}
          </div>
          {visibleTrips < trips.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMoreTrips}
                className="py-3 px-6 bg-white text-primary font-semibold rounded-lg shadow-lg hover:bg-primary hover:text-white hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
              >
                Xem thêm
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default HistoryTravel;
