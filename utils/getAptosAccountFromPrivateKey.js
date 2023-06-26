import { AptosAccount } from "aptos";

export const getAptosAccountFromPrivateKey = (privateKey) => {
  let key = privateKey;
  if (privateKey.substr(0, 2) === "0x") {
    key = privateKey.substr(2);
  }

  let privateKeyBuffer = new Uint8Array(key.length / 2);
  for (let i = 0; i < key.length; i += 2) {
    privateKeyBuffer[i / 2] = parseInt(key.substr(i, 2), 16);
  }

  return new AptosAccount(privateKeyBuffer);
};
