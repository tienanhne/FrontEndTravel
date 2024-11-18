import NatureVid from "../assets/video/main.mp4";
import Places from "../components/Places/Places";

import Banner from "../components/Banner/Banner";
import OrderPopup from "../components/OrderPopup/OrderPopup";
import Hero from "../components/Hero/Hero";
import BlogsComp from "../components/Blogs/BlogsComp";

const Home = () => {
  return (
    <>
      <div>
        <div className="h-[700px] relative">
          <video
            autoPlay
            loop
            muted
            className="absolute right-0 top-0 h-[700px] w-full object-cover z-[-1]"
          >
            <source src={NatureVid} type="video/mp4" />
          </video>
          <Hero />
        </div>
        <Places />
        <div className="dark:bg-gray-900 dark:text-white bg-gray-50 py-10">
          <BlogsComp isLoadMore={false} />
        </div>

        <Banner />
        <OrderPopup />
      </div>
    </>
  );
};

export default Home;
