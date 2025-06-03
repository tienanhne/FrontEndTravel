import React from "react";

const LoginBlank = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-green-100 to-yellow-100 dark:from-gray-800 dark:via-gray-900 dark:to-black dark:text-white transition-all duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/201/201623.png"
          alt="Travel Icon"
          className="w-20 h-20 mx-auto mb-5"
        />
        <h1 className="text-3xl font-bold mb-3 text-gray-800 dark:text-white">
          Chào mừng đến với TravelLogo!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Khám phá thế giới theo cách của bạn. Hãy đăng nhập để bắt đầu hành trình.
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-xl transition duration-300">
          Đăng nhập
        </button>
        <div className="mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Bạn chưa có tài khoản?{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginBlank;
