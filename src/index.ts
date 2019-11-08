import {
  PrivateKeyWalletSubprovider,
  Web3ProviderEngine,
  RPCSubprovider
} from "@0x/subproviders";
import { ERC20TokenWrapper, BigNumber, ERC20ProxyWrapper } from "0x.js";
import { Web3Wrapper } from "@0x/web3-wrapper";

const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS as string;
const FROM_ETH_ADDRESS = process.env.FROM_ETH_ADDRESS as string;
const TO_ETH_ADDRESSS = process.env.TO_ETH_ADDRESS as string;
const ETH_NODE_URL = process.env.ETH_NODE_URL as string;
const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
const NETWORK_ID = parseInt(process.env.NETWORK_ID as string);
const TOKEN_AMOUNT = parseFloat(process.env.TOKEN_AMOUNT as string);
const TOKEN_DECIMALS = 18;

const go = async () => {
  const w3p = new Web3ProviderEngine();
  w3p.addProvider(new PrivateKeyWalletSubprovider(PRIVATE_KEY));
  w3p.addProvider(new RPCSubprovider(ETH_NODE_URL));
  w3p.start();

  const w3w = new Web3Wrapper(w3p);

  const proxyWrapper = new ERC20ProxyWrapper(w3w, NETWORK_ID);
  const tokenWrapper = new ERC20TokenWrapper(w3w, NETWORK_ID, proxyWrapper);

  const amount = Web3Wrapper.toBaseUnitAmount(
    new BigNumber(TOKEN_AMOUNT),
    TOKEN_DECIMALS
  );
  console.log(
    `Transferring ${TOKEN_AMOUNT} ${TOKEN_ADDRESS} from ${FROM_ETH_ADDRESS} to ${TO_ETH_ADDRESSS}`
  );
  const txnHash = await tokenWrapper.transferAsync(
    TOKEN_ADDRESS,
    FROM_ETH_ADDRESS,
    TO_ETH_ADDRESSS,
    amount
  );
  console.log("Got txnHash", txnHash);
  console.log("Waiting for txn to complete");
  await w3w.awaitTransactionSuccessAsync(txnHash);
  console.log("All done!");
};

go().then(() => {
  process.exit();
});
