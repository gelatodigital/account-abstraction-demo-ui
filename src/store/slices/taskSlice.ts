import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskState } from "../../components/Tasks";

export type ITask = {
  id: string;
  status: string;
  details?: {
    chainId?: string;
    txHash?: string;
    blockNumber?: string;
    executionDate?: string;
    lastCheckMessage?: string;
  };
};
export interface ITasksState {
  tasks: ITask[];
}

const initialState: ITasksState = {
  tasks: [],
};

export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<string>) => {
      state.tasks.push({
        id: action.payload,
        status: TaskState.Pending,
      });
    },
    updateTasks: (state, action: PayloadAction<ITask[]>) => {
      state.tasks = action.payload;
    },
  },
});

export const { addTask, updateTasks } = taskSlice.actions;
export default taskSlice.reducer;
