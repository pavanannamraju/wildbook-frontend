import Anurag from "../assets/Profile_Team.png";
import NishadBarde from "../assets/Profile_Team_1.png";
import Pavan from "../assets/Profile_Team_2.png";
import Sangeetha from "../assets/Profile_Team_3.png";

const teamMembers = [
  {
    name: "Anurag Jha",
    role: "FOUNDER AND CEO",
    image: Anurag,
    offsetUp: true,
  },
  {
    name: "Nishad Barde",
    role: "CO FOUNDER",
    image: NishadBarde,
    offsetUp: false,
  },
  {
    name: "Pavan Annamaraju",
    role: "CHIEF TECHNOLOGY OFFICER",
    image: Pavan,
    offsetUp: true,
  },
  {
    name: "Sangeetha Venugopalan",
    role: "CHIEF DESIGN OFFICER",
    image: Sangeetha,
    offsetUp: false,
  },
];

export function Team() {
  return (
    <section className="relative pt-10 page-px max-w-[1920px] mx-auto">
      {/* Section Header */}
      <header className="flex flex-col w-full max-w-[621px] items-start gap-2 relative z-10">
        <h2 className="text-[20px] font-medium text-[#AB8640] tracking-wide">
          People Behind the Mission
        </h2>

        <p className="relative font-['Nunito',Helvetica] font-semibold text-[#3b372f] text-base sm:text-md lg:text-xl tracking-[0] leading-[normal]">
          We&apos;re a diverse team of naturalists, designers, filmmakers,
          engineers, and consultants, united by a genuine love for wildlife and
          the stories it inspires.
        </p>
      </header>

      {/* Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-12 lg:mt-16 xl:mt-24 relative z-10">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className={`flex w-full items-center ${member.offsetUp ? "xl:pt-0 xl:pb-8" : "xl:pt-8 xl:pb-0"}`}
          >
            <div className="flex flex-col aspect-4/5 w-full min-h-0 items-start justify-end p-4 sm:p-6 lg:p-8 rounded-[20px] relative overflow-hidden group">
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
              >
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    alt={member.name}
                    src={member.image}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                </div>
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/80" />
              </div>

              <div className="px-4 lg:px-6 py-3 lg:py-4 w-full bg-white/10 rounded-[10px] backdrop-blur-[5px] flex flex-col items-start justify-end relative z-10 border border-white/20">
                <div className="flex flex-col items-start gap-1 w-full">
                  <h3 className="font-['Nunito',Helvetica] font-bold text-[#ede7e2] text-lg sm:text-xl lg:text-2xl tracking-[0] leading-tight">
                    {member.name}
                  </h3>

                  <p className="text-xs lg:text-sm font-['Nunito',Helvetica] font-normal text-[#ede7e2] tracking-wider uppercase opacity-80">
                    {member.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
