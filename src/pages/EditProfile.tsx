/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../components/UserDropdown/UserDropdown";
import { RootState, State } from "../redux/store/store";
import LoadingTriangle from "../components/Loading/LoadingTriangle";
import { toast } from "react-toastify";
import { TravelTypeSelection } from "../components/TypePage/TypeComponent";
import { updateProfile, changePassword } from "../fetchApi/ApiLocal";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
}

const uploadAvatar = async (formData: FormData) => {
  const response = await axios.post(
    "http://localhost:8888/api/v1/profile/users/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.result;
};

const changeAvatar = async (id: number) => {
  const response = await axios.put(
    "http://localhost:8888/api/v1/profile/users/change-avatar",
    { id: id }
  );
  return response.data.result;
};

const EditProfile: React.FC = () => {
  const { account } = useSelector((state: State) => state.user);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    firstName: "",
    lastName: "",
    avatar: null,
  });
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [activeTab, setActiveTab] = useState<
    "editProfile" | "changePassword" | "selectType"
  >("selectType");
  const selectedTypes = useSelector(
    (state: RootState) => state.travelType.selectedTypes
  );

  const handleSubmit = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_API}/profile/users/hobbies`,
        {
          hobbies: selectedTypes,
        }
      );
      console.log(selectedTypes);
      toast.success("Cập nhật sở thích thành công!");
    } catch (error) {
      toast.error("Cập nhật sở thích thất bại!");
      console.error("Error updating hobbies:", error);
    }
  };

  useEffect(() => {
    if (!account) {
      fetchUserProfile(dispatch);
    } else {
      setProfile({
        id: account.id,
        firstName: account.firstName,
        lastName: account.lastName,
        avatar: account.avatar,
      });
      setLoading(false);
    }
  }, [dispatch, account]);

  const profileMutation = useMutation(
    ({
      id,
      data,
    }: {
      id: string;
      data: { firstName: string; lastName: string };
    }) => updateProfile(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["profile", profile.id]);
        toast.success("Cập nhật thông tin thành công.");
        window.location.href = "/edit-profile";
      },
      onError: (error) => {
        console.error("Error updating profile:", error);
        toast.error("Cập nhật thông tin thất bại.");
      },
    }
  );

  const avatarMutation = useMutation(uploadAvatar, {
    onSuccess: async (data) => {
      const { id, url } = data;
      await changeAvatar(id);

      setProfile({
        ...profile,
        avatar: url,
      });

      queryClient.invalidateQueries(["profile", profile.id]);
      toast.success("Cập nhật ảnh thành công");
      window.location.href = "/edit-profile";
    },
    onError: (error) => {
      console.error("Error updating avatar:", error);
      toast.error("Cập nhật ảnh thất bại.");
    },
    onSettled: () => {
      setUploadingAvatar(false);
    },
  });

  const passwordMutation = useMutation(changePassword, {
    onSuccess: () => {
      toast.success("Thay đổi mật khẩu thành công!");
      window.location.href = "/edit-profile";
    },
    onError: (error) => {
      console.error("Error changing password:", error);
      toast.error("Thay đổi mật khẩu thất bại!");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedAvatar(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAvatar) {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append("file", selectedAvatar);
      await avatarMutation.mutateAsync(formData);
    }
    profileMutation.mutate({
      id: profile.id,
      data: {
        firstName: profile.firstName,
        lastName: profile.lastName,
      },
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    passwordMutation.mutate({ oldPassword, newPassword });
  };

  if (loading) {
    return <LoadingTriangle />;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-slate-700 dark:text-white">
      <div className="max-w-[800px] min-h-[450px] w-full bg-white p-8 rounded-xl shadow-2xl dark:bg-slate-500">
        <h2 className="text-4xl font-extrabold mb-6 text-center text-secondary">
          Thông tin cá nhân
        </h2>
        <div className="flex justify-center mb-4">
          <button
            className={`w-1/2 p-3 transition duration-300 mr-2 rounded-lg shadow-md ${
              activeTab === "editProfile"
                ? "bg-gradient-to-r from-secondary to-primary text-white"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => setActiveTab("editProfile")}
          >
            Chỉnh sửa thông tin
          </button>
          <button
            className={`w-1/2 p-3 transition duration-300 mr-2 rounded-lg shadow-md ${
              activeTab === "changePassword"
                ? "bg-gradient-to-r from-secondary to-primary text-white"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => setActiveTab("changePassword")}
          >
            Thay đổi mật khẩu
          </button>
          <button
            className={`w-1/2 p-3 transition duration-300 rounded-lg shadow-md ${
              activeTab === "selectType"
                ? "bg-gradient-to-r from-secondary to-primary text-white"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => setActiveTab("selectType")}
          >
            Chọn loại du lịch
          </button>
        </div>

        <div className={`tab-content transition-all duration-300`}>
          {activeTab === "editProfile" && (
            <div className="tab-pane">
              <form onSubmit={handleProfileSubmit} className="w-full">
                <div className="mb-4 flex justify-center">
                  <div className="relative">
                    <img
                      src={
                        avatarPreview ||
                        profile.avatar ||
                        "https://via.placeholder.com/150"
                      }
                      className="h-24 w-24 rounded-full object-cover border-4 border-gray-300 shadow-lg"
                      alt="Avatar"
                    />
                    <input
                      type="file"
                      onChange={handleAvatarChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 dark:text-white">
                    Họ:
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-400"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 dark:text-white">
                    Tên:
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-400"
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full bg-primary text-white px-4 py-2 rounded-md shadow-md transition duration-300 ${
                    uploadingAvatar
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-secondary"
                  }`}
                  disabled={uploadingAvatar}
                >
                  {uploadingAvatar ? "Đang tải lên..." : "Cập nhật thông tin"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "changePassword" && (
            <div className="tab-pane">
              <form onSubmit={handlePasswordSubmit} className="w-full">
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 dark:text-white">
                    Mật khẩu cũ:
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-secondary"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 dark:text-white">
                    Mật khẩu mới:
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-secondary"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white px-4 py-2 rounded-md shadow-md transition duration-300 hover:bg-secondary"
                >
                  Thay đổi mật khẩu
                </button>
              </form>
            </div>
          )}
          {activeTab === "selectType" && (
            <div className="tab-pane">
              <TravelTypeSelection />
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-primary text-white px-4 py-2 mt-4 rounded-md shadow-md transition duration-300"
              >
                Cập nhật thể loại
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
