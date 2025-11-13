import { Box, Heading } from "@chakra-ui/react";
import { AnalyticsToolbar } from "./components/AnalyticsToolbar";

export default async function AnalyticsPage() {
  return (
    <Box>
      <Heading textStyle="heading.title" mb="35px">
        Аналитика и отчётность
      </Heading>
      <AnalyticsToolbar />
    </Box>
  );
}
