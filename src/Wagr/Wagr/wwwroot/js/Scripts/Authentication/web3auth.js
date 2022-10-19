import {Web3Auth} from "../../_snowpack/pkg/@web3auth/web3auth.js";
import {CHAIN_NAMESPACES} from "../../_snowpack/pkg/@web3auth/base.js";
import {OpenloginAdapter} from "../../_snowpack/pkg/@web3auth/openlogin-adapter.js";
export class web3auth {
  async connect() {
    const web3auth2 = new Web3Auth({
      clientId: "BLSvb-C_jNfU71XbEIgo-DAa9HgxXtDBPpQWOU_oXPhzIqBaqv-B5zi46nc82GzYG9-D6u5fph-uC4SUOXnnf74",
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.OTHER,
        displayName: "Hedera",
        ticker: "HBAR",
        tickerName: "hedera"
      },
      enableLogging: true
    });
    const openloginAdapter = new OpenloginAdapter({
      adapterSettings: {
        clientId: "BLSvb-C_jNfU71XbEIgo-DAa9HgxXtDBPpQWOU_oXPhzIqBaqv-B5zi46nc82GzYG9-D6u5fph-uC4SUOXnnf74",
        network: "testnet",
        uxMode: "popup"
      }
    });
    web3auth2.configureAdapter(openloginAdapter);
    await web3auth2.initModal();
    this.provider = await web3auth2.connect();
    return true;
  }
  async disconnect() {
    throw new Error("Method not implemented.");
  }
  getProvider() {
    return this.provider;
  }
}
