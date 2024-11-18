import Location from "../components/Location/Location";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import anhkhoa from "../assets/profile/anhkhoa.jpg"
import anhtien from "../assets/profile/anhtien.jpg"
import anhduy from "../assets/profile/anhDuy.jpg"

const people = [
  {
    name: "Lê Đình Tiến",
    mssv: "121000305",
    email: "tienld03@gmail.com",
    img: anhtien,
    social: {
      facebook: "https://www.facebook.com/tienld03?locale=vi_VN",
      twitter: "#",
      linkedin: "#"
    }
  },
  {
    name: "Ngô Tuấn Kiệt",
    mssv: "20180002",
    email: "jane.smith@example.com",
    img: "https://loremflickr.com/200/200?random=2",
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#"
    }
  },
  {
    name: "Nguyễn Đăng Khoa",
    mssv: "121000025",
    email: "dangkhoa140903@gmail.com",
    img: anhkhoa,
    social: {
      facebook: "https://www.facebook.com/khoa.nd09?mibextid=LQQJ4d",
      twitter: "#",
      linkedin: "#"
    }
  },
  {
    name: "Đặng Văn Duy",
    mssv: "121001048",
    email: "dangvanduy4103@gmail.com",
    img: anhduy,
    social: {
      facebook: "https://www.facebook.com/profile.php?id=100007163389464&locale=vi_VN",
      twitter: "#",
      linkedin: "#"
    }
  }
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
      </div>
      <Location />
    </div>
  );
};

export default About;
