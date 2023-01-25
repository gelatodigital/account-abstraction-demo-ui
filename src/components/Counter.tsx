import { BlockExplorerDataType, getBlockExplorerUrl } from "../utils";

export const Counter: React.FC<{
  chainId: number;
  address: string;
  counter: string;
  handleClick: () => void;
}> = (props) => {
  return (
    <div className="flex flex-col gap-5 py-2">
      <a
        href={`${getBlockExplorerUrl(
          props.chainId,
          props.address,
          BlockExplorerDataType.Address
        )}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="flex justify-center flex-col items-center gap-3">
          <p className="text-lg">Counter</p>
          <p className="text-7xl">{props.counter}</p>
        </div>
      </a>
      <div className="flex justify-center">
        <button
          onClick={props.handleClick}
          className="px-4 border-2 border-[#b45f63] rounded-lg"
        >
          <p className="px-4 py-1 font-semibold text-gray-800 text-lg">
            Increment
          </p>
        </button>
      </div>
    </div>
  );
};
