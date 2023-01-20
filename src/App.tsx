import { useEffect, useState } from "react";
import { SafeEventEmitterProvider, UserInfo } from "@web3auth/base";
import { GelatoSmartWallet } from "@gelatonetwork/account-abstraction";
import "./App.css";
import { ethers } from "ethers";
import { Web3Auth } from "@web3auth/modal";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { Tasks } from "./components/Tasks";
import { addTask } from "./store/slices/taskSlice";
import { addError } from "./store/slices/errorSlice";
import { ErrorMessage } from "./components/ErrorMessage";
import { SmartWallet } from "./components/SmartWallet";
import { Eoa } from "./components/Eoa";
import { Counter } from "./components/Counter";
import { CHAIN_ID, COUNTER_CONTRACT_ABI, TARGET } from "./constants";
import { Loading } from "./components/Loading";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";

// Adapters

import { WalletConnectV1Adapter } from "@web3auth/wallet-connect-v1-adapter";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";

function App() {
  // Global State
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const error = useAppSelector((state) => state.error.message);
  const dispatch = useAppDispatch();

  // Local State
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [counter, setCounter] = useState<string>("0");
  const [web3AuthProvider, setWeb3AuthProvider] =
    useState<SafeEventEmitterProvider | null>(null);
  const [smartWallet, setSmartWallet] = useState<GelatoSmartWallet | null>(
    null
  );
  const [counterContract, setCounterContract] =
    useState<ethers.Contract | null>(null);
  const [user, setUser] = useState<Partial<UserInfo> | null>(null);
  const [wallet, setWallet] = useState<{
    address: string;
    balance: string;
    chainId: number;
  } | null>(null);
  const [isDeployed, setIsDeployed] = useState<boolean>(false);

  const increment = async () => {
    if (!counterContract) {
      return dispatch(addError("Counter Contract is not initiated"));
    }
    let { data } = await counterContract.populateTransaction.increment();
    if (!data) {
      return dispatch(
        addError("Counter Contract Transaction Data could not get populated")
      );
    }
    if (!smartWallet) {
      return dispatch(addError("Smart Wallet is not initiated"));
    }
    try {
      const { taskId } = await smartWallet.sendTransaction(TARGET, data);
      dispatch(addTask(taskId));
    } catch (error) {
      dispatch(addError((error as Error).message));
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const clientId = process.env.REACT_APP_WEB3AUTH_CLIENT_ID!;
        const web3Auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: ethers.utils.hexValue(CHAIN_ID),
          },
          uiConfig: {
            appName: "Gelato",
            theme: "dark",
            loginMethodsOrder: ["google"],
            defaultLanguage: "en",
          },
          web3AuthNetwork: "testnet",
        });

        const openloginAdapter = new OpenloginAdapter({
          loginSettings: {
            mfaLevel: "optional",
          },
          adapterSettings: {
            uxMode: "redirect",
            whiteLabel: {
              name: "Gelato",
              defaultLanguage: "en",
              dark: true,
              theme: { primary: "#b45f63" },
            },
          },
        });

        const walletConnectV1Adapter = new WalletConnectV1Adapter({
          clientId,
        });
        const metamaskAdapter = new MetamaskAdapter({
          clientId,
        });

        web3Auth.configureAdapter(openloginAdapter);
        web3Auth.configureAdapter(walletConnectV1Adapter);
        web3Auth.configureAdapter(metamaskAdapter);
        await web3Auth.initModal();
        setWeb3Auth(web3Auth);

        if (web3Auth.provider) {
          setWeb3AuthProvider(web3Auth.provider);
        }
      } catch (error) {
        dispatch(addError((error as Error).message));
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      if (!web3Auth || !web3AuthProvider) {
        return;
      }
      setIsLoading(true);
      const web3Provider = new ethers.providers.Web3Provider(web3AuthProvider!);
      const signer = web3Provider.getSigner();
      setWallet({
        address: await signer.getAddress(),
        balance: (await signer.getBalance()).toString(),
        chainId: await signer.getChainId(),
      });
      const user = await web3Auth.getUserInfo();
      setUser(user);
      const gelatoSmartWallet = new GelatoSmartWallet(web3AuthProvider!, {
        apiKey: process.env.REACT_APP_SPONSOR_API_KEY!,
      });
      await gelatoSmartWallet.init();
      setSmartWallet(gelatoSmartWallet);
      setIsDeployed(await gelatoSmartWallet.isDeployed());
      const counterContract = new ethers.Contract(
        TARGET,
        COUNTER_CONTRACT_ABI,
        new ethers.providers.Web3Provider(web3AuthProvider!).getSigner()
      );
      setCounterContract(counterContract);
      const fetchStatus = async () => {
        if (!counterContract || !gelatoSmartWallet) {
          return;
        }
        const counter = (await counterContract.counter()).toString();
        setCounter(counter);
        setIsDeployed(await gelatoSmartWallet.isDeployed());
      };
      await fetchStatus();
      const interval = setInterval(fetchStatus, 5000);
      setIsLoading(false);
      return () => clearInterval(interval);
    };
    init();
  }, [web3AuthProvider]);

  const login = async () => {
    if (!web3Auth) {
      return;
    }
    const web3authProvider = await web3Auth.connect();
    setWeb3AuthProvider(web3authProvider);
  };

  const logout = async () => {
    if (!web3Auth) {
      return;
    }
    await web3Auth.logout();
    setWeb3AuthProvider(null);
    setWallet(null);
    setUser(null);
    setSmartWallet(null);
    setCounterContract(null);
  };

  const loggedInView = isLoading ? (
    <Loading />
  ) : (
    <div className="flex flex-col h-full w-[700px] gap-2 py-10">
      {error && <ErrorMessage />}
      <Eoa user={user} wallet={wallet} />
      {smartWallet?.isInitialized() && (
        <div className="flex justify-center flex-col gap-10">
          <SmartWallet
            address={smartWallet.getAddress()!}
            isDeployed={isDeployed}
          />
          <Counter
            address={TARGET}
            chainId={CHAIN_ID}
            counter={counter}
            handleClick={increment}
          />
        </div>
      )}
      {tasks.length > 0 && (
        <div className="flex flex-col pb-14">
          <div className="mt-10 h-[0.1rem] bg-[#b45f63] opacity-20" />
          <Tasks />
        </div>
      )}
    </div>
  );

  const toLoginInView = (
    <div className="flex justify-center flex-col items-center h-full w-full gap-10">
      <p className="text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#b45f63] to-[#f5c3a6]">
        Account Abstraction PoC
      </p>

      <div className="h-12">
        {!isLoading && (
          <button
            onClick={login}
            className="px-4 border-2 border-[#b45f63] rounded-lg"
          >
            <p className="px-4 py-1 font-semibold text-gray-800 text-lg">
              Login
            </p>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {web3AuthProvider && (
        <div className="flex justify-end p-5">
          <button
            onClick={logout}
            className="px-4 py-1 border-2 border-[#b45f63] rounded-lg"
          >
            <p className="font-semibold text-gray-800 text-lg">Logout</p>
          </button>
        </div>
      )}
      <div className="flex h-screen px-20 justify-center">
        {web3AuthProvider ? loggedInView : toLoginInView}
      </div>
    </>
  );
}

export default App;
