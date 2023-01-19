import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ErrorState {
  message: string | null;
}

const initialState: ErrorState = {
  message: null,
};

export const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    addError: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    discardError: (state) => {
      state.message = null;
    },
  },
});

export const { addError, discardError } = errorSlice.actions;
export default errorSlice.reducer;
