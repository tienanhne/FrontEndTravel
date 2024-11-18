/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

interface PlaceSearchProps {
  lat: number;
  lng: number;
  id: number;
}

const PlaceSearchComponent: React.FC<PlaceSearchProps> = ({ lat, lng, id }) => {
  const [type, setType] = useState("");
  const [radius, setRadius] = useState(10);
  const [places, setPlaces] = useState([]); 
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null);
  const idTrip = useParams();
  const results = useSelector((state: RootState) => state.destinations.results);

  const handleSearch = async () => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.get(
        `http://localhost:8888/api/v1/location/locations/radius`,
        {
          params: {
            lon: lng,
            lat: lat,
            radius: radius,
            type,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPlaces(response.data.result);
      console.log(idTrip);

    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleReplacePlace = async (placeId: number) => {
    const token = localStorage.getItem("accessToken");
      if (!token || !id) {
      console.error("Không có token hoặc id địa điểm.");
      return;
    }
  
    try {
      const response = await axios.put(
        `http://localhost:8888/api/v1/trip/itineraries/destination/${id}`,  
        {
          locationId: placeId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      toast.success("Thay thế địa điểm thành công")
    } catch (error) {
      toast.error("Lỗi khi thay thế địa điểm");
    }
  };
  



  return (
    <div className="p-3 max-w-md w-[290px] mx-auto max-h-96 overflow-y-auto no-scrollbar mt-8">
      <h2 className="text-2xl font-bold text-teal-600 mb-6 text-center">
        Khám phá địa điểm gần bạn
      </h2>
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Thể loại</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <option value="TOURIST_ATTRACTION">Điểm du lịch</option>
          <option value="RESTAURANT">Nhà hàng</option>
          <option value="SHOPPING">Mua sắm</option>
          <option value="DRINKING_WATER">Nước uống</option>
          <option value="PARK">Công viên</option>
          <option value="CULTURAL_SITE">Địa điểm văn hóa</option>
          <option value="ACCOMMODATION">Chỗ ở</option>
          <option value="ENTERTAINMENT">Giải trí</option>
          <option value="TRANSPORT_HUB">Trạm vận chuyển</option>
          <option value="EVENT">Sự kiện</option>
          <option value="ADVENTURE">Phiêu lưu</option>
          <option value="HEALTH_WELLNESS">Sức khỏe</option>
          <option value="EDUCATIONAL">Giáo dục</option>
          <option value="FUNCTIONAL">Chức năng</option>
          <option value="ADMINISTRATIVE">Hành chính</option>
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Khoảng cách: {radius} km
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full"
          style={{
            background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${
              (radius / 50) * 100
            }%, #e5e7eb ${(radius / 50) * 100}%, #e5e7eb 100%)`,
          }}
        />
      </div>
      <button
        onClick={handleSearch}
        className="w-full bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors"
      >
        Tìm kiếm
      </button>
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-teal-600 mb-4">
          Danh sách địa điểm
        </h3>
        <ul className="space-y-4">
          {Array.isArray(places) && places.length > 0 ? (
            places.map((place: any) => (
              <li
                key={place.place_id}
                className="w-full max-w-md p-4 overflow-hidden bg-gray-50 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow mx-auto"
                style={{ width: "275px" }}
              >
                <div className="flex items-center gap-4">
                  {place.thumbnail?.url && (
                    <img
                      src={place.thumbnail.url}
                      alt={place.thumbnail.caption || "Image"}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-base font-bold text-gray-800 break-words">
                      {place.name}
                    </h4>
                    <p className="text-sm text-gray-500 break-words">
                      {place.display_name}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-between">
                  <button className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700">
                    Chọn
                  </button>
                  <button
                    onClick={() => handleReplacePlace(place.place_id)}
                    className="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600"
                  >
                    Thay thế
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">
              Không tìm thấy địa điểm nào.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PlaceSearchComponent;
