import { AnalyticsState } from "@/app/analytics/types/types";
import { ReducersMapObject, AnyAction, EnhancedStore, Reducer } from "@reduxjs/toolkit";
import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { AxiosInstance } from "axios";

export interface StateSchema {
  analytics: AnalyticsState;
}

export type StateSchemaKey = keyof StateSchema;

export interface ReducerManager {
  getReducerMap: () => ReducersMapObject<StateSchema>;
  reduce: (state: StateSchema | undefined, action: AnyAction) => StateSchema
  add: (key: StateSchemaKey, reducer: Reducer) => void;
  remove: (key: StateSchemaKey) => void;
}

export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
  reducerManager: ReducerManager;
}

export interface ThunkExtraArg {
  toast: (options: {
    title?: string;
    description?: string;
    status?: "success" | "error" | "info" | "warning" | "loading";
    duration?: number;
    isClosable?: boolean;
    [key: string]: unknown;
  }) => void;
  api: AxiosInstance;
  navigate: (to: string, options?: NavigateOptions) => void;
  t?: (key: string, options?: Record<string, unknown>) => string;
}

export interface ThunkConfig<T> {
  rejectValue: T;
  extra: ThunkExtraArg;
  state: StateSchema;
}
