import { ThunkExtraArg } from "@/store/StateSchema";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAnalyticsData = createAsyncThunk<
  any[], // тип возвращаемых данных
  void, // аргументы при вызове
  { extra: ThunkExtraArg } // extra аргументы для thunk
>("analytics/fetchData", async (_, { extra, rejectWithValue }) => {
  try {
    const response = await extra.api.get("/analytics");
    return response.data;
  } catch (err: any) {
    extra.toast({
      title: "Ошибка загрузки",
      description: err.message || "Что-то пошло не так",
      status: "error",
      isClosable: true,
    });
    extra.navigate("/error");
    return rejectWithValue(err.message);
  }
});
