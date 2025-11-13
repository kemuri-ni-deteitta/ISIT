"use client";

import { Flex, Portal, Select, Text, createListCollection } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { ChartType, PeriodOption } from "@/shared/types/chart";
import { getChartType, getDateRange } from "../selectors/selectors";
import { DateRangePicker } from "@/components/ui/DateRangePicker";

const chartTypes = createListCollection({
  items: [
    { label: "Линейный график", value: "line" as ChartType },
    { label: "Гистограмма", value: "bar" as ChartType },
    { label: "Круговая диаграмма", value: "pie" as ChartType },
  ],
});

export const periodOptions = createListCollection<{ label: string; value: PeriodOption }>({
  items: [
    { label: "Сегодня", value: "today" },
    { label: "Вчера", value: "yesterday" },
    { label: "Эта неделя", value: "this_week" },
    { label: "Прошлая неделя", value: "last_week" },
    { label: "Этот месяц", value: "this_month" },
    { label: "Прошлый месяц", value: "last_month" },
    { label: "Последние 7 дней", value: "last_7_days" },
    { label: "Последние 30 дней", value: "last_30_days" },
  ],
});

export const AnalyticsToolbar = () => {
  const dispatch = useDispatch();
  const chartType = useSelector(getChartType);
  const dateRange = useSelector(getDateRange);

  const handleDateChange = (range: { from: string | null; to: string | null }) => {
    // dispatch(setDateRange(range));
  };

  return (
    <Flex alignItems="center" justifyContent="space-between" bg="white" p={4} borderRadius="xl" shadow="sm" mb={4}>
      <Flex>
        <Text mr={2}>Тип графика:</Text>
        <Select.Root collection={chartTypes}>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Выберите тип графика" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {chartTypes.items.map((chartType) => (
                  <Select.Item item={chartType} key={chartType.value}>
                    {chartType.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </Flex>
      <Flex>
        <Flex alignItems="center">
          <Text mr={2}>Период:</Text>
          <Select.Root
            collection={periodOptions}
            value={dateRange?.period} // предположим, что dateRange содержит поле period
            onValueChange={(val) => handlePeriodChange(val as PeriodOption)}
          >
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Выберите период" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {periodOptions.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </Flex>
      </Flex>
    </Flex>
  );
};
