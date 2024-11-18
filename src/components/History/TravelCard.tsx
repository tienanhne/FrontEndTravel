import { IoLocationSharp } from "react-icons/io5";
import { Location } from "../../redux/type";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setDestinationDetails } from "../Maps/destinationsSlice";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Modal from "react-modal";
import axios from "axios";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const ShareModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  tripId: number;
}> = ({ isOpen, onClose, tripId }) => {
  const [email, setEmail] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);

  const togglePermission = (permission: string) => {
    setPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      email,
      tripPermission: permissions.join(", ").toUpperCase(),
    };
    console.log(data);
    // Retrieve the access token from local storage
    const accessToken = localStorage.getItem("accessToken");

    try {
      // Send the POST request
      await axios.post(
        `http://localhost:8888/api/v1/trip/trips/share/${tripId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Lịch trình đã được chia sẻ thành công!");
      onClose();
    } catch (error) {
      console.error("Error sharing itinerary:", error);
      toast.error("Đã xảy ra lỗi khi chia sẻ lịch trình. Vui lòng thử lại.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white p-8 rounded-lg shadow-lg w-[600px] dark:bg-slate-500 dark:text-white"
      overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70"
    >
      <h2 className="text-2xl font-bold text-secondary mb-6 text-center">
        Chia sẻ lịch trình
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label className="block mb-2 text-lg font-semibold">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 rounded-lg w-full p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-lg font-semibold">
            Quyền truy cập:
          </label>
          <div className="flex flex-col space-y-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                onChange={() => togglePermission("read")}
                checked={permissions.includes("read")}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-lg">Đọc</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                onChange={() => togglePermission("edit")}
                checked={permissions.includes("edit")}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-lg">Chỉnh sửa</span>
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-primary text-white font-bold p-3 rounded-lg text-lg w-full mr-2 transition duration-200 hover:bg-blue-500"
          >
            Chia sẻ
          </button>
          <button
            type="button"
            className="bg-gray-300 text-black font-bold p-3 rounded-lg text-lg w-full ml-2 transition duration-200 hover:bg-gray-400"
            onClick={onClose}
          >
            Hủy
          </button>
        </div>
      </form>
    </Modal>
  );
};

interface TravelCardProps {
  id: number;
  title: string;
  startDate: string;
  permission: string;
  endDate: string;
  location: Location;
}

const TravelCard: React.FC<TravelCardProps> = ({
  id,
  title,
  permission,
  startDate,
  endDate,
  location,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    dispatch(
      setDestinationDetails({
        id,
        title,
        code: "",
        startDate,
        endDate,
        image: location.thumbnail.url,
        permission,
        location,
      })
    );

    navigate(`/mappage/${id}`);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    setIsModalOpen(true); // Open share modal
  };

  return (
    <div className="relative shadow-lg transition-all duration-500 hover:shadow-xl dark:bg-slate-950  dark:text-white cursor-pointer rounded-lg overflow-hidden">
      <div className="overflow-hidden" onClick={handleCardClick}>
        <img
          src={location.thumbnail.url}
          alt="No image"
          className="mx-auto h-[220px] w-full object-cover transition duration-700 hover:scale-110"
        />
      </div>

      <div className="space-y-2 p-4">
        <h1 className="font-bold text-xl line-clamp-1">{title}</h1>
        <div className="flex items-center gap-2 opacity-70">
          <IoLocationSharp />
          <span>{location.address.city}</span>
        </div>
        {/* Start and End Dates on the same line */}
        <div className="flex justify-between">
          <p className="line-clamp-2">{`Bắt đầu: ${new Date(
            startDate
          ).toLocaleDateString()}`}</p>
          <p className="line-clamp-2">{`Kết thúc: ${new Date(
            endDate
          ).toLocaleDateString()}`}</p>
        </div>
        <div className="flex items-center justify-between border-t-2 pt-3">
          <div className="opacity-70">
            <p>{location.type}</p>
          </div>
          <div>
            {permission === "OWNER" && (
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={handleShareClick}
                aria-label="Share itinerary"
                title="Chia sẻ chuyến đi"
              >
                <BsThreeDots size={24} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tripId={id}
      />
    </div>
  );
};

export default TravelCard;
