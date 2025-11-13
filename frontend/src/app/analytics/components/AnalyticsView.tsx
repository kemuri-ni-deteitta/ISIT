"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Card, Flex, HStack, Select, Square, Text, Wrap, WrapItem, createListCollection } from "@chakra-ui/react";
import { expensesApi } from "@/shared/api/expenses";
import { referenceApi } from "@/shared/api/reference";
import type { Expense } from "@/shared/types/expense";
import { Chart, useChart } from "@chakra-ui/charts";
import { Pie, PieChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, Tooltip, ResponsiveContainer } from "recharts";

type ChartType = "pie" | "bar" | "line";
type PeriodOption = "last_30_days" | "last_7_days" | "this_month" | "all";

const chartTypes = createListCollection({
  items: [
    { label: "Круговая диаграмма", value: "pie" as ChartType },
    { label: "Столбчатая диаграмма", value: "bar" as ChartType },
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
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [listResp, cats] = await Promise.all([expensesApi.list(1, 1000), referenceApi.getCategories()]);
      if (!mounted) return;
      setExpenses(listResp.expenses);
      setCategoryNameById(Object.fromEntries(cats.map((c) => [c.id, c.name])));
      setCategoryIds(cats.map((c) => c.id));
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
    // Sum expenses per category
    const sumsByCategoryId: Record<string, number> = {};
    for (const e of filteredExpenses) {
      const key = e.category_id;
      const amount = Number(e.amount || "0");
      sumsByCategoryId[key] = (sumsByCategoryId[key] || 0) + amount;
    }
    // Build entries for all known categories so the legend always shows all types
    const entries = categoryIds.map((categoryId) => ({
      name: categoryNameById[categoryId] || categoryId,
      value: sumsByCategoryId[categoryId] || 0,
    }));
    // Sort by value desc so bigger slices first
    return entries.sort((a, b) => b.value - a.value);
  }, [filteredExpenses, categoryIds, categoryNameById]);

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
            <Flex gap={4} align="center" flex="1" minW="480px">
              <Text>Тип графика:</Text>
              <Select.Root
                w="360px"
                value={[chartType]}
                onValueChange={(d) => setChartType((d.value[0] as ChartType) || "pie")}
                collection={chartTypes}
              >
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
              <Wrap gap="16px" align="center" ml={4} flex="1" justify="flex-start">
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
                        <Text>
                          {d.name} — {Math.round((d.value as number) * 100) / 100} ₽
                        </Text>
                      </HStack>
                    </WrapItem>
                  );
                })}
              </Wrap>
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

          

        </Card.Body>
      </Card.Root>

      <Card.Root>
        <Card.Body py={6} px={6}>
          <Box w="100%" h="1000px">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "pie" ? (
                <PieChart>
                  <Pie
                    data={displayData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={0}
                    outerRadius={260}
                    paddingAngle={2}
                    cx="50%"
                    cy="52%"
                    isAnimationActive={false}
                  >
                    {displayData.map((_: any, idx: number) => (
                      <Cell key={idx} fill={colors[idx % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip isAnimationActive={false} />
                </PieChart>
              ) : (
                <BarChart data={displayData} margin={{ top: 16, right: 24, left: 8, bottom: 32 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip isAnimationActive={false} />
                  <Bar dataKey="value" isAnimationActive={false}>
                    {displayData.map((_: any, idx: number) => (
                      <Cell key={idx} fill={colors[idx % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </Box>
        </Card.Body>
      </Card.Root>
    </Box>
  );
};


