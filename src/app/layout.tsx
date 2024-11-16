import type { Metadata } from "next";
// import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
