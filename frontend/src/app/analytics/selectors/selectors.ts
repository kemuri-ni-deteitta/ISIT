import { StateSchema } from "@/store/StateSchema";
import { createSelector } from "@reduxjs/toolkit";
import { isBefore, isAfter } from "date-fns";

export const getAnalyticsState = (state: StateSchema) => state.analytics;

export const getChartType = createSelector(getAnalyticsState, (analytics) => analytics.chartType);
export const getFilters = createSelector(getAnalyticsState, (analytics) => analytics.filters);
export const getDateRange = createSelector(getAnalyticsState, (analytics) => analytics.dateRange);
export const getData = createSelector(getAnalyticsState, (analytics) => analytics.data);
export const getLoading = createSelector(getAnalyticsState, (analytics) => analytics.loading);
export const getError = createSelector(getAnalyticsState, (analytics) => analytics.error);

