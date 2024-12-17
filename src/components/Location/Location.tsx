
const Location = () => {
  return (
    <>
      <span id="location"></span>
      <section data-aos="fade-up" className="">
        <div className="container py-4">
          <h1 className="inline-block border-l-8 border-primary/50 py-2 pl-2 mb-4 text-xl font-bold sm:text-3xl">
            Vị trí ghé thăm 
          </h1>

          <div className="rounded-xl pt-5">
            <iframe
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.008562360966!2d106.78692747583978!3d10.962725355728079!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174dbde957d1389%3A0x37ae66bbc1334570!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBM4bqhYyBI4buTbmcgKEPGoSBz4bufIETGsOG7o2Mp!5e0!3m2!1svi!2s!4v1734069092580!5m2!1svi!2s" 
              width="100%"
              height="360"
              loading="lazy"
              style={{ borderRadius: "20px" }}
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
};

export default Location;
