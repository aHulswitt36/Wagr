import { WALLET_ADAPTERS, CHAIN_NAMESPACES, ADAPTER_EVENTS } from "@web3auth/base";
import { Web3AuthCore } from "@web3auth/core";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
export class web3auth {
    constructor() {
        this.subscribeAuthEvents = (web3auth) => {
            web3auth.on(ADAPTER_EVENTS.CONNECTED, (data) => {
                console.log("connected to wallet", data);
                // web3auth.provider will be available here after user is connected
            });
            web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
                console.log("connecting");
            });
            web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
                console.log("disconnected");
            });
            web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
                console.log("error", error);
            });
            web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
                console.log("error", error);
            });
            web3auth.on(ADAPTER_EVENTS.NOT_READY, () => {
                console.log("Not ready yet");
            });
            web3auth.on(ADAPTER_EVENTS.READY, () => {
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
                network: 'testnet',
                uxMode: 'popup',
                loginConfig: {
                    google: {
                        name: "google",
                        verifier: "wagr-gooogle-testnet",
                        typeOfLogin: 'google',
                        clientId: '257577462189-bb83btkje26kulqjqleqdoujc41iihn0.apps.googleusercontent.com'
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
        }
        catch (e) {
            console.log("Error occurred initializing: ", e);
        }
    }
    async connect() {
        //this.provider =
        if (!this.auth) {
            console.log('web3auth not initialized yet');
            return;
        }
        await this.auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
            loginProvider: "google"
        });
        //return true;
    }
    async disconnect() {
        throw new Error('Method not implemented.');
    }
    getProvider() {
        //return this.provider;
        throw new Error("Method not implemented");
    }
}
//# sourceMappingURL=web3auth.js.map