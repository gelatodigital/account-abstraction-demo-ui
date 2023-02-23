export const getChainConfig = (
  chainId: string | null
): {
  chainId: number;
  target: string;
  apiKey: string;
  rpcUrl: string;
} => {
  if (chainId === "100") {
    return {
      apiKey: process.env.REACT_APP_SPONSOR_API_KEY_MAINNET!,
      chainId: 100,
      target: "0x2dd703a17170C1b03abC26C4D5dc56c9382c5292",
      rpcUrl: process.env.REACT_APP_GNOSIS_RPC_URL!,
    };
  } else if (chainId === "84531") {
    return {
      apiKey: process.env.REACT_APP_SPONSOR_API_KEY!,
      chainId: 84531,
      target: "0xFeeBbED640df887bE1aD697EC3719EB7205323E9",
      rpcUrl: process.env.REACT_APP_BASEGOERLI_RPC_URL!,
    };
  } else {
    return {
      apiKey: process.env.REACT_APP_SPONSOR_API_KEY!,
      chainId: 80001,
      target: "0xBf17E7a45908F789707cb3d0EBb892647d798b99",
      rpcUrl: process.env.REACT_APP_MUMBAI_RPC_URL!,
    };
  }
};
