export enum BlockExplorerDataType {
  Transaction = "tx",
  Address = "address",
}
export const getBlockExplorerUrl = (
  chainId: number,
  id: string,
  kind: BlockExplorerDataType = BlockExplorerDataType.Transaction
) => {
  const path = `${kind}/${id}`;
  switch (chainId) {
    case 4:
      return `https://rinkeby.etherscan.io/${path}`;
    case 5:
      return `https://goerli.etherscan.io/${path}`;
    case 100:
      return `https://gnosisscan.io/${path}`;
    case 137:
      return `https://polygonscan.com/${path}`;
    case 420:
      return `https://goerli-optimism.etherscan.io/${path}`;
    case 44787:
      return `https://alfajores.celoscan.io/${path}`;
    case 84531:
      return `https://goerli.basescan.org/${path}`
    case 80001:
      return `https://mumbai.polygonscan.com/${path}`;
    default:
      return null;
  }
};
