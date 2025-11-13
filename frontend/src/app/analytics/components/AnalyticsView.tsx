"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Card, Flex, HStack, Select, Square, Text, Wrap, WrapItem, createListCollection, Checkbox } from "@chakra-ui/react";
import { expensesApi } from "@/shared/api/expenses";
import { referenceApi } from "@/shared/api/reference";
import type { Expense } from "@/shared/types/expense";
import { Chart, useChart } from "@chakra-ui/charts";
import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from "recharts";

type ChartType = "pie" | "bar" | "line";
type PeriodOption = "last_30_days" | "last_7_days" | "this_month" | "all";

const chartTypes = createListCollection({
  items: [
    { label: "Круговая диаграмма", value: "pie" as ChartType },
    // Future: { label: "Гистограмма", value: "bar" as ChartType },
    // Future: { label: "Линейный график", value: "line" as ChartType },
  ],
});

const periodOptions = createListCollection({
  items: [
    { label: "Последние 7 дней", value: "last_7_days" as PeriodOption },
    { label: "Последние 30 дней", value: "last_30_days" as PeriodOption },
    { label: "Текущий месяц", value: "this_month" as PeriodOption },
    { label: "Всё время", value: "all" as PeriodOption },
  ],
});

function getDateFromPeriod(p: PeriodOption): Date | null {
  const now = new Date();
  switch (p) {
    case "last_7_days":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    case "last_30_days":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
    case "this_month":
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case "all":
    default:
      return null;
  }
}

export const AnalyticsView = () => {
  const [chartType, setChartType] = useState<ChartType>("pie");
  const [period, setPeriod] = useState<PeriodOption>("all");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categoryNameById, setCategoryNameById] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [listResp, cats] = await Promise.all([expensesApi.list(1, 1000), referenceApi.getCategories()]);
      if (!mounted) return;
      setExpenses(listResp.expenses);
      setCategoryNameById(Object.fromEntries(cats.map((c) => [c.id, c.name])));
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredExpenses = useMemo(() => {
    const from = getDateFromPeriod(period);
    if (!from) return expenses;
    return expenses.filter((e) => new Date(e.incurred_on) >= from);
  }, [expenses, period]);

  const dataByCategory = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const e of filteredExpenses) {
      const key = e.category_id;
      const amount = Number(e.amount || "0");
      acc[key] = (acc[key] || 0) + amount;
    }
    const entries = Object.entries(acc)
      .map(([categoryId, value]) => ({
        name: categoryNameById[categoryId] || categoryId,
        value,
      }))
      .sort((a, b) => b.value - a.value);
    return entries;
  }, [filteredExpenses, categoryNameById]);

  const chart = useChart({
    data: dataByCategory,
  });

  const colors = ["#93c5fd", "#fbcfe8", "#fde68a", "#a7f3d0", "#ddd6fe", "#fcd34d", "#fdba74", "#86efac"];

  // Initialize selection once when data arrives
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current && dataByCategory.length > 0) {
      setSelected(new Set(dataByCategory.map((d) => d.name)));
      initializedRef.current = true;
    }
  }, [dataByCategory]);

  const toggleCategory = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const displayData = useMemo(() => {
    if (selected.size === 0) return chart.data;
    return chart.data.filter((d: any) => selected.has(d.name));
  }, [chart.data, selected]);

  return (
    <Box>
      <Card.Root mb={4}>
        <Card.Body>
          <Flex gap={6} align="center" justify="space-between" wrap="wrap">
            <Flex gap={3} align="center" flex="1" minW="360px">
              <Text>Тип графика:</Text>
              <Select.Root value={[chartType]} onValueChange={(d) => setChartType((d.value[0] as ChartType) || "pie")} collection={chartTypes}>
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Выберите тип графика" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Select.Positioner>
                  <Select.Content>
                    {chartTypes.items.map((i) => (
                      <Select.Item key={i.value} item={i}>
                        {i.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Select.Root>
            </Flex>
            <Flex gap={3} align="center">
              <Text>Период:</Text>
              <Select.Root value={[period]} onValueChange={(d) => setPeriod((d.value[0] as PeriodOption) || "last_30_days")} collection={periodOptions}>
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Выберите период" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Select.Positioner>
                  <Select.Content>
                    {periodOptions.items.map((i) => (
                      <Select.Item key={i.value} item={i}>
                        {i.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Select.Root>
            </Flex>
          </Flex>

          {/* Legend row (centered under toolbar) */}
          <Flex justify="center" mt={3}>
            <Wrap gap="24px" align="center">
              {chart.data.map((d: any, idx: number) => {
                const color = colors[idx % colors.length];
                const isOn = selected.has(d.name);
                return (
                  <WrapItem key={d.name}>
                    <HStack
                      gap={2}
                      cursor="pointer"
                      onClick={() => toggleCategory(d.name)}
                      opacity={isOn ? 1 : 0.4}
                      _hover={{ opacity: 0.85 }}
                    >
                      <Square size="12px" bg={color} borderRadius="sm" />
                      <Text>{d.name}</Text>
                    </HStack>
                  </WrapItem>
                );
              })}
            </Wrap>
          </Flex>

        </Card.Body>
      </Card.Root>

      <Card.Root>
        <Card.Body py={6} px={6}>
          <Box w="100%" h="560px">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={110}
                  outerRadius={180}
                  paddingAngle={1}
                  cx="50%"
                  cy="45%"
                  isAnimationActive={false}
                >
                  {displayData.map((_: any, idx: number) => (
                    <Cell key={idx} fill={colors[idx % colors.length]} />
                  ))}
                </Pie>
                <Tooltip isAnimationActive={false} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Card.Body>
      </Card.Root>
    </Box>
  );
};


