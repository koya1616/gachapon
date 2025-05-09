import Footer from "@/app/[lang]/_components/Footer";
import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

describe("Footerコンポーネント", () => {
  beforeEach(() => {
    cleanup();
  });

  it("フッターが正しくレンダリングされること", () => {
    render(<Footer />);

    const footerElement = screen.getByRole("contentinfo");
    expect(footerElement).toBeDefined();

    expect(screen.getByText("© 2025 Gachapon. All rights reserved.")).toBeDefined();
  });
  it("ソーシャルメディアリンクが正しく表示されること", () => {
    render(<Footer />);

    const socialMediaNames = ["Facebook", "Instagram", "YouTube", "TikTok", "Twitter"];

    for (const name of socialMediaNames) {
      expect(screen.getByText(name)).toBeDefined();
    }
  });

  it("ソーシャルメディアリンクが正しいURLを持っていること", () => {
    render(<Footer />);

    const links = screen.getAllByRole("link");

    const socialMediaUrls = {
      Facebook: "https://www.instagram.com/gasyaponpon",
      Instagram: "https://www.instagram.com/gasyaponpon",
      YouTube: "https://www.instagram.com/gasyaponpon",
      TikTok: "https://www.instagram.com/gasyaponpon",
      Twitter: "https://www.instagram.com/gasyaponpon",
    };

    type SocialMediaKey = keyof typeof socialMediaUrls;

    for (const link of links) {
      const linkText = link.textContent?.trim();
      if (linkText && Object.keys(socialMediaUrls).includes(linkText)) {
        const key = linkText as SocialMediaKey;
        expect(link.getAttribute("href")).toBe(socialMediaUrls[key]);
        expect(link.getAttribute("target")).toBe("_blank");
        expect(link.getAttribute("rel")).toBe("noopener noreferrer");
      }
    }
  });

  it("ソーシャルメディアアイコンが表示されること", () => {
    render(<Footer />);

    const svgIcons = document.querySelectorAll("svg");
    expect(svgIcons.length).toBe(5);

    for (const icon of svgIcons) {
      expect(icon.getAttribute("aria-hidden")).toBe("true");
      expect(icon.getAttribute("focusable")).toBe("false");
    }
  });
});
