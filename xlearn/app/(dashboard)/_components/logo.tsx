import Image from "next/image";

export const Logo = () => {
  return (
    <Image
      style={{ marginLeft: "36px" }}
      height={100}
      width={100}
      src="/logo.jpg"
      alt="logo"
    />
  );
};
