import {web3auth} from "../../../Scripts/Authentication/web3auth.js";
export async function CreateWeb3AuthConnection() {
  var auth = new web3auth();
  return await auth.connect();
}
