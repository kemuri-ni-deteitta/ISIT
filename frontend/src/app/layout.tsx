"use client";
import { Box } from "@chakra-ui/react";
import { interFont } from "../styles/fonts";
import Provider from "@/components/ui/provider";
import Navbar from "@/components/ui/navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={interFont.variable} suppressHydrationWarning>
      <body style={{ margin: 0, height: "100vh", overflow: "hidden" }}>
        <Provider>
          <Navbar />
          <Box as="main" pt="35px" px="65px" mt="60px" height="calc(100vh - 60px)" overflow="auto" bg="#f3f6f6">
            {children}
          </Box>
        </Provider>
      </body>
    </html>
  );
}
