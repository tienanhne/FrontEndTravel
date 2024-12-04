import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RootState, State } from "../redux/store/store";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const destination = useSelector(
    (state: RootState) => state.destinations.location?.display_name
  );
  const { account } = useSelector((state: State) => state.user);

  if (!destination) {
    toast.error("Vui lòng nhập đầy đủ thông tin trước khi tiếp tục!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
    });
    if (!account) {
      return;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
