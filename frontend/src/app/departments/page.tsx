import { Box, Heading } from "@chakra-ui/react";
import { DepartmentsManager } from "./components/DepartmentsManager";

export default function DepartmentsPage() {
  return (
    <Box>
      <Heading textStyle="heading.title" mb="35px">
        Подразделения
      </Heading>
      <DepartmentsManager />
    </Box>
  );
}


