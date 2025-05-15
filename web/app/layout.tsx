export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {typeof window === 'undefined' ? null : children}
      </body>
    </html>
  )
}

