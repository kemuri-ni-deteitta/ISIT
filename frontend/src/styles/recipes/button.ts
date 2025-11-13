import { defineRecipe } from "@chakra-ui/react";

export const buttonRecipe = defineRecipe({
  base: {
    display: "flex",
  },
  variants: {
    variant: {
      solid: {
        bg: "teal.500",
        color: "white",
        _hover: { bg: "teal.600" },
        _active: { bg: "teal.700" },
      },
    },
  },
});
