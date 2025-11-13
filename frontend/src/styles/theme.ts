import { defaultConfig, createSystem, defineConfig } from "@chakra-ui/react";
import { textStyles } from "./fonts";
import { buttonRecipe } from "./recipes/button";

const config = defineConfig({
  theme: {
    textStyles,
    recipes: {
      button: buttonRecipe,
    },
    tokens: {
      fonts: {
        body: { value: "'Inter', sans-serif" },
        heading: { value: "'Inter', sans-serif" },
      },
      colors: {},
    },
  },
});

export const system = createSystem(defaultConfig, config);
