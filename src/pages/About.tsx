import Location from "../components/Location/Location";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import anhkhoa from "../assets/profile/anhkhoa.jpg";
import anhtien from "../assets/profile/anhtien.png";
import anhduy from "../assets/profile/anhDuy.jpg";
import anhkiet from "../assets/profile/anhKiet.jpg";

const people = [
  {
    name: "Lê Đình Tiến",
    mssv: "121000305",
    email: "tienld03@gmail.com",
    img: anhtien,
    social: {
      facebook: "https://www.facebook.com/tienld03?locale=vi_VN",
      twitter: "#",
      linkedin: "#",
    },
  },
  {
    name: "Ngô Tuấn Kiệt",
    mssv: "121000216",
    email: "ngotuankiet12347@gmail.com",
    img: anhkiet,
    social: {
      facebook:
        "https://www.facebook.com/profile.php?id=100009718303827&locale=vi_VN",
      twitter: "#",
      linkedin: "#",
    },
  },
  {
    name: "Nguyễn Đăng Khoa",
    mssv: "121000025",
    email: "dangkhoa140903@gmail.com",
    img: anhkhoa,
    social: {
      facebook: "https://www.facebook.com/khoa.nd09?mibextid=LQQJ4d",
      twitter: "#",
      linkedin: "#",
    },
  },
  {
    name: "Đặng Văn Duy",
    mssv: "121001048",
    email: "dangvanduy4103@gmail.com",
    img: anhduy,
    social: {
      facebook:
        "https://www.facebook.com/profile.php?id=100007163389464&locale=vi_VN",
      twitter: "#",
      linkedin: "#",
    },
  },
];

const About = () => {
  return (
    <div className="dark:bg-gray-800 dark:text-white">
      <div className="container pt-14">
        <div className="py-10">
          <h1 className="my-8 border-l-8 border-primary/50 py-2 pl-2 text-3xl font-bold">
            Về chúng tôi
          </h1>
          {/* Cards Section */}
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {people.map((person, index) => (
              <div
                key={index}
                className="transform hover:-translate-y-2 transition-all duration-300 ease-in-out bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 text-center"
              >
                <img
                  className="w-36 h-36 rounded-full mx-auto mb-4 object-cover"
                  src={person.img}
                  alt={person.name}
                />
                <h2 className="text-xl font-semibold mb-2">{person.name}</h2>
                <p className="text-gray-500 dark:text-gray-300 mb-1">
                  MSSV: {person.mssv}
                </p>
                <p className="text-gray-500 dark:text-gray-300 mb-4">
                  {person.email}
                </p>
                <div className="flex justify-center space-x-4">
                  <a
                    href={person.social.facebook}
                    className="text-blue-600 dark:text-blue-400 hover:scale-110 transition-transform"
                  >
                    <FaFacebook />
                  </a>
                  <a
                    href={person.social.twitter}
                    className="text-blue-400 dark:text-blue-300 hover:scale-110 transition-transform"
                  >
                    <FaTwitter />
                  </a>
                  <a
                    href={person.social.linkedin}
                    className="text-blue-800 dark:text-blue-500 hover:scale-110 transition-transform"
                  >
                    <FaLinkedin />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="py-10">
          <h1 className="my-8 border-l-8 border-primary/50 py-2 pl-4 text-3xl font-bold ">
            Giới thiệu chung về dự án
          </h1>
          <p className="text-lg leading-relaxed">
            Dự án website du lịch thông minh được xây dựng nhằm mục đích giúp
            người dùng dễ dàng lên kế hoạch cho các chuyến đi, khám phá các địa
            điểm mới, và quản lý lịch trình một cách hiệu quả. Với giao diện
            thân thiện và các tính năng hiện đại, hệ thống hứa hẹn mang lại trải
            nghiệm mượt mà và tối ưu cho người dùng.
          </p>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">
              Điểm nổi bật của dự án:
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Gợi ý địa điểm và lịch trình dựa trên sở thích.</li>
              <li>
                Hỗ trợ tương tác bản đồ với các tính năng kéo thả và xem chi
                tiết địa điểm.
              </li>
              <li>Tích hợp tính năng quản lý lịch trình cá nhân hóa.</li>
              <li>
                Giao diện thân thiện, tối ưu cho cả thiết bị di động và máy
                tính.
              </li>
            </ul>
          </div>
          <div className="mt-8">
            <a
              href="https://docs.google.com/document/d/1Y0O_8FQfLDlH0ECRoYdu1PAKYRSJNpnhI8FPGWiAU2k/edit?tab=t.0"
              target="_blank"
              className="inline-block px-6 py-3 text-white bg-primary hover:bg-primary-dark rounded-lg shadow-lg font-medium text-lg transition duration-300"
            >
              Tìm hiểu thêm
            </a>
          </div>
        </div>
      </div>
      <Location />
    </div>
  );
};

export default About;
