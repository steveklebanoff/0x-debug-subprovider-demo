import { Subprovider } from "@0x/subproviders";
// import EthereumTx = require("ethereumjs-tx");
import { Transaction } from "ethereumjs-tx";
import { Web3Wrapper } from "@0x/web3-wrapper";

const JSON_INDENT = 2;

const hexBufferToInteger = (value: Buffer): number => {
  return parseInt(value.toString("hex"), 16);
};

export class DebugSubprovider extends Subprovider {
  /**
   * This method conforms to the web3-provider-engine interface.
   * It is called internally by the ProviderEngine when it is this subproviders
   * turn to handle a JSON RPC request.
   * @param payload JSON RPC payload
   * @param next Callback to call if this subprovider decides not to handle the request
   * @param end Callback to call if subprovider handled the request and wants to pass back the request.
   */
  // tslint:disable-next-line:prefer-function-over-method async-suffix
  public async handleRequest(
    payload: any,
    next: any,
    _end: any
  ): Promise<void> {
    // TODO: change from console.logs to debugger package
    console.debug(JSON.stringify(payload, null, JSON_INDENT));

    if (
      payload &&
      payload.params &&
      payload.method === "eth_sendRawTransaction"
    ) {
      const transactionParam = payload.params[0];
      const txn = new Transaction(transactionParam);
      const txnDetails = {
        gasLimit: hexBufferToInteger(txn.gasLimit),
        gasPrice: hexBufferToInteger(txn.gasPrice),
        nonce: hexBufferToInteger(txn.nonce)
      };
      console.debug(JSON.stringify(txnDetails, null, JSON_INDENT));
    }
    next();
  }
}
