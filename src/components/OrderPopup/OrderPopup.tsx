import LoginPage from "../../pages/LoginPage";
import { useUser } from "../../context/UserContext";

const OrderPopup = () => {
  const { orderPopup, setOrderPopup } = useUser();
  return (
    <>
      {orderPopup && (
        <div
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm flex justify-center items-center"
          onClick={() => setOrderPopup(false)}
        >
          <LoginPage />
        </div>
      )}
    </>
  );
};

export default OrderPopup;
