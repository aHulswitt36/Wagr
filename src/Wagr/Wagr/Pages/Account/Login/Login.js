import { web3auth } from "../../../Scripts/Authentication/web3auth";
const auth = new web3auth();
export async function CreateWeb3AuthConnection() {
    await auth.connect();
}
export async function Init() {
    await auth.init();
}
//# sourceMappingURL=Login.js.map