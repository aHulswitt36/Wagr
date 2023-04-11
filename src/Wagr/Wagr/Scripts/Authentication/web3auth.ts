//import { IAuthentication } from '../Interfaces/IAuthentication';

//import { Web3Auth } from '@web3auth/web3auth';
//import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
//import { OpenloginAdapter } from '@web3auth/openlogin-adapter';

//export class web3auth implements IAuthentication {
    
//    public provider: SafeEventEmitterProvider | null;

//    public async connect(): Promise<boolean> {
//        const web3auth = new Web3Auth({
//            clientId: "BLSvb-C_jNfU71XbEIgo-DAa9HgxXtDBPpQWOU_oXPhzIqBaqv-B5zi46nc82GzYG9-D6u5fph-uC4SUOXnnf74",
//            chainConfig: {
//                chainNamespace: CHAIN_NAMESPACES.OTHER,
//                displayName: "Hedera",
//                ticker: "HBAR",
//                tickerName: "hedera"
//            },
//            enableLogging: false
//        });

//        const openloginAdapter = new OpenloginAdapter({
//            adapterSettings: {
//                clientId: "BLSvb-C_jNfU71XbEIgo-DAa9HgxXtDBPpQWOU_oXPhzIqBaqv-B5zi46nc82GzYG9-D6u5fph-uC4SUOXnnf74",
//                network: 'testnet',
//                uxMode: 'popup'
//            }
//        });

//        web3auth.configureAdapter(openloginAdapter);

//        await web3auth.initModal();

//        this.provider = await web3auth.connect();

//        return true;
//    }
//    public async disconnect(): Promise<boolean>{
//        throw new Error('Method not implemented.');
//    }

//    public getProvider(): SafeEventEmitterProvider {
//        return this.provider;
//    }

//}