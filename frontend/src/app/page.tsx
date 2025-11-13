import { Box, Heading, Text, Card, Grid, Stack, HStack, Button, Badge } from "@chakra-ui/react";
import { LuFileChartPie, LuLayers, LuSearch, LuFileText, LuShieldCheck, LuTrendingUp, LuArrowRight } from "react-icons/lu";

export default async function Page() {
  return (
    <Box>
      <Heading textStyle="heading.title" mb="35px">
        Главная
      </Heading>
      <Grid
        columns={{ base: 1, md: 2 }}
        gap={{ base: 6, md: 8 }}
        alignItems="stretch"
      >
        <Card.Root>
          <Card.Body>
            <Stack gap={5}>
              <Stack gap={2}>
                <Badge colorPalette="blue" size="md" width="fit-content">
                  Новая платформа
                </Badge>
                <Heading size="xl">
                  Информационная система анализа операционных затрат холдинга
                </Heading>
                <Text color="gray.600" fontSize="lg">
                  Современное решение для повышения прозрачности и эффективности управления расходами.
                </Text>
              </Stack>

              <Stack gap={3}>
                <HStack align="start" gap={3}>
                  <LuLayers size={20} />
                  <Text>
                    централизовать учёт всех операционных затрат;
                  </Text>
                </HStack>
                <HStack align="start" gap={3}>
                  <LuShieldCheck size={20} />
                  <Text>
                    контролировать расходы по отделам, категориям и источникам финансирования;
                  </Text>
                </HStack>
                <HStack align="start" gap={3}>
                  <LuSearch size={20} />
                  <Text>
                    быстро находить нужные данные и формировать аналитические отчёты;
                  </Text>
                </HStack>
                <HStack align="start" gap={3}>
                  <LuFileText size={20} />
                  <Text>
                    отслеживать статус каждого платежа и прикреплённые документы;
                  </Text>
                </HStack>
                <HStack align="start" gap={3}>
                  <LuFileChartPie size={20} />
                  <Text>
                    получать наглядные диаграммы и отчёты, показывающие, куда уходят средства.
                  </Text>
                </HStack>
              </Stack>

              <Text color="gray.700">
                Используя нашу платформу, организация сможет сократить время на подготовку отчётности,
                снизить операционные издержки и повысить финансовую прозрачность бизнеса.
              </Text>

              <HStack gap={3} pt={2}>
                <Button asChild colorPalette="blue">
                  <a href="/expenses">
                    Ввести затраты
                    <LuArrowRight style={{ marginLeft: 8 }} />
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/analytics">
                    Перейти к аналитике
                    <LuTrendingUp style={{ marginLeft: 8 }} />
                  </a>
                </Button>
              </HStack>
            </Stack>
          </Card.Body>
        </Card.Root>

        <Stack gap={6}>
          <Card.Root>
            <Card.Body>
              <Stack gap={2}>
                <Heading size="md">Преимущества</Heading>
                <Text color="gray.600">
                  Всё, что нужно для прозрачного контроля расходов в одном месте.
                </Text>
              </Stack>
              <Stack gap={4} mt={4}>
                <HStack gap={3}>
                  <Badge colorPalette="teal">1</Badge>
                  <Text>Единая база затрат по всем подразделениям и категориям</Text>
                </HStack>
                <HStack gap={3}>
                  <Badge colorPalette="purple">2</Badge>
                  <Text>Гибкая аналитика и визуализация — круговые, столбчатые и линейные графики</Text>
                </HStack>
                <HStack gap={3}>
                  <Badge colorPalette="orange">3</Badge>
                  <Text>Статусы платежей и документы всегда под рукой</Text>
                </HStack>
              </Stack>
            </Card.Body>
          </Card.Root>

          <Card.Root>
            <Card.Body>
              <Stack gap={2}>
                <Heading size="md">Быстрый старт</Heading>
                <Text color="gray.600">
                  Добавьте первые записи о затратах и сразу посмотрите отчёты.
                </Text>
              </Stack>
              <HStack gap={3} mt={4}>
                <Button asChild>
                  <a href="/type_of_expenditure">Настроить типы затрат</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/departments">Добавить подразделения</a>
                </Button>
              </HStack>
            </Card.Body>
          </Card.Root>
        </Stack>
      </Grid>
    </Box>
  );
}
