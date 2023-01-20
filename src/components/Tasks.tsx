import { useEffect } from "react";
import { getBlockExplorerUrl } from "../utils";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { ITask, updateTasks } from "../store/slices/taskSlice";
import { Card } from "./Card";
import { gelatoRelay } from "../gelatoRelay";
import { CHAIN_ID } from "../constants";

export enum TaskState {
  Pending = "Pending",
  CheckPending = "CheckPending",
  ExecPending = "ExecPending",
  ExecSuccess = "ExecSuccess",
  ExecReverted = "ExecReverted",
  WaitingForConfirmation = "WaitingForConfirmation",
  Blacklisted = "Blacklisted",
  Cancelled = "Cancelled",
  NotFound = "NotFound",
}

export const Tasks = () => {
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      const refreshTasks = async () => {
        const fetchStatus = async (task: { id: string; status: string }) => {
          const statusResponse = await gelatoRelay.getTaskStatus(task.id);
          return {
            id: task.id,
            status: statusResponse ? statusResponse.taskState : task.status,
            details: {
              txHash: statusResponse?.transactionHash || undefined,
              chainId: statusResponse?.chainId?.toString() || undefined,
              blockNumber: statusResponse?.blockNumber?.toString() || undefined,
              executionDate: statusResponse?.executionDate || undefined,
              lastCheckMessage: statusResponse?.lastCheckMessage || undefined,
            },
          };
        };
        const newTasks = await Promise.all(
          tasks.map(async (task) => await fetchStatus(task))
        );
        dispatch(updateTasks(newTasks));
      };

      refreshTasks();
    }, 5000);
    return () => clearInterval(interval);
  }, [tasks, dispatch]);
  return (
    <Card>
      <p className="text-zinc-600 font-extralight text-2xl flex justify-center py-5">
        Tasks
      </p>
      <div className="gap-5 flex flex-col">
        {tasks.map((task) => (
          <Task task={task} key={task.id} />
        ))}
      </div>
    </Card>
  );
};

const TaskDetails: React.FC<{
  name: string;
  value: string;
  href?: string | null;
}> = (props) => {
  const { name, value, href } = props;
  return (
    <div className="flex flex-row gap-1 items-center text-sm">
      <p className="text-zinc-600 font-medium text-sm">{name}:</p>
      {href ? (
        <a href={`${href}`} target="_blank" rel="noopener noreferrer">
          <p className="text-zinc-500 font-medium text-sm underline underline-offset-2">
            {value}
          </p>
        </a>
      ) : (
        <p className="text-zinc-500 font-medium text-sm">{value}</p>
      )}
    </div>
  );
};

const Task: React.FC<{ task: ITask }> = (props) => {
  const { id, status, details } = props.task;
  const statusColor =
    status === TaskState.CheckPending ||
    status === TaskState.ExecPending ||
    status === TaskState.WaitingForConfirmation ||
    status === TaskState.Pending ||
    status === TaskState.NotFound
      ? "text-state-pending"
      : status === TaskState.ExecSuccess
      ? "text-state-successful"
      : status === TaskState.Blacklisted ||
        status === TaskState.ExecReverted ||
        status === TaskState.Cancelled
      ? "text-state-failed"
      : "text-state-pending";

  const explorerUrl = details?.txHash
    ? getBlockExplorerUrl(CHAIN_ID, details.txHash)
    : null;
  return (
    <div className="bg-[#f5c3a6] bg-opacity-10 p-5 shadow-md flex flex-col rounded-lg">
      <div className="flex-col flex items-start gap-1">
        <p className={`${statusColor} font-bold`}>{status}</p>
        <div className="flex-1 flex-row flex gap-1 items-center">
          <p className="text-zinc-900 font-bold">Task#</p>
          <p className="text-zinc-600 font-medium text-base">{id}</p>
        </div>
      </div>
      <div className="p-4 flex gap-1 flex-col">
        {details?.chainId && (
          <TaskDetails name="Chain Id" value={details.chainId} />
        )}
        {details?.txHash && (
          <TaskDetails
            name="Tx Hash"
            value={details.txHash}
            href={explorerUrl}
          />
        )}
        {details?.blockNumber && (
          <TaskDetails name="Block Number" value={details.blockNumber} />
        )}
        {details?.lastCheckMessage && (
          <TaskDetails
            name="Last Checked Message"
            value={details.lastCheckMessage}
          />
        )}
        {details?.executionDate && (
          <TaskDetails
            name="Execution Date"
            value={new Date(details.executionDate).toLocaleString()}
          />
        )}
      </div>
    </div>
  );
};
