/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Destination } from "../../redux/type";
import L from "leaflet";
import { useDispatch } from "react-redux";
import { resetTotalTime, setTotalTime } from "./destinationsSlice";

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const CalculatorPlaces = ({
  place,
  nextPlace,
}: {
  place: Destination;
  nextPlace?: Destination;
}) => {
  const [distance, setDistance] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (nextPlace) {
      setLoading(true);
      const routingService = L.Routing.osrmv1();
      dispatch(resetTotalTime());
      routingService.route(
        [
          L.Routing.waypoint(
            L.latLng(
              parseFloat(place.location.lat),
              parseFloat(place.location.lon)
            )
          ),
          L.Routing.waypoint(
            L.latLng(
              parseFloat(nextPlace.location.lat),
              parseFloat(nextPlace.location.lon)
            )
          ),
        ],
        (err, routes) => {
          if (err) {
            console.error(err);
            setLoading(false);
            return;
          }
  
          if (routes && routes.length > 0) {
            const route = routes[0];
            const distanceInMeters = route.summary.totalDistance;
            const timeInSeconds = route.summary.totalTime;
  
            setDistance(Math.floor(distanceInMeters / 1000) + " km");
            setTime(Math.ceil(timeInSeconds / 60) + " phút");
  
            dispatch(setTotalTime(Math.ceil(timeInSeconds / 60)));
        }
          setLoading(false);
        }
      );
    }
  }, [nextPlace]);
  

  return (
    <div className="relative flex items-start space-x-4">
      <div className="flex-grow pl-8">
        <div className="text-lg font-semibold text-primary dark:text-white">
          {truncateText(place.location.display_name, 50)}
        </div>
        {nextPlace && (
          <div className="text-sm text-secondary dark:text-gray-300 mt-3">
            <span className="font-medium">Số km: </span>
            {isLoading ? "Loading..." : distance} |{" "}
            <span className="font-medium">Thời gian: </span>
            {isLoading ? "Loading..." : time}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculatorPlaces;
