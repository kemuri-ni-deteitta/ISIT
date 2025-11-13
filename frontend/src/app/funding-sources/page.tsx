import { Box, Heading } from "@chakra-ui/react";
import { FundingSourcesManager } from "./components/FundingSourcesManager";

export default function FundingSourcesPage() {
  return (
    <Box>
      <Heading textStyle="heading.title" mb="35px">
        Источники финансирования
      </Heading>
      <FundingSourcesManager />
    </Box>
  );
}


