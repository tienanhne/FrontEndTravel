/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { setDestinationDetails } from "../Maps/destinationsSlice";
import Modal from "react-modal"; // Import react-modal
import { TravelTypeSelection } from "../TypePage/TypeComponent";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";

// Modal styles (you can customize these)
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "none",
    background: "transparent",

  },
};

Modal.setAppElement("#root");

const Hero = () => {
  const [departureDate, setDepartureDate] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>("");
  const [numberOfDays, setNumberOfDays] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [destext, setDesText] = useState("");
  const [destitle, setDesTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();

  const handleDesText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesText(e.target.value);
    setShowSuggestions(true);
  };
  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesTitle(e.target.value);
  };
  const selectedTypes = useSelector(
    (state: RootState) => state.travelType.selectedTypes
  );

  useEffect(() => {
    if (departureDate && returnDate) {
      const startDate = new Date(departureDate);
      const endDate = new Date(returnDate);
      const diffTime = endDate.getTime() - startDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      setNumberOfDays(diffDays + 1);

      const daysArray = [];
      for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        daysArray.push({
          date: new Date(d).toISOString().split("T")[0],
          destinations: [],
        });
      }
    }
  }, [departureDate, returnDate, dispatch]);

  const fetchSuggestions = async (query: string) => {
    if (!query || query.length === 0) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API}/location/locations?q=${query}&limit=1`
      );
      const data = response.data.result;
      console.log("địa ddiemr ",data)
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions(destext);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [destext]);

  const handleSuggestionClick = (city: any) => {
    setDesText(city.address.city);
    setShowSuggestions(false);
  };

  const handleSearchClick = () => {
    if (!departureDate || !returnDate || !destext || numberOfDays === null || !destitle) {
      toast.error("Vui lòng nhập đầy đủ thông tin!", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }
    setIsModalOpen(true);
  };

  const handleCustomTrip = async () => {
    const selectedLocation = suggestions.find(
      (city) => city.address.city === destext
    );
    if (!selectedLocation) {
      toast.error("Không tìm thấy địa điểm hợp lệ!", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const locationId = selectedLocation.place_id;
    const tripData = {
      title: destitle,
      startDate: new Date(departureDate).toISOString(),
      endDate: new Date(returnDate).toISOString(),
      locationId: locationId,
    };

    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API}/trip/trips`,
        tripData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        const tripResult = response.data.result;
        dispatch(setDestinationDetails(tripResult));
        navigate(`/mappage/${tripResult.id}`);
      }
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  };

  const handleGenerateTrip = () => {
    setIsModalOpen(false);
    setIsTypeModalOpen(true);
  };

  const handleTypeSelection = async () => {
    setIsLoading(true);

    const selectedLocation = suggestions.find(
      (city) => city.address.city === destext
    );
    const tripData = {
      title: destitle,
      startDate: new Date(departureDate).toISOString(),
      endDate: new Date(returnDate).toISOString(),
      locationId: selectedLocation.place_id,
      type: selectedTypes,
    };

    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API}/trip/trips/generate`,
        tripData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        const tripResult = response.data.result;
        dispatch(setDestinationDetails(tripResult));
        setIsLoading(false);
        navigate(`/mappage/${tripResult.id}`);
      }
    } catch (error) {
      console.error("Error generating trip:", error);
      setIsLoading(true);
    }
  };

  return (
    <div className="bg-black/20 h-full">
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={customStyles}
        contentLabel="Chọn loại chuyến đi"
        overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 z-50"
      >
        <div className="p-6 bg-gradient-to-b from-blue-100 to-green-100 rounded-lg shadow-lg">
          <h2 className="text-2xl font-extrabold text-center text-buttondark mb-6">
            Chọn loại chuyến đi
          </h2>
          <div className="flex gap-6 justify-center">
            <button
              className="py-3 px-6 bg-primary hover:bg-secondary transition-colors text-white rounded-lg shadow-md flex items-center gap-2"
              onClick={handleCustomTrip}
            >
              Lịch trình tự tạo
            </button>
            <button
              className="py-3 px-6 bg-secondary hover:bg-button transition-colors text-white rounded-lg shadow-md flex items-center gap-2"
              onClick={handleGenerateTrip}
            >
              Lịch trình tự động
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isTypeModalOpen}
        contentLabel="Chọn thể loại địa điểm"
        onRequestClose={() => setIsTypeModalOpen(false)}
        style={customStyles}
        overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 z-50"
      >
        <div className="p-8 dark:bg-slate-700 w-[800px] rounded-lg shadow-lg transition-transform transform scale-105">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
            Chọn các loại địa điểm
          </h2>

          <TravelTypeSelection />

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleTypeSelection}
              className="px-8 py-3 bg-gradient-to-r from-secondary to-primary text-white font-semibold rounded-lg shadow-lg hover:from-primary hover:to-secondary transition duration-300 min-w-[120px] flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-6 w-6 text-white mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              ) : (
                "Xác nhận"
              )}
            </button>
          </div>
        </div>
      </Modal>

      <div className="h-full flex justify-center items-center p-4 bg-primary/10">
        <div className="container grid grid-cols-1 gap-4">
          <div className="text-white">
            <p
              data-aos="fade-up"
              data-aos-delay="300"
              className="font-bold text-3xl"
            >
              Địa điểm bạn muốn tới?
            </p>
          </div>
          <div
            data-aos="fade-up"
            data-aos-delay="600"
            className="space-y-4 bg-white rounded-md p-4 relative"
          >
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 py-3">
              <div>
                <label htmlFor="title" className="opacity-70">
                  Tiêu đề chuyến đi
                </label>
                <input
                  type="text"
                  name="title"
                  value={destitle}
                  autoComplete="off"
                  onChange={handleTitle}
                  required
                  id="title"
                  placeholder="Đặt tên cho chuyến đi..."
                  className="w-full bg-gray-100 my-2 rounded-full p-2"
                />
              </div>
              <div>
                <label htmlFor="destination" className="opacity-70">
                  Tìm địa điểm của bạn
                </label>
                <input
                  type="text"
                  name="destination"
                  value={destext}
                  autoComplete="off"
                  onChange={handleDesText}
                  required
                  id="destination"
                  placeholder="Đồng Nai"
                  className="w-full bg-gray-100 my-2 rounded-full p-2"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border border-gray-200 rounded-md mt-1 max-h-48 md:w-[300px] sm:w-[130px] overflow-auto shadow-lg">
                    {suggestions.map((city) => (
                      <li
                        key={city.place_id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSuggestionClick(city)}
                      >
                        {city.address.city}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label htmlFor="departure" className="opacity-70">
                  Ngày đi
                </label>
                <input
                  type="date"
                  name="departure"
                  id="departure"
                  required
                  className="w-full bg-gray-100 my-2 rounded-full p-2"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  min={today}
                />
              </div>
              <div>
                <label
                  htmlFor="return"
                  className="flex items-center justify-between opacity-70"
                >
                  Ngày về{" "}
                  {numberOfDays !== null && (
                    <p className="font-bold">{numberOfDays} ngày</p>
                  )}
                </label>
                <input
                  type="date"
                  name="return"
                  id="return"
                  className="w-full bg-gray-100 my-2 rounded-full p-2"
                  value={returnDate}
                  required
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={departureDate || today}
                />
              </div>
            </div>
            <button
              onClick={handleSearchClick}
              className="bg-gradient-to-r from-primary to-secondary text-white hover:scale-105 px-4 py-2 rounded-full duration-200 absolute -bottom-5 left-1/2 -translate-x-1/2"
            >
              Tìm kiếm ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
