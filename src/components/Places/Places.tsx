import { useEffect, useState } from "react";
import axios from "axios";
import PlaceCard from "./PlaceCard";
import PlaceCardSkeleton from "./PlaceCardSkeleton";

interface PlaceData {
  place_id: number;
  name: string;
  type: string;
  address: {
    city: string;
  };
  thumbnail?: {
    url: string;
  };
  starRate: number;
}

const mapPlaceTypeToVietnamese = (type: string): string => {
  const typeMap: { [key: string]: string } = {
    TOURIST_ATTRACTION: "Địa điểm du lịch",
    RESTAURANT: "Nhà hàng",
    SHOPPING: "Khu mua sắm",
    PARK: "Công viên",
    CULTURAL_SITE: "Di tích văn hóa",
    ACCOMMODATION: "Nơi lưu trú",
    ENTERTAINMENT: "Giải trí",
    TRANSPORT_HUB: "Trạm trung chuyển",
    EVENT: "Sự kiện",
    ADVENTURE: "Phiêu lưu",
    HEALTH_WELLNESS: "Sức khỏe & Thư giãn",
    EDUCATIONAL: "Giáo dục",
    FUNCTIONAL: "Tiện ích",
    ADMINISTRATIVE: "Hành chính",
  };

  return typeMap[type] || "Không xác định";
};

const Places = () => {
  const [placesData, setPlacesData] = useState<PlaceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlacesData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_API}/location/locations/news?limit=6`
        );
        const data = response.data.result;
        setPlacesData(data);
        setLoading(true);
      } catch (err) {
        setError("Failed to fetch places data");
        setLoading(false);
      }
    };

    fetchPlacesData();
  }, []);

  if (!loading) {
    return (
      <div className="dark:bg-gray-900 dark:text-white bg-gray-50 py-10">
        <section data-aos="fade-up" className="container">
          <h1 className="my-8 border-l-8 border-primary/50 py-2 pl-2 text-3xl font-bold">
            Đang tải địa điểm...
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <PlaceCardSkeleton key={index} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="dark:bg-gray-900 dark:text-white bg-gray-50 py-10">
      <section data-aos="fade-up" className="container">
        <h1 className="my-8 border-l-8 border-primary/50 py-2 pl-2 text-3xl font-bold">
          Top địa điểm tốt nhất
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {placesData.map((place, index) => (
            <PlaceCard
              key={index}
              id={place.place_id}
              img={place.thumbnail?.url || "path_to_default_image.jpg"}
              title={place.name}
              location={place.address.city || "Unknown location"}
              description="Nhấn vào thẻ này để xem thêm thông tin chi tiết về địa điểm, hình ảnh, đánh giá và các hoạt động nổi bật tại đây."
              rating={place.starRate}
              type={mapPlaceTypeToVietnamese(place.type)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Places;
