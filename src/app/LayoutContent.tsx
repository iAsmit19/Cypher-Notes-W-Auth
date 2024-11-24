"use client";

import Header from "@/components/Header";
import { useGlobalContext } from "@/context/AppContext";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showHeader } = useGlobalContext(); // get header visibility from context

  return (
    <>
      {showHeader && <Header />}
      <main>{children}</main>
    </>
  );
}
