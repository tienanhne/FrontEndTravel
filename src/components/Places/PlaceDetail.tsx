import { useLocation, useParams } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";
import ReviewCarousel from "./ReviewCarousel";
import React, { useEffect } from "react";
import parse from "html-react-parser";
type Introduce = {
  title: string;
  content: string;
  collections: {
    id: number;
    url: string;
  }[];
};
const PlaceDetail = () => {
  const locationState = useLocation().state as {
    id: number;
    img: string;
    title: string;
    description: string;
    location: string;
    type: string;
    rating: number;
  };
  const { id: locationId } = useParams();
  const { id, img, title, description, location, type, rating } = locationState;
  console.log(locationState);
  const [isLoading, setIsLoading] = React.useState(true);
  const [introduce, setIntroduce] = React.useState<Introduce | null>(null);
  useEffect(() => {
    const fetchIntroduce = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BASE_API
          }/location/introduces/${locationId}/location`
        );
        const data = await response.json();
        setIntroduce(data.result);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching introduce:", error);
      }
    };

    fetchIntroduce();
  }, []);

  // const introduce: Introduce = {
  //   title: "Nha trang",
  //   content:
  //     "<p><strong>Giới thiệu Khách sạn Sài Gòn Quy Nhơn</strong></p><p>Nằm tại trung tâm thành phố biển Quy Nhơn xinh đẹp, <strong>Khách sạn Sài Gòn Quy Nhơn</strong> là điểm đến lý tưởng cho du khách muốn tận hưởng kỳ nghỉ thư giãn hoặc kết hợp công tác. Tọa lạc ngay trên đường Nguyễn Huệ – con đường sầm uất ven biển, khách sạn chỉ cách bãi biển vài bước chân, đồng thời thuận tiện di chuyển đến các điểm du lịch nổi tiếng như Ghềnh Ráng – Tiên Sa, Eo Gió, Kỳ Co, và chợ đêm Quy Nhơn.</p><p>Khách sạn đạt tiêu chuẩn 4 sao, gồm hơn 140 phòng nghỉ hiện đại, được thiết kế sang trọng với tầm nhìn hướng biển hoặc thành phố. Mỗi phòng đều được trang bị đầy đủ tiện nghi như máy lạnh, tivi truyền hình cáp, wifi miễn phí, minibar, két an toàn và dịch vụ phòng 24/24, nhằm mang đến sự thoải mái tối đa cho khách lưu trú.</p><p>Ngoài ra, khách sạn còn có hệ thống nhà hàng sang trọng phục vụ ẩm thực đa dạng từ món ăn truyền thống Việt Nam đến quốc tế, quầy bar, hồ bơi, phòng hội nghị – hội thảo sức chứa lớn cùng dịch vụ spa – massage chuyên nghiệp. Đội ngũ nhân viên thân thiện, chuyên nghiệp và giàu kinh nghiệm của khách sạn luôn sẵn sàng hỗ trợ để mang lại cho quý khách những trải nghiệm đáng nhớ nhất.</p><p><strong>Khách sạn Sài Gòn Quy Nhơn – Nơi dừng chân lý tưởng giữa lòng thành phố biển.</strong></p>",
  //   collections: [
  //     {
  //       id: 1,
  //       url: "https://bcp.cdnchinhphu.vn/344443456812359680/2022/12/27/nhattrang3-16721128389061596602579.jpg",
  //     },
  //     {
  //       id: 2,
  //       url: "https://bcp.cdnchinhphu.vn/344443456812359680/2022/12/27/nhattrang3-16721128389061596602579.jpg",
  //     },
  //     {
  //       id: 3,
  //       url: "https://bcp.cdnchinhphu.vn/344443456812359680/2022/12/27/nhattrang3-16721128389061596602579.jpg",
  //     },
  //   ],
  // };

  return (
    <div className="pt-16 bg-gradient-to-b from-blue-100 via-white to-yellow-50 text-gray-800">
      <div
        className="h-64 bg-cover object-cover bg-center"
        style={{ backgroundImage: `url(${img})` }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-4xl font-bold mb-2 text-blue-900">{title}</h1>

        <div className="flex items-center text-gray-600 mb-4">
          <IoLocationSharp className="text-xl text-blue-500 mr-1" />
          <span className="text-md">{location}</span>
        </div>

        {/* Introduce Section */}
        {introduce && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-blue-800">
              {introduce.title}
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              {parse(introduce.content)}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {introduce.collections.map((item) => (
                  <img
                    key={item.id}
                    src={item.url}
                    alt="Location"
                    className="rounded-lg shadow-md w-full h-48 object-cover"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Type & Rating */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-gray-200 pt-4 mb-8">
          <div className="text-lg font-medium">
            <span className="text-gray-600">Loại địa điểm: </span>
            <span className="text-blue-600">{type}</span>
          </div>

          <div className="flex items-center mt-2 sm:mt-0">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={i < rating ? "#FBBF24" : "#E5E7EB"}
                className="w-6 h-6"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
            <span className="ml-2 text-gray-600">({rating}/5)</span>
          </div>
        </div>

        <ReviewCarousel locationId={id} />
      </div>
    </div>
  );
};

export default PlaceDetail;
