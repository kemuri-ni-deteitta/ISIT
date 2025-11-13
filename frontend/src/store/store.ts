import {
  configureStore,
  ReducersMapObject,
  EnhancedStore,
  AnyAction,
  Reducer,
  combineReducers,
} from "@reduxjs/toolkit";
import { StateSchema, StateSchemaKey, ThunkExtraArg } from "./StateSchema";
import { analyticsReducer } from "@/app/analytics/slices/analyticsSlice";
import { toaster } from "@/components/ui/toaster";
import { apiClient } from "@/shared/api/client";

// Менеджер редьюсеров
export interface ReducerManager {
  getReducerMap: () => ReducersMapObject<StateSchema>;
  reduce: (state: StateSchema | undefined, action: AnyAction) => StateSchema;
  add: (key: StateSchemaKey, reducer: Reducer) => void;
  remove: (key: StateSchemaKey) => void;
}

// Расширенный store
export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
  reducerManager: ReducerManager;
}

// Функция создания менеджера редьюсеров
function createReducerManager(initialReducers: ReducersMapObject<StateSchema>): ReducerManager {
  const reducers = { ...initialReducers }; // оставляем как есть
  let combinedReducer = combineReducers(reducers as ReducersMapObject<StateSchema>);

  return {
    getReducerMap: () => reducers,

    reduce: (state: StateSchema | undefined, action: AnyAction): StateSchema => {
      return combinedReducer(state, action);
    },

    add: (key: StateSchemaKey, reducer: Reducer) => {
      if (!key || reducers[key]) return;
      reducers[key] = reducer;
      combinedReducer = combineReducers(reducers as ReducersMapObject<StateSchema>);
    },

    remove: (key: StateSchemaKey) => {
      if (!key || !reducers[key]) return;
      Reflect.deleteProperty(reducers, key); // безопасно для TS
      combinedReducer = combineReducers(reducers as ReducersMapObject<StateSchema>);
    },
  };
}

// Основная функция создания Redux Store
export function createReduxStore(
  toast: typeof toaster = toaster,
  navigate: (to: string, options?: { replace?: boolean }) => void = () => {},
  initialState?: StateSchema,
  asyncReducers?: ReducersMapObject<StateSchema>
): ReduxStoreWithManager {
  const rootReducers: ReducersMapObject<StateSchema> = {
    analytics: analyticsReducer,
    ...asyncReducers,
  };

  const reducerManager = createReducerManager(rootReducers);

  const extraArg: ThunkExtraArg = { toast, api: apiClient, navigate };

  const store = configureStore({
    reducer: reducerManager.reduce,
    devTools: process.env.NODE_ENV !== "production",
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: { extraArgument: extraArg } }),
  });

  (store as ReduxStoreWithManager).reducerManager = reducerManager;

  return store as ReduxStoreWithManager;
}

// Типизация RootState и AppDispatch
export type AppDispatch = ReturnType<typeof createReduxStore>["dispatch"];
