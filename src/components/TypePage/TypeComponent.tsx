/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { deselectType, selectType, setSelectedTypes } from "./TypeSlice";

// Define the type for TravelType
export type TravelType = {
  label: string;
  image: string;
  vietnameseLabel: string;
};
const vietnameseLabels: Record<string, string> = {
  TOURIST_ATTRACTION: "Điểm tham quan",
  RESTAURANT: "Nhà hàng",
  SHOPPING: "Mua sắm",
  PARK: "Công viên",
  CULTURAL_SITE: "Di tích văn hóa",
  ACCOMMODATION: "Chỗ ở",
  ENTERTAINMENT: "Giải trí",
  TRANSPORT_HUB: "Điểm giao thông",
  EVENT: "Sự kiện",
  ADVENTURE: "Phiêu lưu",
  HEALTH_WELLNESS: "Sức khỏe & Thể dục",
  EDUCATIONAL: "Giáo dục",
  FUNCTIONAL: "Chức năng",
  ADMINISTRATIVE: "Hành chính",
};

// const travelCategories = {
//   CULTURAL_TOURISM: {
//     vietnameseName: "Du lịch văn hóa",
//     types: ["CULTURAL_SITE", "TOURIST_ATTRACTION"],
//   },
//   RELAXATION_TOURISM: {
//     vietnameseName: "Du lịch nghỉ dưỡng",
//     types: ["ACCOMMODATION", "PARK", "HEALTH_WELLNESS"],
//   },
//   EXPLORATION_TOURISM: {
//     vietnameseName: "Du lịch khám phá",
//     types: ["TOURIST_ATTRACTION", "ADVENTURE"],
//   },
//   ECO_TOURISM: {
//     vietnameseName: "Du lịch sinh thái",
//     types: ["PARK"],
//   },
//   ADVENTURE_TOURISM: {
//     vietnameseName: "Du lịch mạo hiểm",
//     types: ["ADVENTURE"],
//   },
//   CULINARY_TOURISM: {
//     vietnameseName: "Du lịch ẩm thực",
//     types: ["RESTAURANT"],
//   },
//   SPIRITUAL_TOURISM: {
//     vietnameseName: "Du lịch tâm linh",
//     types: ["CULTURAL_SITE"],
//   },
//   EDUCATIONAL_TOURISM: {
//     vietnameseName: "Du lịch giáo dục",
//     types: ["EDUCATIONAL"],
//   },
//   ISLAND_TOURISM: {
//     vietnameseName: "Du lịch biển đảo",
//     types: ["TOURIST_ATTRACTION"],
//   },
//   COMMUNITY_TOURISM: {
//     vietnameseName: "Du lịch cộng đồng",
//     types: ["FUNCTIONAL"],
//   },
//   FESTIVAL_TOURISM: {
//     vietnameseName: "Du lịch mùa lễ hội",
//     types: ["EVENT"],
//   },
//   SPORT_TOURISM: {
//     vietnameseName: "Du lịch thể thao",
//     types: ["HEALTH_WELLNESS"],
//   },
//   HONEYMOON_TOURISM: {
//     vietnameseName: "Du lịch tuần trăng mật",
//     types: ["ACCOMMODATION"],
//   },
// };

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
          vietnameseLabel: vietnameseLabels[type.label] || type.label,
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
    <div className="grid grid-cols-2 md:grid-cols-3 max-h-[300px] gap-6 overflow-y-auto no-scrollbar px-4">
      {travelTypes.map((type) => (
        <div
          key={type.label}
          onClick={() => handleSelectType(type.label)}
          className={`flex flex-col items-center p-4 border rounded-lg shadow-md transition transform cursor-pointer ${
            selectedTypes.includes(type.label)
              ? "bg-gradient-to-r from-secondary-light to-primary-light text-white scale-105"
              : "bg-white dark:bg-slate-600 text-gray-700 dark:text-white hover:bg-gray-100 hover:scale-105 hover:shadow-lg"
          }`}
        >
          <img
            src={type.image}
            alt={type.vietnameseLabel}
            className="w-20 h-20 rounded-md object-cover mb-2"
          />
          <span className="text-lg font-semibold">{type.vietnameseLabel}</span>
        </div>
      ))}
    </div>
  );
};
