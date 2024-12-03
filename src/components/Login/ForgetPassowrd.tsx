import axios from "axios";
import { useState } from "react";
import { headers } from "../../Api/auth";

/* eslint-disable @typescript-eslint/ban-types */
const ForgetPassword: React.FC<{ onCancel: Function }> = ({ onCancel }) => {
  const [email,setEmail] = useState("");
  const handleResetPassword = async () => {
    try {
      const data = {
        email,
        urlRedirect: "http://localhost:3000/reset-password"
      }
      const response = await axios.post("http://localhost:8888/api/v1/identity/auth/forgot-password",JSON.stringify(data),{headers: headers})
    } catch (error) {
      console.log(error);
      
    }
    alert("Instructions to reset your password have been sent to your email.");
    onCancel();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center">Quên mật khẩu</h2>
      <input
        type="email"
        placeholder="Nhập email của bạn"
        className="w-full p-2 mt-4 border rounded-md"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleResetPassword}
        className="w-full mt-4 px-4 py-2 font-bold text-secondary rounded-md focus:outline-none transition-all"
      >
        Đặt lại mật khẩu
      </button>
      <button
        onClick={() => onCancel()}
        className="w-full mt-2 px-4 py-2 font-bold text-gray-600 hover:text-gray-800 rounded-md focus:outline-none transition-all"
      >
        Hủy
      </button>
    </div>
  );
};

export default ForgetPassword;
