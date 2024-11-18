import React, { useState } from "react";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onForgotPassword: () => void; 
  isLoading: boolean,
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onForgotPassword, isLoading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          autoFocus
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
      <a
        onClick={() => onForgotPassword()}
        className="mt-2 text-primary font-semibold text-sm cursor-pointer"
      >
        Quên mật khẩu
      </a>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 mt-4 font-bold text-white bg-primary rounded-md hover:bg-buttondark focus:outline-none transition duration-150 ease-in-out"
      >
        {isLoading ? "Đăng nhập..." : "Đăng nhập"} 
      </button>
    </form>
  );
};

export default LoginForm;