import footerBg from "../assets/Footer.png";

export function Footer() {
  return (
    <footer className="relative mt-20 mx-auto max-w-[1920px]">
      {/* Background image */}
      <div
        className="absolute inset-0 min-h-[324px] bg-cover bg-bottom bg-no-repeat"
        style={{ backgroundImage: `url(${footerBg})` }}
      />

      {/* Content */}
      <div className="relative z-10 pt-48 pb-10 page-px-footer min-h-[324px]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-auto pt-4">
          <p className="text-[#E2E2E2] text-sm">
            © Property of Wildbook Pvt. Ltd.
          </p>
          <div className="flex items-center gap-8">
            <a
              href="#"
              className="text-[#E2E2E2] hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="18" cy="6" r="1" fill="currentColor" />
              </svg>
            </a>
            <a
              href="#"
              className="text-[#E2E2E2] hover:text-white transition-colors"
              aria-label="YouTube"
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
              </svg>
            </a>
            <a
              href="#"
              className="text-[#E2E2E2] hover:text-white transition-colors"
              aria-label="Email"
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
