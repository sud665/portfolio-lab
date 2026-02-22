export default function WishketLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="wishket-light bg-white text-gray-900">
      <main className="min-h-screen">{children}</main>
    </div>
  );
}
