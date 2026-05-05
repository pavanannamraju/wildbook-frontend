import BackgroundImage from "../assets/Frame 46.png";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

export function AboutUs() {
  return (
    <section className="pt-10 px-20 max-w-[1920px] mx-auto">
      <div
        className="w-full max-w-[1720px] mx-auto bg-[#0B6E66] rounded-2xl p-10"
        style={{
          backgroundImage: `url('${BackgroundImage}')`,
          backgroundSize: "50%",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 px-4">
          <div className="w-full lg:w-[40%] flex flex-col gap-4">
            {/* <h2 className="font-['Nunito',Helvetica] font-bold text-[#efc265] text-lg sm:text-xl lg:text-2xl tracking-[0] leading-[40px] lg:leading-[56px]"> */}
            <h2 className="font-['Nunito',Helvetica] text-[20px] font-medium text-[#F0C165] tracking-wide">
              About Us
            </h2>
            <p className="font-['Nunito',Helvetica] text-[#f9f9f9] text-md leading-tight">
              Wildbook is a simple platform designed to help connect people with
              wildlife in the right way -
            </p>
            <p className="font-['Cocogoose Pro',Helvetica] text-[#f9f9f9] text-4xl font-semibold leading-tight">
            by bringing structure, credibility, and intent to wildlife tourism in India.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-[#EDE8E2] border border-[#E2DDD8] rounded px-4 py-2 w-fit"
            >
              Know our journey
              <ArrowRightIcon size={20} />
            </Link>
          </div>
          <p className="w-full lg:w-[60%] text-[#E8E2DC] text-base md:text-lg leading-relaxed">
            We bring together a trusted network of guides, naturalists, and
            responsible wildlife tour operators. Through this network,
            travellers can discover expert-led nature tours, curated wildlife
            plans, and community based homestays that offer deeper, more
            authentic experiences in the wild. While we are still new and
            continuously striving to refine and improve what we do, our ambition
            remains clear — to contribute towards building a more structured and
            responsible wildlife tourism ecosystem in India, where people
            connect with nature in an informed, ethical, and meaningful way.
          </p>
        </div>
      </div>
    </section>
  );
}
