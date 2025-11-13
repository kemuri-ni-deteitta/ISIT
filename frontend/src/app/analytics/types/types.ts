import { ChartType } from "@/shared/types/chart";
import { DateRange } from "@/shared/types/dates";

export interface AnalyticsState {
  chartType: ChartType;
  filters: Record<string, unknown>;
  dateRange: DateRange;
  data: unknown[];
  loading: boolean;
  error: string | null;
}
