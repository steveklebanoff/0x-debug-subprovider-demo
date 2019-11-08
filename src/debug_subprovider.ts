import {
  Subprovider,
  JSONRPCRequestPayload,
  Callback,
  ErrorCallback
} from "@0x/subproviders";
import { Transaction } from "ethereumjs-tx";

const JSON_INDENT = 2;

const hexBufferToAddress = (value: Buffer): string => {
  console.log("buffer address", value);
  return `0x${value.toString("hex")}`;
};

// TODO: change to BigNumber
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
    payload: JSONRPCRequestPayload,
    next: Callback,
    _end: ErrorCallback
  ): Promise<void> {
    const debugObject: {
      [debugValue: string]: any;
    } = payload;

    if (
      payload &&
      payload.params &&
      payload.method === "eth_sendRawTransaction"
    ) {
      const transactionParam = payload.params[0];
      const txn = new Transaction(transactionParam);
      debugObject.rawTransactionDetails = {
        gasLimit: hexBufferToInteger(txn.gasLimit),
        gasPrice: hexBufferToInteger(txn.gasPrice),
        nonce: hexBufferToInteger(txn.nonce),
        value: hexBufferToInteger(txn.value),
        to: hexBufferToAddress(txn.to)
      };
    }

    // TODO: use custom function instead of console.debug
    console.debug(JSON.stringify(debugObject, null, JSON_INDENT));
    next();
  }
}
