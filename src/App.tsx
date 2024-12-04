import { Route, Routes } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { lazy, Suspense, useEffect } from "react";
import { UserProvider } from "./context/UserContext";
import "./index.css";
import SimpleLayout from "./pages/SimpleLayout";
import LoadingTriangle from "./components/Loading/LoadingTriangle";
import ProtectedRoute from "./pages/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosSetup } from "./Api/axiosSetup";

const Home = lazy(() => import("./pages/Home"));
const Layout = lazy(() => import("./pages/Layout"));
const Blogs = lazy(() => import("./pages/Blogs"));
const BlogsDetails = lazy(() => import("./pages/BlogsDetails"));
const PlacesRoute = lazy(() => import("./pages/PlacesRoute"));
const About = lazy(() => import("./pages/About"));
const NoPage = lazy(() => import("./pages/NoPage"));
const MapPage = lazy(() => import("./pages/MapPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const WriteBlog = lazy(() => import("./components/Blogs/WriteBlog"));
const ChatWidget = lazy(() => import("./components/Chats/ChatWidget"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const PlaceDetail = lazy(() => import("./components/Places/PlaceDetail"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
function App() {
  useEffect(() => {
    axiosSetup(); // Chỉ chạy một lần khi ứng dụng được khởi động
  }, []);

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 900,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <>
      <Suspense fallback={<LoadingTriangle />}>
        <UserProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
          />

          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="blogs/:id" element={<BlogsDetails />} />
              <Route path="best-places" element={<PlacesRoute />} />
              <Route path="best-places/:id" element={<PlaceDetail />} />
              <Route path="about" element={<About />} />
              <Route path="history-travel" element={<HistoryPage />} />
              <Route path="WriteBlog" element={<WriteBlog />} />
              <Route path="*" element={<NoPage />} />
            </Route>
            <Route path="/" element={<SimpleLayout />}>
              <Route
                path="mappage/:id"
                element={
                  <ProtectedRoute>
                    <MapPage />
                  </ProtectedRoute>
                }
              />
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="reset-password" element={<ResetPassword />} />
            </Route>
          </Routes>
          <ChatWidget />
        </UserProvider>
      </Suspense>
    </>
  );
}

export default App;
