import {
  WALLET_ADAPTERS,
  CHAIN_NAMESPACES,
  ADAPTER_EVENTS
} from "../../_snowpack/pkg/@web3auth/base.js";
import {Web3AuthCore} from "../../_snowpack/pkg/@web3auth/core.js";
import {OpenloginAdapter} from "../../_snowpack/pkg/@web3auth/openlogin-adapter.js";
export class web3auth {
  constructor() {
    this.subscribeAuthEvents = (web3auth2) => {
      web3auth2.on(ADAPTER_EVENTS.CONNECTED, (data) => {
        console.log("connected to wallet", data);
      });
      web3auth2.on(ADAPTER_EVENTS.CONNECTING, () => {
        console.log("connecting");
      });
      web3auth2.on(ADAPTER_EVENTS.DISCONNECTED, () => {
        console.log("disconnected");
      });
      web3auth2.on(ADAPTER_EVENTS.ERRORED, (error) => {
        console.log("error", error);
      });
      web3auth2.on(ADAPTER_EVENTS.ERRORED, (error) => {
        console.log("error", error);
      });
      web3auth2.on(ADAPTER_EVENTS.NOT_READY, () => {
        console.log("Not ready yet");
      });
      web3auth2.on(ADAPTER_EVENTS.READY, () => {
        console.log("READY");
      });
    };
  }
  async init() {
    this.auth = new Web3AuthCore({
      clientId: "BLSvb-C_jNfU71XbEIgo-DAa9HgxXtDBPpQWOU_oXPhzIqBaqv-B5zi46nc82GzYG9-D6u5fph-uC4SUOXnnf74",
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.OTHER
      },
      enableLogging: true
    });
    this.auth.clearCache();
    this.adapter = new OpenloginAdapter({
      adapterSettings: {
        clientId: "BLSvb-C_jNfU71XbEIgo-DAa9HgxXtDBPpQWOU_oXPhzIqBaqv-B5zi46nc82GzYG9-D6u5fph-uC4SUOXnnf74",
        network: "testnet",
        uxMode: "popup",
        loginConfig: {
          google: {
            name: "google",
            verifier: "wagr-gooogle-testnet",
            typeOfLogin: "google",
            clientId: "257577462189-bb83btkje26kulqjqleqdoujc41iihn0.apps.googleusercontent.com"
          }
        }
      }
    });
    try {
      this.subscribeAuthEvents(this.auth);
      this.auth.configureAdapter(this.adapter);
      await this.auth.init();
      if (this.auth.provider)
        this.provider = this.auth.provider;
      console.log(this.auth.connectedAdapterName);
      console.log(this.auth);
      console.log("auth initialized");
    } catch (e) {
      console.log("Error occurred initializing: ", e);
    }
  }
  async connect() {
    if (!this.auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await this.auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: "google"
    });
  }
  async disconnect() {
    throw new Error("Method not implemented.");
  }
  getProvider() {
    throw new Error("Method not implemented");
  }
}
