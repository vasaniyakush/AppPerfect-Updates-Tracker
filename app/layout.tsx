import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CssBaseline from "@mui/material/CssBaseline";
import { AppBar, Box, Link, Toolbar, Typography } from "@mui/material";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Updates Management",
  description: "Easy tool to create/combine daily updates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <CssBaseline />

      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppBar component="nav">
          <Toolbar style={{ minHeight: "50px" }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Mady by{" "}
              <Link
                color="textPrimary"
                href="https://www.vasaniyakush.me"
                target="_blank"
                rel="noopener noreferrer"
              >
                Kush Vasaniya
              </Link>
            </Typography>

            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography
                variant="button"
                component="div"
                sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
              >
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: "#fff", mr: 2 }}
                >
                  Create
                </Link>
              </Typography>
            </Box>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography
                variant="button"
                component="div"
                sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
              >
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="/combine"
                  sx={{ color: "#fff", mr: 2 }}
                >
                  Combine
                </Link>{" "}
              </Typography>
            </Box>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography
                variant="button"
                component="div"
                sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
              >
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="/instructions"
                  sx={{ color: "#fff" }}
                >
                  Instructions
                </Link>{" "}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        {children}
      </body>
    </html>
  );
}
