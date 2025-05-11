import { FacebookIcon, InstagramIcon, TikTokIcon, TwitterIcon, YouTubeIcon } from "@/components/Icons";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <p className="text-center text-sm">© 2025 Gachapon. All rights reserved.</p>
          </div>
          <ul className="flex flex-wrap justify-center gap-6">
            <li>
              <a
                href="https://www.instagram.com/gasyaponpon"
                className="flex items-center hover:text-blue-400 transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon />
                <span className="hidden">Facebook</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/gasyaponpon"
                className="flex items-center hover:text-pink-500 transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon />
                <span className="hidden">Instagram</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/gasyaponpon"
                className="flex items-center hover:text-red-500 transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <YouTubeIcon />
                <span className="hidden">YouTube</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/gasyaponpon"
                className="flex items-center hover:text-teal-400 transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TikTokIcon />
                <span className="hidden">TikTok</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/gasyaponpon"
                className="flex items-center hover:text-blue-500 transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon />
                <span className="hidden">Twitter</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
