/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useMutation } from "react-query";
import Cookies from "js-cookie";
import { useUser } from "../context/UserContext";
import LoginForm from "../components/Login/LoginForm";
import RegisterForm from "../components/Login/RegisterForm";
import ForgetPassword from "../components/Login/ForgetPassowrd";
import { IoCloseOutline } from "react-icons/io5";
import { LoginInput } from "../redux/type";
import { login } from "../Api/auth";
import { toast } from "react-toastify";
import { trackingPlaces } from "../components/Login/TrackingPlaces";

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [forget, setForget] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setOrderPopup } = useUser();

  const { mutate: loginUser, isLoading } = useMutation(
    async (loginData: LoginInput) => await login(loginData),
    {
      onSuccess: async (data) => {
        localStorage.setItem("accessToken", data.accessToken);
        Cookies.set("refreshToken", data.refreshToken, { expires: 7 });

        // Lấy mảng id địa điểm đã lưu trong localStorage
        const clickedPlaces = localStorage.getItem("clickedPlaceIds");
        if (clickedPlaces) {
          try {
            const place_id: number[] = JSON.parse(clickedPlaces);
            if (place_id.length > 0) {
              await trackingPlaces(place_id);
            }
            localStorage.removeItem("clickedPlaceIds"); 
          } catch (error) {
            console.error("Gửi dữ liệu checkin thất bại", error);
          }
        }

        toast.success("Đăng nhập thành công");

        const redirectUrl = sessionStorage.getItem("redirect");
        window.location.href = redirectUrl || "/";
      },
      onError: (error: any) => {
        setErrorMessage(
          error.message || "Đăng nhập thất bại, vui lòng thử lại."
        );
      },
    }
  );

  const handleLogin = (email: string, password: string) => {
    setErrorMessage(null);
    loginUser({ email, password });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const toggleForgetPassword = () => {
    setForget(!forget);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-300 bg-opacity-20 z-50">
      <div
        className="relative w-full max-w-md p-6 space-y-8 bg-white shadow-lg rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <IoCloseOutline
            className="text-2xl cursor-pointer text-gray-600 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            onClick={() => setOrderPopup(false)}
          />
        </div>
        {!forget ? (
          <>
            <h2 className="text-2xl font-bold text-center">
              {isLogin ? "Đăng Nhập" : "Đăng Ký"}
            </h2>
            <div
              className={`relative w-full ${
                isLogin ? `h-80` : `h-[400px]`
              } overflow-hidden`}
            >
              <div
                className="absolute inset-0 w-full h-full flex transition-transform duration-500 transform"
                style={{
                  transform: isLogin ? "translateX(0)" : "translateX(-100%)",
                }}
              >
                <div className="w-full flex-shrink-0">
                  <LoginForm
                    onLogin={handleLogin}
                    isLoading={isLoading}
                    onForgotPassword={toggleForgetPassword}
                  />
                  {errorMessage && (
                    <label className="mt-2 text-red-500 text-sm">
                      {errorMessage}
                    </label>
                  )}
                </div>
                <div className="w-full flex-shrink-0">
                  <RegisterForm isLoading={isLoading} />
                </div>
              </div>
            </div>
            <button
              onClick={toggleForm}
              className="w-full px-4 py-2 font-bold text-secondary rounded-md focus:outline-none transition-all"
            >
              {isLogin ? "Đăng Ký" : "Tôi đã có tài khoản"}
            </button>
          </>
        ) : (
          <ForgetPassword onCancel={toggleForgetPassword} />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
