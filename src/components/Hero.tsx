import { forwardRef } from "react";
import bannerImage from "../assets/AdobeStock_1470275437 1.png";
import { GlassButton } from "react-glass-ui";
import Navbar from "./Navbar";

const HEADING_FONT_STYLE: React.CSSProperties = {
  fontFamily: '"Cocogoose Pro"',
  fontWeight: 250,
  fontSize: "70px",
  fontStyle: "normal"
};

export const Hero = forwardRef<HTMLElement>(function Hero(_, ref) {
  return (
    <section
      ref={ref}
      className="relative mx-auto  max-w-[1920px] bg-cover bg-no-repeat sm:bg-left bg-bottom"
      style={{ backgroundImage: `url('${bannerImage}')`, backgroundPosition: "center"}}
    >
      <div className="mx-auto max-w-[1920px]">
        <Navbar variant="light" />
      </div>
      <div className="page-px py-8">
        <h1 className="mb-12 flex flex-col gap-4 pt-20 leading-[0.95] text-[#EDE8E2]/90 md:text-7xl">
        {
          ["connect", "conserve", "coexist"].map((word, index) => (
            <span
              key={index}
              style={{
                ...HEADING_FONT_STYLE,
                textShadow: "0px 0px 8px black, 0px 1px 1px #264e4566"
              }}
              className="drop-shadow-lg"
            >
              {word}
            </span>
          ))
        }
        </h1>

        <p className="mb-32 max-w-[350px] font-[Nunito] text-[28px] text-[#7FCDB2] leading-tight">
          Introducing India&apos;s first integrated digital wildlife platform.
        </p>

        {/* <GlassButton borderRadius={1000} width={300}>
          Explore Trips
        </GlassButton> */}
      </div>
 
    </section>
  );
});
