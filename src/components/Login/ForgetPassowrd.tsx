/* eslint-disable @typescript-eslint/ban-types */
const ForgetPassword: React.FC<{ onCancel: Function }> = ({ onCancel }) => {
  const handleResetPassword = () => {
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
