import { SafeEventEmitterProvider } from '@web3auth/base';

export interface IAuthentication {
    init(): Promise<void>;
    connect(): Promise<void>;
    disconnect(): Promise<boolean>;
    getProvider(): SafeEventEmitterProvider;
}