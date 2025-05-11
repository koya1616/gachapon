import { Button } from "@/components/Button";
import { CloseIcon, MenuIcon } from "@/components/Icons";
import Image from "next/image";
import Link from "next/link";
import type { AdminHeaderLogic } from "../../layout";

const AdminHeaderView = ({
  pathname,
  isMenuOpen,
  navigationLinks,
  toggleMenu,
  handleMobileNavClick,
}: AdminHeaderLogic) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/admin/top" className="flex-shrink-0 flex items-center">
              <Image
                src="https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/logo.jpg"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
            </Link>

            <nav className="hidden md:ml-8 md:flex md:space-x-6">
              {navigationLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === link.path
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center">
            <div className="flex md:hidden ml-4">
              <Button color="gray" variant="text" onClick={toggleMenu}>
                <MenuIcon className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`} />
                <CloseIcon className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {navigationLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === link.path
                  ? "border-blue-500 text-blue-700 bg-blue-50"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              }`}
              onClick={handleMobileNavClick}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default AdminHeaderView;
