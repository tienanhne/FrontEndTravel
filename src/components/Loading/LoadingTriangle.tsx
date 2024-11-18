import ImgPlane from "../../assets/transport.png";

const LoadingTriangle = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative w-full">
        <img className="absolute left-0 animate-fly w-40 h-40" src={ImgPlane} />
      </div>
    </div>
  );
};

export default LoadingTriangle;
