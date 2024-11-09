import bs58 from "bs58";
import { Keypair, PublicKey } from "@solana/web3.js";
import { privateKey } from "./constant";

const pKey = privateKey;
console.log({ pKey });

const keypair = Keypair.fromSecretKey(bs58.decode(pKey));
console.log({ keypair });
const publicKey = keypair.publicKey.toString();

console.log("Derived Public Key:", publicKey);