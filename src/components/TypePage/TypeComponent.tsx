/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { deselectType, selectType, setSelectedTypes } from "./TypeSlice";

// Define the type for TravelType
export type TravelType = {
  label: string;
  image: string;
  name: string;
};

export const TravelTypeSelection = () => {
  const dispatch = useDispatch();
  const selectedTypes = useSelector(
    (state: RootState) => state.travelType.selectedTypes
  );
  const [travelTypes, setTravelTypes] = useState<TravelType[]>([]);
  const [userHobbies, setUserHobbies] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_API}/profile/users/hobbies`)
      .then((response) => {
        const fetchedTypes = response.data.result.map((type: any) => ({
          label: type.label,
          image: type.image,
          name: type.name,
        }));
        setTravelTypes(fetchedTypes);
      })
      .catch((error) => {
        console.error("Error fetching travel types:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_API}/profile/users/my-profile`)
      .then((response) => {
        const hobbies = response.data.result.hobbies || [];
        setUserHobbies(hobbies);
        dispatch(setSelectedTypes(hobbies));
      })
      .catch((error) => {
        console.error(`Error fetching user profile:`, error);
      });
  }, [dispatch]);

  const handleSelectType = (typeLabel: string) => {
    if (selectedTypes.includes(typeLabel)) {
      dispatch(deselectType(typeLabel));
    } else {
      dispatch(selectType(typeLabel));
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-4 p-4 max-h-[300px] overflow-y-auto no-scrollbar">
      {travelTypes.map((type) => (
        <div
          key={type.label}
          onClick={() => handleSelectType(type.label)}
          className={`flex flex-col items-center p-4 sm:p-2 border rounded-lg shadow-md transition transform cursor-pointer ${
            selectedTypes.includes(type.label)
              ? "bg-gradient-to-r from-secondary-light to-primary-light text-white scale-105"
              : "bg-white dark:bg-slate-600 text-gray-700 dark:text-white hover:bg-gray-100 hover:scale-105 hover:shadow-lg"
          }`}
        >
          <img
            src={type.image}
            alt={type.name}
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-md object-cover mb-2"
          />
          <span className="text-xs sm:text-sm md:text-base font-semibold text-center">
            {type.name}
          </span>
        </div>
      ))}
    </div>
  );
};
