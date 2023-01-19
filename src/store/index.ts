import { configureStore } from "@reduxjs/toolkit"
import taskReducer from "./slices/taskSlice"
import errorReducer from "./slices/errorSlice"
export const store = configureStore({
    reducer: {
        tasks: taskReducer,
        error: errorReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch