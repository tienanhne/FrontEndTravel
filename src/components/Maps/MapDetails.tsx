import React, { useEffect } from "react";
import { Result } from "../../redux/type";
import CalculatorPlaces from "./CalculatorPlaces";
import { RootState } from "../../redux/store/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setTotalTime } from "./destinationsSlice";

const formatTotalTime = (totalTime: number): string => {
  if (totalTime < 60) {
    return `${totalTime} phút`;
  } else if (totalTime < 1440) {
    const hours = Math.floor(totalTime / 60);
    const minutes = totalTime % 60;
    return `${hours} giờ ${minutes} phút`;
  } else {
    const days = Math.floor(totalTime / 1440);
    const hours = Math.floor((totalTime % 1440) / 60);
    const minutes = totalTime % 60;

    return `${days} ngày ${hours} giờ ${minutes} phút`;
  }
};

interface MapDetailsProps {
  day: Result;
  onBack: () => void;
}

const MapDetails: React.FC<MapDetailsProps> = ({ day, onBack }) => {
  const totalTime = useSelector(
    (state: RootState) => state.destinations.totalTime
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTotalTime(0));
  }, [dispatch]);

  return (
    <div className="p-6 bg-white dark:bg-slate-600 rounded-xl shadow-xl max-w-4xl mx-auto">
      <h3 className="text-2xl font-extrabold text-center mb-6 text-primary dark:text-white">
        Chi tiết chuyến đi - {new Date(day.day).toLocaleDateString("vi-VN")}
      </h3>

      <div className="relative border-l-4 border-primary dark:border-secondary space-y-5 pl-4">
        {day?.destinations.map((destination, index, arrDestination) => {
          return index < arrDestination.length - 1 ? (
            <CalculatorPlaces
              key={index}
              place={destination}
              nextPlace={arrDestination[index + 1]}
            />
          ) : (
            <CalculatorPlaces key={index} place={destination} />
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={onBack}
          className="bg-gradient-to-r from-primary w-32 to-secondary hover:from-secondary hover:to-primary transition-all duration-500 text-white py-3 px-6 rounded-lg shadow-lg transform hover:scale-105"
        >
          Trở về
        </button>
        <div className="text-md font-bold text-primary dark:text-white bg-gray-200 dark:bg-gray-700 py-3 px-6 rounded-lg shadow-md">
           Thời gian ước tính: {formatTotalTime(totalTime)}
        </div>
      </div>
    </div>
  );
};

export default MapDetails;
