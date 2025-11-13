"use client";

import { ListCollection, Popover, Portal, Select } from "@chakra-ui/react";
import { CalendarPanel } from "chakra-dayzed-datepicker";
import { useState, useMemo } from "react";
import { MONTHS_NAMES, WEEKDAYS_NAMES_SHORT } from "@/shared/constants/date";
import { DateRange } from "@/shared/types/dates";
import { isBefore, isAfter } from "date-fns";
import { PeriodOption } from "@/shared/types/chart";

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateChange: (range: DateRange) => void;
  options: ListCollection<{
    label: string;
    value: unknown;
  }>;
}

interface DayzedDate {
  date: Date;
  selected?: boolean;
  disabled?: boolean;
}

const defaultOptions: PeriodOption[] = [
  { label: "Сегодня", value: "today" },
  { label: "Вчера", value: "yesterday" },
  { label: "Эта неделя", value: "this_week" },
  { label: "Прошлая неделя", value: "last_week" },
  { label: "Этот месяц", value: "this_month" },
  { label: "Прошлый месяц", value: "last_month" },
  { label: "Последние 7 дней", value: "last_7_days" },
  { label: "Последние 30 дней", value: "last_30_days" },
];

export const DateRangePicker = ({ dateRange, onDateChange, options = defaultOptions }: DateRangePickerProps) => {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const inRange = useMemo(
    () => (date: Date) => {
      if (!dateRange.from && !dateRange.to) return false;
      const fromDate = dateRange.from ? new Date(dateRange.from) : null;
      const toDate = dateRange.to ? new Date(dateRange.to) : null;
      if (fromDate && toDate) return !isBefore(date, fromDate) && !isAfter(date, toDate);
      if (fromDate) return !isBefore(date, fromDate);
      if (toDate) return !isAfter(date, toDate);
      return false;
    },
    [dateRange]
  );

  const onDateSelected = (selectedDate: DayzedDate, event: React.SyntheticEvent) => {
    const date = selectedDate.date;
    let newSelected = [...selectedDates];

    if (newSelected.length === 0) {
      newSelected = [date];
    } else if (newSelected.length === 1) {
      newSelected.push(date);
      newSelected.sort((a, b) => a.getTime() - b.getTime());
      onDateChange({ from: newSelected[0].toISOString(), to: newSelected[1].toISOString() });
      newSelected = [];
    }

    setSelectedDates(newSelected);
  };

  return (
    <Popover.Root>
      <Select.Root collection={options}>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Выберите период" />
          </Select.Trigger>
        </Select.Control>
        <Portal>
          <Select.Content>
            {options.items.map((opt) => (
              <Select.Item key={opt.label} item={opt}>
                {opt.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Portal>
      </Select.Root>

      <Popover.Positioner>
        <Popover.Content>
          <Popover.CloseTrigger />
          <Popover.Arrow>
            <Popover.ArrowTip />
          </Popover.Arrow>
          <Popover.Body>
            <CalendarPanel
              configs={{
                dateFormat: "YYYY-MM-DD",
                monthNames: MONTHS_NAMES,
                dayNames: WEEKDAYS_NAMES_SHORT,
                firstDayOfWeek: 1,
              }}
              propsConfigs={{
                dayOfMonthBtnProps: {
                  defaultBtnProps: { _hover: { bg: "#0037C5", color: "white" } },
                  selectedBtnProps: { bg: "#0037C5", color: "white" },
                  isInRangeBtnProps: { bg: "#0037C5", color: "white" },
                },
              }}
              onMouseEnterHighlight={setHoveredDate}
              dayzedHookProps={{
                selected: selectedDates,
                onDateSelected,
                monthsToDisplay: 1,
                firstDayOfWeek: 1,
                maxDate: new Date(),
              }}
            />
          </Popover.Body>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
};
