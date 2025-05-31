/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Handcrafted from "./Handcrafted";
import { RootState } from "../../redux/store/store";
import { useSelector } from "react-redux";
import ImgQuestion from "../../assets/circle.png";
import Joyride from "react-joyride";

const MapSelector = ({
  isMenuOpen,
  handleMenuToggle,
}: {
  isMenuOpen: boolean;
  handleMenuToggle: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const results = useSelector((state: RootState) => state.destinations.results);
  const trip = useSelector((state: RootState) => state.destinations);
  const destext = useSelector((state: RootState) => state.destinations.destText);
  const [runJoyride, setRunJoyride] = useState<boolean>(false);
  console.log("trip",trip)

  const [{ steps }] = useState({
    steps: [
      { target: ".guide", content: "", title: "Hướng Dẫn Chức Năng" },
      {
        target: ".map-button",
        content: "Nhấn vào đây để tiến hành và xem chi tiết lịch trình.",
      },
      {
        target: ".remove-day-button",
        content: "Nhấn vào đây để xóa ngày này khỏi hành trình của bạn.",
      },
      {
        target: ".add-day-button",
        content: "Nhấn vào đây để thêm một ngày mới vào hành trình của bạn!",
      },
      {
        target: ".destination-item",
        content: "Bạn có thể kéo và thả các điểm đến để sắp xếp lại chúng.",
      },
      {
        target: ".remove-destination-button",
        content: "Nhấn vào đây để xóa điểm đến này khỏi ngày của bạn.",
      },
      {
        target: ".search-input",
        content: "Sử dụng ô tìm kiếm này để tìm và thêm các điểm đến.",
      },
      {
        target: ".last-skip",
        content: "Chúc các bạn có một chuyến đi vui vẻ.",
      },
    ],
  });

  useEffect(() => {
    const joyrideCompleted = localStorage.getItem("joyrideCompleted");
    if (!joyrideCompleted) {
      setRunJoyride(true);
    }
  }, []);

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    if (status === "finished" || status === "skipped") {
      localStorage.setItem("joyrideCompleted", "true");
      setRunJoyride(false);
    }
    console.log(data);
  };

  return (
    <div
      className={`${
        isMenuOpen ? "block" : "hidden"
      } md:block absolute md:static w-full max-h-full md:w-1/3 p-6 md:p-4 bg-gray-100 dark:bg-slate-800 dark:text-white shadow-lg overflow-y-auto no-scrollbar z-40 md:z-auto`}
    >
      <Joyride
        steps={steps}
        run={runJoyride}
        continuous
        showProgress
        showSkipButton
        hideBackButton
        scrollToFirstStep
        locale={{
          last: "Kết thúc",
          next: "Tiếp theo",
          skip: "Bỏ qua",
          back: "Quay lại",
          open: "Hướng dẫn sử dụng tính năng",
        }}
        styles={{
          options: {
            backgroundColor: "#00c3c7",
            primaryColor: "translate",
            textColor: "#ffcf22",
            zIndex: 1000,
          },
          beacon: {
            backgroundImage: `url(${ImgQuestion})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: 27,
            height: 27,
            borderRadius: "50%",
            boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.1)",
            animation: "pulse 1.5s ease-in-out infinite",
          },
          spotlight: {
            borderRadius: "10px",
          },
          tooltip: {
            borderRadius: "8px",
            padding: "16px",
          },
        }}
        callback={handleJoyrideCallback}
      />
      <h2 className="text-xl font-bold mb-4 text-center text-primary">
        Lựa chọn cho chuyến đi:{" "}
        <strong className="text-secondary">
          {trip.location?.address.city || destext || "Chưa có địa điểm"}
          <span className="guide ml-4"></span>
        </strong>
      </h2>
      {results && (
        <div className="mb-4">
          <Handcrafted />
        </div>
      )}
      <button
        className="md:hidden bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition mt-4 w-full"
        onClick={() => handleMenuToggle(false)}
      >
        Đóng
      </button>
    </div>
  );
};

export default MapSelector;
