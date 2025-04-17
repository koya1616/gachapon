import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Image src="/image.jpg" alt="image" width={500} height={500} priority />
    </div>
  );
}
