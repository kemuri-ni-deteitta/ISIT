import { ChartType } from "@/shared/types/chart";
import { DateRange } from "@/shared/types/dates";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAnalyticsData } from "../services/fetchAnalyticsData";
import { AnalyticsState } from "../types/types";

const initialState: AnalyticsState = {
  chartType: "line",
  filters: {},
  dateRange: { from: null, to: null },
  data: [],
  loading: false,
  error: null,
};

export const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setChartType(state, action: PayloadAction<ChartType>) {
      state.chartType = action.payload;
    },
    setFilters(state, action: PayloadAction<Record<string, any>>) {
      state.filters = action.payload;
    },
    setDateRange(state, action: PayloadAction<DateRange>) {
      state.dateRange = action.payload;
    },
    resetAnalytics(state) {
      state.filters = {};
      state.dateRange = { from: null, to: null };
      state.chartType = "line";
      state.data = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAnalyticsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setChartType, setFilters, setDateRange, resetAnalytics } = analyticsSlice.actions;
export const analyticsReducer = analyticsSlice.reducer;
