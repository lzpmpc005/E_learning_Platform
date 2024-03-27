import type { Metadata } from "next";

export const medadata: Metadata = {
  title: "collegeX | Home",
  description: "collegeX Home Page",
};

export default function Home() {
  return (
    <main>
      <h1>Home Page</h1>
      <p>Welcome to collegeX!</p>
    </main>
  );
}
