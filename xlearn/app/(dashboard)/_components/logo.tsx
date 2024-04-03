import Image from "next/image";

export const Logo = () => {
  return (
    <Image
      style={{ marginLeft: "0px" }}
      height={100}
      width={300}
      src="/logo.png"
      alt="logo"
    />
  );
};
