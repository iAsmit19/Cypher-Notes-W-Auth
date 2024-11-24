import "@/globals.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="cy_auth">
      <div className="cy_auth_cont">{children}</div>
    </div>
  );
}
