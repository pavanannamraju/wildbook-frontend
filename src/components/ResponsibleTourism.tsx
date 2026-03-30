import ResponsibleTourismImage from "../assets/ceylon-spotted-deer 1.png";

const principles = [
  {
    number: "1.",
    title: "Beyond Iconic Species",
    description:
      "We encourage travellers to appreciate entire ecosystems - from birds and insects to plants and natural history - not just a single species.",
  },
  {
    number: "2.",
    title: "Respect for Nature",
    description:
      "Responsible travel means minimising disturbance to wildlife and habitats while promoting ethical practices in the field.",
  },
  {
    number: "3.",
    title: "Expert-Led Exploration",
    description:
      "Meaningful wildlife experiences are shaped by guides and naturalists who understand the wild, making your journey more about knowledge than recreation.",
  },
  {
    number: "4.",
    title: "Support Local Communities",
    description:
      "We partner with operators and homestays that support conservation while creating sustainable livelihoods for local communities.",
  },
];

export function ResponsibleTourism() {
  return (
    <section className="relative pt-10 page-px max-w-[1920px] mx-auto">
      {/* Decorative CONSERVE watermark */}

      <div className="mb-10 flex flex-col items-end text-right">
        <h2 className=" text-[#AB8640] tracking-wide">
          Our Take on Responsible Tourism
        </h2>
        <p className="text-xl text-[#2F2B28] font-semibold leading-relaxed">
          The wild doesn&apos;t belong to us. We belong to it.
        </p>
      </div>

      {/* Flex layout: both sides stretch to equal height without any fixed height */}
      <div className="flex flex-col lg:flex-row gap-6 relative z-10">
        {/* Left: Principles cards, stretch to match image */}
        <div className="w-full lg:w-[55%] flex flex-col">
          <div className="flex-1 flex">
            <div className="grid grid-cols-1 sm:grid-cols-2 grid-rows-4 sm:grid-rows-2 gap-4 w-full h-full">
              {principles.map((item) => (
                <div
                  key={item.number}
                  className="bg-[#EDE8E2] rounded-[20px] p-4 flex flex-col h-full min-h-0"
                >
                  <span className="text-[48px] sm:text-[36px] md:text-[40px]  text-[#0B6E66] shrink-0">
                    {item.number}
                  </span>
                  <h3 className="text-md font-[Nunito] font-extrabold sm:text-lg md:text-xl text-[#73716C] mb-1 shrink-0">
                    {item.title}
                  </h3>
                  <p className="text-[#73716C] text-sm sm:text-base font-semibold leading-5 flex-1">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right: Image, stretch to match grid */}
        <div className="w-full lg:w-[45%] flex items-stretch">
          <div className="flex-1 rounded-[20px] overflow-hidden flex">
            <img
              src={ResponsibleTourismImage}
              alt="Spotted deer in forest"
              className="w-full h-full object-cover"
              style={{}}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
