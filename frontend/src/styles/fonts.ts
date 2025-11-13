import { defineTextStyles } from "@chakra-ui/react";
import { Inter } from "next/font/google";

export const interFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const textStyles = defineTextStyles({
  heading: {
    title: {
      value: {
        fontFamily: "'Inter', sans-serif",
        fontWeight: 700,
        fontSize: "36px",
        lineHeight: "120%",
        letterSpacing: "-0.01em",
      },
    },
    description: {
      value: {
        fontFamily: "'Inter', sans-serif",
        fontWeight: 700,
        fontSize: "24px",
        lineHeight: "32px",
        letterSpacing: "0.02em",
      },
    },
  },
  body: {
    regular: {
      value: {
        fontFamily: "'Inter', sans-serif",
        fontWeight: 400,
        fontSize: "16px",
        lineHeight: "24px",
      },
    },
  },
});
