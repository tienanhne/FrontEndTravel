import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toastify

interface NewPlaceFormProps {
  lat: number;
  lng: number;
  placeName: string | null;
  onDelete: () => void;
}

const NewPlaceForm: React.FC<NewPlaceFormProps> = ({
  lat,
  lng,
  placeName,
  onDelete,
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [locationType, setLocationType] = useState<string>("PARK");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!imageFile) {
      setError("Please select an image.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Upload image
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("caption", "anhdiadiem");

      const uploadResponse = await axios.post(
        `${import.meta.env.VITE_BASE_API}/location/locations/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Uploaded Image ID:", uploadResponse.data);

      if (uploadResponse.data.code === 1000) {
        const imageId = uploadResponse.data.result.id;

        const coordinatesData = {
          lon: lng.toString(),
          lat: lat.toString(),
          imageId: imageId,
          type: locationType,
        };

        const coordinatesResponse = await axios.post(
          `${import.meta.env.VITE_BASE_API}/location/locations/coordinates`,
          coordinatesData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Coordinates API Response:", coordinatesResponse.data);

        if (coordinatesResponse.data.code === 1000) {
          setImageFile(null);
          setPreview(null);
          toast.success("Thêm địa điểm thành công!");
        } else {
          setError(coordinatesResponse.data.message);
          toast.error(coordinatesResponse.data.message);
        }
      } else {
        setError(uploadResponse.data.message);
        toast.error(uploadResponse.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Đã xảy ra lỗi khi tải hình ảnh.");
      toast.error("Đã xảy ra lỗi khi tải hình ảnh.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDelete();
  };

  return (
    <div className="p-4 w-[300px] max-w-full bg-white shadow-lg rounded-lg">
      <h3 className="text-xl font-semibold mb-3 text-center">
        Đóng góp địa điểm mới
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label
            htmlFor="latitude"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tên địa điểm:
          </label>
          <p className="w-full border font-semibold border-gray-300 p-2 rounded bg-gray-100">
            {placeName || "Unknown Place"}
          </p>
        </div>
        <div className="mb-3">
          <label
            htmlFor="latitude"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Latitude:
          </label>
          <input
            id="latitude"
            type="text"
            value={lat}
            className="w-full border border-gray-300 p-2 rounded bg-gray-100 cursor-not-allowed focus:outline-none"
            readOnly
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="longitude"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Longitude:
          </label>
          <input
            id="longitude"
            type="text"
            value={lng}
            className="w-full border border-gray-300 p-2 rounded bg-gray-100 cursor-not-allowed focus:outline-none"
            readOnly
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="place-image"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Chọn ảnh (Thumbnail):
          </label>
          <input
            id="place-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none hover:bg-gray-100 transition"
          />
        </div>

        {preview && (
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 mb-1">
              Ảnh đã chọn:
            </h4>
            <div className="relative h-32 m-1">
              <img
                src={preview}
                alt="Thumbnail Preview"
                className="w-full h-full object-cover border border-gray-300 rounded"
              />
            </div>
          </div>
        )}

        <div className="mb-3">
          <label
            htmlFor="location-type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Chọn loại địa điểm:
          </label>
          <select
            id="location-type"
            value={locationType}
            onChange={(e) => setLocationType(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none"
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

        {error && <div className="text-red-500 text-sm mb-3">{error}</div>}

        <div className="w-full flex justify-between">
          <button
            type="submit"
            className="bg-gradient-to-r from-primary to-secondary hover:bg-gradient-to-r hover:from-secondary hover:bg-primary transition-all duration-600 text-white p-2 rounded-lg flex-1 mr-1"
            disabled={loading}
          >
            {loading ? "Đang đóng góp..." : "Đóng góp"}
          </button>
          <button
            type="button"
            onClick={handleDeleteClick}
            className="bg-gradient-to-r from-gray-400 to-gray-600 hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-800 transition-all duration-600 text-white p-2 rounded-lg flex-1 ml-1"
          >
            Xóa bỏ
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPlaceForm;
