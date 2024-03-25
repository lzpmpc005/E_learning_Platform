import cn from "classnames";

interface Props {
  provider: "google" | "github";
  children: React.ReactNode;
  [rest: string]: any;
}

export default function SocialButton({ provider, children, ...rest }: Props) {
  const className = cn(
    "flex-1 text-white rounded-md px-3 mt-3 py-2 font-medium",
    {
      "bg-[#DB4437] hover:bg-[#C33C23]": provider === "google",
      "bg-[#24292E] hover:bg-[#1B1F23]": provider === "github",
    }
  );

  return (
    <button className={className} {...rest}>
      <span className="flex justify-start items-center">{children}</span>
    </button>
  );
}
