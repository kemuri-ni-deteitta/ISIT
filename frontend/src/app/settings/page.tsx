import { Box, Grid, Heading } from "@chakra-ui/react";
import { ExpenseTypesManager } from "./expenses/components/ExpenseTypesManager";

export default async function SettingsPage() {
  return (
    <Box>
      <Heading textStyle="heading.title" mb="35px">
        Настройки системы
      </Heading>
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <ExpenseTypesManager />
      </Grid>
    </Box>
  );
}
