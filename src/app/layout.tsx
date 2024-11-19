import Header from "@/components/Header";
import type { Metadata } from "next";
import "@/globals.css";
import { GlobalProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "Cypher Notes | Secured space for your thoughts ",
  description:
    "Cypher Notes App is a version of previous Cypher Notes App with additional features and functionalities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GlobalProvider>
          <Header />
          <main>{children}</main>
        </GlobalProvider>
      </body>
    </html>
  );
}
