import Image from "next/image";

interface HeaderProps {
  cartItemCount: number;
  onCartToggle: () => void;
}

export default function Header({ cartItemCount, onCartToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-white">
      <div className="flex items-center justify-between h-16 w-[90%] mx-auto mt-4 mb-2">
        <div className="flex items-center">
          <Image
            src="https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/logo.jpg"
            alt="Logo"
            width={56}
            height={56}
            className="rounded-full"
          />
          <div className="ml-2 text-xl font-semibold">gasyaponpon</div>
        </div>
        <div className="py-4 flex justify-end items-center">
          <button type="button" className="cursor-pointer" onClick={onCartToggle}>
            <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
                className="h-4 transition-all ease-in-out hover:scale-110"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              {cartItemCount > 0 && (
                <div className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded bg-blue-600 text-[11px] font-medium text-white">
                  {cartItemCount}
                </div>
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
