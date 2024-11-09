import "dotenv/config";
import express, { Request, Response } from "express";
import {
    ATA_ADDRESS,
    AUTH_WEBHOOK_HEADERS,
    MINT_TOKEN_ADDRESS,
    privateKey,
    RPCURL,
    stakingPoolWallet,
} from "./constant";
import { PublicKey, Keypair, Connection } from "@solana/web3.js";
import { burnToken, mintToken, sendNativeToken } from "./transfers";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import bs58 from "bs58";
import mongoose from "mongoose";

const app = express();

app.use(express.json()); //when json data will come , application/json
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/solana").then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB", err);
});

const transactionSchema = new mongoose.Schema({
    txnHash: String,
    type: String,
    createdAt: { type: Date, default: Date.now },
});

const DBTransaction = mongoose.model("DBTransaction", transactionSchema);

export async function saveTransaction(txnHash: string, type: string) {
    const transaction = new DBTransaction({ txnHash, type, createdAt: new Date() })

    try {
        await transaction.save();
        console.log("Transaction saved to MongoDB");
    } catch (error) {
        console.log("Error saving transaction to MongoDB", error);
    }
}

app.post("/body", (req, res) => {
    const data = req.body;
    console.log(data);

    res.json(data);
});

const conn = new Connection(RPCURL, "confirmed");
app.post("/balance/:address", async (req, res) => {
    try {
        const address = req.params.address;
        console.log({ address });

        const bal = await conn.getBalance(
            new PublicKey(stakingPoolWallet),
            "confirmed"
        );

        res.json({
            message: "Balance fetch successfully.",
            balance: bal,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            err: error,
            message: "Internal Server Error",
        });
    }
});

interface IHelRes {
    nativeTransfers: [
        { amount: number; fromUserAccount: string; toUserAccount: string }
    ];
    type: string;
}
app.post("/webhook", async (req: Request, res: Response) => {
    console.log("Req body: ", req.body);
    try {
        const webhookAuth = req.headers.authorization;
        const { type, nativeTransfers, feePayer, description, tokenTransfers, signature } =
            req.body[0];

        console.log({
            webhookAuth,
            type,
            nativeTransfers,
            feePayer,
            description,
            tokenTransfers,
            signature,
        });
        // const { amount, fromUserAccount, toUserAccount } = nativeTransfers?.[0];

        // console.log({ amount, fromUserAccount, toUserAccount });

        // const VAULT = ATA_ADDRESS;


        const mintATAAddress = await getAssociatedTokenAddress(
            new PublicKey(MINT_TOKEN_ADDRESS),
            new PublicKey(stakingPoolWallet)
        );
        console.log({ mintATAAddress });

        // if (!fromUserAccount || !amount || !toUserAccount) {
        //     res.json({ message: "Required field is missing." });
        //     return;
        // }

        if (type === "TRANSFER" && AUTH_WEBHOOK_HEADERS === webhookAuth) {

            const findSignature = await DBTransaction.findOne({ txnHash: signature });
            if (findSignature) {
                console.log("Already processed");
                res.json({ message: "Already processed" });
                return;
            }
            if (Array.isArray(nativeTransfers) && nativeTransfers.length > 0) {
                const incomingTxns = nativeTransfers.find(
                    (item: {
                        amount: number;
                        toUserAccount: string;
                        fromUserAccount: string;
                    }) => item.toUserAccount === mintATAAddress.toBase58()
                );

                console.log({ incomingTxns });
                if (!incomingTxns) {
                    res.json({ message: "Processing..." });
                    return;
                }

                const { amount, fromUserAccount, toUserAccount } =
                    nativeTransfers?.[0];

                await mintToken(fromUserAccount, amount, conn);
                await saveTransaction(signature, "MINT");

                return;
            }



            if (Array.isArray(tokenTransfers) && tokenTransfers.length > 0) {
                // const incomingStakeTxns = tokenTransfers.find((item) => item.)
                console.log("tokenTransfers nSol", tokenTransfers[0]);

                const incomingStakeTxns = tokenTransfers.find(
                    (item) => item.toTokenAccount === mintATAAddress.toBase58()
                ); //return atleast one value otherwise undefined

                if (!incomingStakeTxns) {
                    res.json({ message: "Processing" });
                    return;
                }

                console.log("incomingStakeTxns...");
                const {
                    fromTokenAccount,
                    fromUserAccount,
                    mint,
                    toTokenAccount,
                    toUserAccount,
                    tokenAmount,
                    tokenStandard,
                } = tokenTransfers?.[0];

                await burnToken(
                    fromUserAccount,
                    tokenAmount,
                    conn,
                    mintATAAddress.toBase58()
                );

                console.log("Burn token done...");
                await sendNativeToken(
                    fromUserAccount,
                    tokenAmount,
                    conn,
                    mintATAAddress
                );

                await saveTransaction(signature, "BURN");

            }
        } else {
            res.json({
                message: "Error: This is not burning or minting operation",
            });
            return;
        }
    } catch (error) {
        console.log(error);

        res.json({
            message: "Internal Server Error",
        });
    }
});

app.get("/", (req, res) => {
    const pKey = privateKey;
    console.log({ pKey });

    const keypair = Keypair.fromSecretKey(bs58.decode(pKey));
    console.log({ keypair });
    const publicKey = keypair.publicKey.toString();

    console.log("Derived Public Key:", publicKey);
    res.json({
        message: "Hello Nishant!",
    });
});

app.listen(PORT, () => {
    console.log("Application is running on port : ", PORT);
});
