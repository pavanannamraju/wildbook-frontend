import logoLight from "../assets/Logo Dark.png";
import {
  EnvelopeSimple as EnvelopeSimpleIcon,
  InstagramLogo as InstagramLogoIcon,
  LinkedinLogo as LinkedinLogoIcon,
  YoutubeLogo as YoutubeLogoIcon,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import footerTop from "../assets/Mask group (1).svg";

  export function Footer() {
    return (
      <footer className="mt-20 mx-auto w-full max-w-[1920px] overflow-hidden">
        <img src={footerTop} alt="" aria-hidden="true" className="block w-full h-auto select-none" />
        <div className="page-px-footer flex flex-col justify-end bg-[#0e1b15] pb-4 pt-8">
          <div className="grid items-start gap-10 md:grid-cols-2 lg:grid-cols-6 lg:gap-8">
            <div className="lg:col-span-2">
              <Link to="/" className="inline-flex items-center" aria-label="Wildbook home">
                <img src={logoLight} alt="Wildbook" className="h-8 w-auto" />
              </Link>
              <p className="mt-4 max-w-[420px] text-sm leading-6 text-[#EDE7E2]/85">
                We connect travellers with trusted guides, naturalists, and responsible operators
                so every journey becomes an informed, immersive encounter that sustains places
                and people.
              </p>
            </div>

            <nav aria-label="Footer navigation" className="text-[#EDE7E2]">
              <p className="text-sm font-semibold tracking-wide text-[#EDE7E2]/90">Navigation</p>
              <ul className="mt-4 space-y-3 text-sm text-[#EDE7E2]/80">
                <li>
                  <Link className="hover:text-white transition-colors" to="/">
                    Home
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white transition-colors" to="/experts">
                    Explore Experts
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white transition-colors" to="/safaris">
                    Shared Safaris
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white transition-colors" to="/packages">
                    Discover Packages
                  </Link>
                </li>
              </ul>
            </nav>

            <nav aria-label="Footer company" className="text-[#EDE7E2]">
              <p className="text-sm font-semibold tracking-wide text-[#EDE7E2]/90">Company</p>
              <ul className="mt-4 space-y-3 text-sm text-[#EDE7E2]/80">
                <li>
                  <Link className="hover:text-white transition-colors" to="/about">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white transition-colors" to="/responsible">
                    Responsible
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white transition-colors" to="/wildlife-code">
                    Wildlife Code
                  </Link>
                </li>
              </ul>
            </nav>

            <nav aria-label="Footer other links" className="text-[#EDE7E2]">
              <p className="text-sm font-semibold tracking-wide text-[#EDE7E2]/90">Other Links</p>
              <ul className="mt-4 space-y-3 text-sm text-[#EDE7E2]/80">
                <li>
                  <Link className="hover:text-white transition-colors" to="/faqs">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white transition-colors" to="/privacy">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white transition-colors" to="/terms">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white transition-colors" to="/feedback">
                    Feedback
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="text-[#EDE7E2] md:col-start-2 md:col-span-1 lg:col-span-1">
              <p className="text-sm font-semibold tracking-wide text-[#EDE7E2]/90">Reach us at</p>
              <div className="mt-4 flex items-center gap-4">
                <a
                  href="#"
                  className="text-[#EDE7E2]/85 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramLogoIcon size={22} />
                </a>
                <a
                  href="#"
                  className="text-[#EDE7E2]/85 hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <YoutubeLogoIcon size={22} />
                </a>
                <a
                  href="#"
                  className="text-[#EDE7E2]/85 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedinLogoIcon size={22} />
                </a>
                <a
                  href="mailto:hello@wildbook.in"
                  className="text-[#EDE7E2]/85 hover:text-white transition-colors"
                  aria-label="Email"
                >
                  <EnvelopeSimpleIcon size={22} />
                </a>
              </div>

              <div className="mt-6 space-y-2 text-sm text-[#EDE7E2]/80">
                <p>Bengaluru, India</p>
                <a className="inline-flex hover:text-white transition-colors" href="tel:+918296567683">
                  +91 82965 67683
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 h-px w-full bg-[#EDE7E2]/15" />
          <p className="mt-4 text-xs text-[#EDE7E2]/70">
            © Copyright 2026&nbsp; |&nbsp; All Rights Reserved
          </p>
        </div>
      </footer>
    );
  }
