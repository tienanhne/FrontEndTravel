import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { headers } from "../../Api/auth";
import Cookies from "js-cookie";
interface RegisterFormProps {
  isLoading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ isLoading }) => {
  const [isSubmitting,setSubmitting]  = useState(false);
  const [lastName, setLastName] = useState("");
  const [firstName,setFirstName] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
      try {
        const data = {
          firstName,
          lastName,
          email,
          password
        }
        setSubmitting(!isSubmitting)
        const response =  await axios.post("http://localhost:8888/api/v1/identity/auth/register",JSON.stringify(data),{headers: headers});
        if(response.status === 200){
          localStorage.setItem("accessToken", response.data.result.accessToken);
          Cookies.set("refreshToken", response.data.result.refreshToken, { expires: 7 });
          const stringSession = sessionStorage.getItem("redirect");
          toast.success("Đăng kí thành công");
          if (stringSession) {
            window.location.href = stringSession;
          } else {
            window.location.href = "/";
          }
        }
      } catch (error) {
        console.log(error);
        
      }
  };

  return (
    <>
      {isSubmitting ? <div className="flex justify-center items-center">
        <h1>Vui lòng xác thực email để kích hoạt tài khoản</h1>
      </div> : 
        <form  className="space-y-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            Họ và tên đệm
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            autoFocus
            defaultValue={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none"
            required
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Tên
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            autoFocus
            defaultValue={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none"
            required
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Mật khẩu
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 mt-4 font-bold text-white bg-primary rounded-md hover:bg-buttondark focus:outline-none"
          onClick={handleSubmit}
        >
          {isLoading ? "Đăng ký..." : "Đăng ký"}
          
        </button>
      </form>
      } 
    </>
  );
};

export default RegisterForm;
