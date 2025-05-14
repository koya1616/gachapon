import { FacebookIcon, InstagramIcon, TikTokIcon, TwitterIcon, YouTubeIcon } from "@/components/Icons";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8 bg-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gray-200/50 to-transparent opacity-50" />

        <div className="animate-float absolute bottom-20 left-10 sm:left-20 w-16 h-16 rounded-full border-4 border-pink-200/30" />
        <div className="animate-float-delayed absolute top-20 right-10 sm:right-20 w-12 h-12 rounded-full border-4 border-blue-200/30" />

        <div className="absolute bottom-0 left-0 w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="text-gray-200/30"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              fillOpacity="1"
              d="M0,192L48,197.3C96,203,192,213,288,218.7C384,224,480,224,576,202.7C672,181,768,139,864,138.7C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 inline-block relative group">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-500 animate-pulse-slow">
            ガチャポン
          </span>
          <span className="animate-bounce-slow inline-block ml-2">✨</span>
          <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-pink-400 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </h2>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
          {[
            {
              name: "Twitter",
              id: "twitter",
              href: "https://www.instagram.com/gasyaponpon",
              icon: <TwitterIcon />,
              color: "blue",
            },
            {
              name: "Instagram",
              id: "instagram",
              href: "https://www.instagram.com/gasyaponpon",
              icon: <InstagramIcon />,
              color: "pink",
            },
            {
              name: "Facebook",
              id: "facebook",
              href: "https://www.instagram.com/gasyaponpon",
              icon: <FacebookIcon />,
              color: "blue",
            },
            {
              name: "YouTube",
              id: "youtube",
              href: "https://www.instagram.com/gasyaponpon",
              icon: <YouTubeIcon />,
              color: "red",
            },
            {
              name: "TikTok",
              id: "tiktok",
              href: "https://www.instagram.com/gasyaponpon",
              icon: <TikTokIcon />,
              color: "teal",
            },
          ].map((social, idx) => (
            <Link
              key={social.id}
              href={social.href}
              aria-label={`${social.name}に移動`}
              className={`flex items-center hover:text-${social.color}-400 transition-colors duration-300`}
              style={{ animationDelay: `${idx * 0.1}s` }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {social.icon}
            </Link>
          ))}
        </div>

        <p className="text-gray-500 text-xs sm:text-sm animate-fade-in-delayed">
          © {new Date().getFullYear()} Gachapon. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
