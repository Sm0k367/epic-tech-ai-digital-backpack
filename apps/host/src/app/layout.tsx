export const runtime = 'edge';

export const metadata = {
  title: 'Epic Tech AI – Digital Backpack',
  description: 'Zero-config, self-healing creative ecosystem.',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
