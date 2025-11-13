"use client";

import { system } from "@/styles/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeProvider } from "./color-mode";
import { Provider } from "react-redux";
import { createReduxStore } from "@/store/store";
import { Toaster } from "./toaster";

const store = createReduxStore();


export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ChakraProvider value={system}>
        <ColorModeProvider defaultTheme="light" enableSystem={false}>
          {props.children}
          <Toaster />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  );
}
