import { Box, Heading, Text, Card } from "@chakra-ui/react";

export default async function Page() {
  return (
    <Box>
      <Heading textStyle="heading.title" mb="35px">
        Главная
      </Heading>
      <Card.Root>
        <Card.Body>
          <Text>Добро пожаловать в систему управления операционными расходами</Text>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}
