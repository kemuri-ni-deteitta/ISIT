import { Box, Heading } from "@chakra-ui/react";
import { AnalyticsView } from "./components/AnalyticsView";

export default async function AnalyticsPage() {
  return (
    <Box>
      <Heading textStyle="heading.title" mb="35px">
        Аналитика и отчётность
      </Heading>
      <AnalyticsView />
    </Box>
  );
}
