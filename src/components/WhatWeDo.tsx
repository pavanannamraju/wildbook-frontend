import { useMemo, useState } from "react";
import GuideConnectImage from "../assets/GuideConnect.png";
import SharedSafarisImage from "../assets/SharedSafaris.png";
import WildLifePackagesImage from "../assets/WildLifePackages.png";
import { useNavigate } from "react-router-dom";

const tabs = [
  {
    title: "Guide Connect",
    heading: "Begin your journey with the people who know the forest best.",
    description:
      "Your journey into the wild begins with the people who know it best — local guides who help plan, host, and enrich every moment.",
    highlights: [
      "Speak directly with seasoned experts and gain insight for your trip.",
      "Book expert-led experiences - from birding trails to herping and more.",
      "Stay at guide-run homestays, rooted in local landscapes.",
    ],
    buttonText: "Find your Expert",
    buttonLink: "/experts",
    image: GuideConnectImage,
    buttonDisabled: false,
  },
  {
    title: "Shared Safaris",
    heading: "Some journeys become richer when shared with fellow explorers.",
    description:
      "Join small, well-curated safaris designed for enthusiasts who want richer sightings, expert context, and seamless planning.",
    highlights: [
      "Find wildlife enthusiasts headed to the same park, on the same dates",
      "Share costs, sightings, stories — and memories from the wild",
      "Join a ready safari plan or create your own,  built around your intent",
    ],
    buttonText: "Join/Create a Safari",
    buttonLink: "/safaris",
    image: SharedSafarisImage,
    buttonDisabled: false,
  },
  {
    title: "Wild Life Packages",
    heading: "Thoughtfully crafted journeys, ready when you are.",
    description:
      "Choose curated wildlife packages that combine locations, stays, and expert-led experiences into one coherent trip.",
    highlights: [
      "Discover curated plans from India’s leading wildlife tour operators",
      "Compare prices and itineraries across multiple packages easily",
      "Find the best value while enjoying a smooth, hassle-free booking",
    ],
    buttonText: "Discover Packages",
    buttonLink: "/packages",
    image: WildLifePackagesImage,
    buttonDisabled: true,
  },
] as const;

export function WhatWeDo() {
  const [activeTabTitle, setActiveTabTitle] = useState<string>(tabs[0].title);

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.title === activeTabTitle) ?? tabs[0],
    [activeTabTitle],
  );

  const navigate = useNavigate();

  const handleButtonClick = (link: string) => {
    navigate(link);
  };

  return (
    <section className="relative pt-10 page-px max-w-[1920px] mx-auto">
      <div className="mb-8 relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div className="max-w-[760px]">
          <h2 className="text-[20px] font-medium text-[#AB8640] mb-2">
            Our Offerings
          </h2>
          <p className="text-[24px] leading-tight text-[#2F2B28]">
            With the wild so complex, exploring it should feel simple
          </p>
        </div>
      </div>

      <div className="relative flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/2 rounded-2xl flex justify-center items-center">
          <img
            src={activeTab.image}
            alt={activeTab.title}
            className="max-w-[800px] w-full h-auto object-contain rounded-2xl"
            style={{ aspectRatio: "800/512" }}
          />
        </div>

        <div className="w-full lg:w-1/2 rounded-2xl bg-[#E8E2DC] px-2 py-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {tabs.map((tab) => {
              const isActive = tab.title === activeTab.title;
              return (
                <button
                  key={tab.title}
                  type="button"
                  onClick={() => setActiveTabTitle(tab.title)}
                  className={`rounded-[4px] px-2 py-1 text-center text-[16px] font-semibold transition-colors ${
                    isActive
                      ? "bg-[#0B6E66]/5 text-[#0B6E66]"
                      : "text-[#73706C] hover:bg-[#0B6E66]/5"
                  }`}
                >
                  {tab.title}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-8">
            <h3 className="text-3xl px-1 font-semibold text-[#0B6E66] leading-tight">
              {activeTab.heading}
            </h3>
            {/* <p className="text-[#73706C] text-base lg:text-lg">
              {activeTab.description}
            </p> */}
            <ul style={{ listStyleType: "circle" }} className="pl-5 space-y-1">
              {" "}
              {activeTab.highlights.map((highlight) => (
                <li key={highlight} className="text-[#2F2B28] text-md">
                  <div className="flex items-start gap-3 font-extralight">
                    <span>{highlight}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <button
            disabled={activeTab.buttonDisabled}
            onClick={() => handleButtonClick(activeTab.buttonLink)}
            className="inline-flex items-center text-[12px] gap-2 text-[#2F2B28] border border-[#3B372F] rounded px-6 mt-auto py-1 w-fit"
          >
            {activeTab.buttonText}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
