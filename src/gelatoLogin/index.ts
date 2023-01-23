import { Web3Auth } from "@web3auth/modal";
import { ethers } from "ethers";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { WalletConnectV1Adapter } from "@web3auth/wallet-connect-v1-adapter";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { SafeEventEmitterProvider } from "@web3auth/base";
import {
  GelatoSmartWallet,
  SmartWalletConfig,
} from "@gelatonetwork/account-abstraction";

const CLIENT_ID = process.env.REACT_APP_WEB3AUTH_CLIENT_ID!;

export class GelatoLogin {
  private _chainId: number;
  private _web3Auth: Web3Auth | null = null;
  private _provider: SafeEventEmitterProvider | null = null;
  private _apiKey: string;
  private _smartWallet: GelatoSmartWallet | null = null;
  constructor(chainId: number = 1, smartWalletConfig: SmartWalletConfig) {
    this._chainId = chainId;
    this._apiKey = smartWalletConfig.apiKey;
  }

  async init() {
    const web3Auth = new Web3Auth({
      clientId: CLIENT_ID,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: ethers.utils.hexValue(this._chainId),
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
      clientId: CLIENT_ID,
    });
    const metamaskAdapter = new MetamaskAdapter({
      clientId: CLIENT_ID,
    });

    web3Auth.configureAdapter(openloginAdapter);
    web3Auth.configureAdapter(walletConnectV1Adapter);
    web3Auth.configureAdapter(metamaskAdapter);
    await web3Auth.initModal();

    if (web3Auth.provider) {
      this._provider = web3Auth.provider;
      await this._initializeSmartWallet();
    }
    this._web3Auth = web3Auth;
  }

  getProvider() {
    return this._provider;
  }

  async getUserInfo() {
    if (!this._web3Auth) {
      throw new Error("Gelato Login is not initialized yet");
    }
    return await this._web3Auth.getUserInfo();
  }

  async login() {
    if (!this._web3Auth) {
      throw new Error("Gelato Login is not initialized yet");
    }
    const provider = await this._web3Auth.connect();
    this._provider = provider;
    await this._initializeSmartWallet();
    return this._provider;
  }

  async logout() {
    if (!this._web3Auth) {
      throw new Error("Gelato Login is not initialized yet");
    }
    await this._web3Auth.logout();
    this._web3Auth.clearCache();
    this._provider = null;
  }

  getSmartWallet() {
    if (!this._provider) {
      throw new Error("Gelato Login is not connected");
    }
    return this._smartWallet;
  }

  private async _initializeSmartWallet() {
    if (!this._provider) {
      throw new Error("Gelato Login is not connected");
    }
    const smartWallet = new GelatoSmartWallet(this._provider, {
      apiKey: this._apiKey,
    });
    await smartWallet.init();
    this._smartWallet = smartWallet;
  }
}
