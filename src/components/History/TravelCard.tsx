/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { IoLocationSharp } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setDestinationDetails } from "../Maps/destinationsSlice";
import Modal from "react-modal";
import axios from "axios";
import { toast } from "react-toastify";
import { Location } from "../../redux/type";

Modal.setAppElement("#root");

const ShareModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  tripId: number;
}> = ({ isOpen, onClose, tripId }) => {
  const [email, setEmail] = useState("");
  const [permissions, setPermissions] = useState<string | null>(null); // Chỉ lưu 1 quyền

  const handlePermissionChange = (permission: string) => {
    setPermissions((prev) => (prev === permission ? null : permission));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      email,
      tripPermission: permissions?.toUpperCase() || "",
    };
    const accessToken = localStorage.getItem("accessToken");

    try {
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
        <div>
          <label className="block mb-2 text-lg font-semibold">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 rounded-lg w-full p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-2 text-lg font-semibold">
            Quyền truy cập:
          </label>
          <div className="flex flex-col space-y-2">
            {["read", "edit"].map((perm) => (
              <label key={perm} className="inline-flex items-center">
                <input
                  type="checkbox"
                  onChange={() => handlePermissionChange(perm)}
                  checked={permissions === perm}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-lg capitalize">
                  {perm === "edit" ? "Chỉnh sửa" : "Xem"}
                </span>
              </label>
            ))}
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

const fetchUsers = async (tripId: number): Promise<User[]> => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await axios.get(
      `http://localhost:8888/api/v1/trip/trips/users/${tripId}/trip`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.result.map((user: any) => ({
      email: user.email,
      tripPermission: user.tripPermission,
      avatar: user.avatar || "https://via.placeholder.com/150",
    }));
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    return [];
  }
};

interface User {
  email: string;
  tripPermission: string;
  avatar: string;
}

const ModalAvatar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  tripId: number;
  permisstion: string;
}> = ({ isOpen, onClose, tripId,permisstion }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUsers = async () => {
      if (isOpen) {
        setLoading(true);
        const fetchedUsers = await fetchUsers(tripId);
        setUsers(fetchedUsers);
        setLoading(false);
      }
    };

    loadUsers();
  }, [isOpen, tripId]);

  const handlePermissionChange = (email: string, newPermission: string) => {
    console.log(`Cập nhật quyền cho ${email}: ${newPermission}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white p-8 rounded-lg shadow-lg w-[600px] dark:bg-slate-500 dark:text-white"
      overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-3">Chi tiết nhóm của bạn</h3>
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <ul className="space-y-3">
            {users.map((user, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={user.avatar || "https://via.placeholder.com/150"}
                    alt={user.email}
                    className="h-10 w-10 rounded-full border border-gray-300"
                  />
                  <span>{user.email}</span>
                </div>
                <select
                  defaultValue={user.tripPermission.toLowerCase()}
                  onChange={(e) =>
                    handlePermissionChange(user.email, e.target.value)
                  }
                  className="border border-gray-300 dark:text-dark rounded-md p-2"
                  disabled={
                    permisstion.toLowerCase() !== "owner" 
                  }
                >
                  <option value="read">Đọc</option>
                  <option value="edit">Chỉnh sửa</option>
                  <option value="owner">Chủ phòng</option>
                </select>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        className="bg-gray-300 text-black font-bold p-3 rounded-lg text-lg w-full transition duration-200 hover:bg-gray-400"
        onClick={onClose}
      >
        Hủy
      </button>
    </Modal>
  );
};

interface TravelCardProps {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  permission: string;
  location: Location;
}

const TravelCard: React.FC<TravelCardProps> = ({
  id,
  title,
  startDate,
  endDate,
  permission,
  location,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const fetchedUsers = await fetchUsers(id);
      setUsers(fetchedUsers);
    };
    loadUsers();
  }, [id]);

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
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <div className="relative shadow-lg transition-all duration-500 hover:shadow-xl dark:bg-slate-950 dark:text-white cursor-pointer rounded-lg overflow-hidden">
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
        <div className="flex justify-between">
          <p>{`Bắt đầu: ${new Date(startDate).toLocaleDateString()}`}</p>
          <p>{`Kết thúc: ${new Date(endDate).toLocaleDateString()}`}</p>
        </div>
        <div className="flex items-center justify-between border-t-2 pt-3">
          <div className="flex items-center space-x-2">
            {users.map((user, index) => (
              <img
                key={index}
                src={user.avatar || "https://via.placeholder.com/150"}
                alt={user.email}
                title={user.email}
                className="h-8 w-8 rounded-full border border-gray-300 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen2(true);
                }}
              />
            ))}
            {users.length > 3 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen2(true);
                }}
                className="text-sm font-semibold text-gray-600 cursor-pointer"
              >
                +{users.length - 3}
              </span>
            )}
          </div>

          {permission === "OWNER" && (
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={handleShareClick}
              aria-label="Share itinerary"
            >
              <BsThreeDots size={24} />
            </button>
          )}
        </div>
      </div>
      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tripId={id}
      />
      <ModalAvatar
        isOpen={isModalOpen2}
        onClose={() => setIsModalOpen2(false)}
        permisstion={permission}
        tripId={id}
      />
    </div>
  );
};

export default React.memo(TravelCard);
