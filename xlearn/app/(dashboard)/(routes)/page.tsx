// import type { Metadata } from "next";
import Head from "next/head";

// export const medadata: Metadata = {
//   title: "collegeX | Home",
//   description: "collegeX Home Page",
// };

export default function Page() {
  return (
    <main>
      <Head>
        <title>collegeX | Home</title>
        <meta name="description" content="collegeX Home Page" />
      </Head>
      <h1>Home Page</h1>
      <p>Welcome to collegeX!</p>
    </main>
  );
}
