import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { discardError } from "./../store/slices/errorSlice";

export const ErrorMessage = () => {
  const error = useAppSelector((state) => state.error.message);
  const dispatch = useAppDispatch()
  return (
    <div className="bg-red-200 flex justify-center p-2 my-5 items-center">
      <div className="flex-1 justify-center flex">
        <p className="text-sm font-semibold">{error}</p>
      </div>
      <button className="hover:bg-red-100 rounded-lg" onClick={() => dispatch(discardError())}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};
