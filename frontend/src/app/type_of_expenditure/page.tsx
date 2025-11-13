import { Box, Heading } from "@chakra-ui/react";
import { ExpenseTypesManager } from "./expenses/components/ExpenseTypesManager";

export default function ExpenseTypesPage() {
  return (
    <Box>
      <Heading textStyle="heading.title" mb="35px">
        Типы затрат
      </Heading>
      <ExpenseTypesManager />
    </Box>
  );
}
