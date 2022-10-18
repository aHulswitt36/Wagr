import { Web3Auth } from '@web3auth/web3auth';
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
export class web3auth {
    async connect() {
        const web3auth = new Web3Auth({
            clientId: "BLSvb-C_jNfU71XbEIgo-DAa9HgxXtDBPpQWOU_oXPhzIqBaqv-B5zi46nc82GzYG9-D6u5fph-uC4SUOXnnf74",
            chainConfig: {
                chainNamespace: CHAIN_NAMESPACES.OTHER,
                displayName: "Hedera",
                ticker: "HBAR",
                tickerName: "hedera"
            },
            enableLogging: false
        });
        const openloginAdapter = new OpenloginAdapter({
            adapterSettings: {
                clientId: "BLSvb-C_jNfU71XbEIgo-DAa9HgxXtDBPpQWOU_oXPhzIqBaqv-B5zi46nc82GzYG9-D6u5fph-uC4SUOXnnf74",
                network: 'testnet',
                uxMode: 'popup'
            }
        });
        web3auth.configureAdapter(openloginAdapter);
        await web3auth.initModal();
        this.provider = await web3auth.connect();
        return true;
    }
    async disconnect() {
        throw new Error('Method not implemented.');
    }
    getProvider() {
        return this.provider;
    }
}
//# sourceMappingURL=web3auth.js.map