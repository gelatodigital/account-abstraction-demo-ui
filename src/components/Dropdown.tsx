import { SUPPORTED_NETWORKS } from "../utils/getChainConfig";

interface Props {
  chain: string;
}

export const Dropdown = ({ chain }: Props) => {
  return (
    <div className="dropdown">
      <label
        tabIndex={0}
        className="btn-sm px-4 py-1 font-bold text-lg underline underline-offset-8 decoration-orange-900 bg-gradient-to-r from-orange-900 via-orange-600 to-orange-300 inline-block text-transparent bg-clip-text cursor-pointer"
      >
        {chain}
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu shadow bg-base-100 rounded-box w-52"
      >
        {SUPPORTED_NETWORKS.filter((network) => network.name !== chain).map(
          (network) => {
            return (
              <li>
                <a
                  href={`${window.location.origin}/?chainId=${network.chainId}`}
                >
                  {network.name}
                </a>
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
};
