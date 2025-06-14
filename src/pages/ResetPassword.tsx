import axios from "axios";
import { useState } from "react";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { headers } from "../Api/auth";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const urlParams = new URLSearchParams(window.location.search);
  const tokenParam = urlParams.get("token");

  const { isLoading, mutateAsync: handleSubmit } = useMutation(
    async () => {
      const data = {
        newPassword,
        token: tokenParam,
      };
      return await axios.post(
        `${import.meta.env.VITE_BASE_API}/identity/auth/reset-password`,
        JSON.stringify(data),
        { headers: headers }
      );
    },
    {
      onSuccess: (data) => {
        if (data?.status === 200) {
          toast.success("Đặt lại mật khẩu thành công");

  
          localStorage.removeItem("accessToken"); 

          // ✅ Chuyển hướng tới trang đăng nhập
          window.location.href = "/login"; // hoặc "/signin" tùy định tuyến app của bạn
        }
      },
      onError: (error: any) => {
        toast.error("Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
        console.error(error);
      },
    }
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="rounded-lg bg-white w-full max-w-md p-8 flex flex-col gap-6 shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          Đặt lại mật khẩu
        </h1>
        <input
          type="password"
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="Nhập mật khẩu mới"
        />
        <button
          type="button"
          className="w-full py-3 font-semibold text-white bg-primary rounded-lg hover:bg-buttondark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-buttondark transition duration-200"
          onClick={() => handleSubmit()}
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Đặt lại"}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
