import { getAssociatedTokenAddress } from "@solana/spl-token";
import {
    AUTH_WEBHOOK_HEADERS,
    MINT_TOKEN_ADDRESS,
    RPC_URL,
    stakingPoolWallet,
} from "../config/env";
import { Connection, PublicKey } from "@solana/web3.js";
import { DBTransaction } from "../models/transactionModel";
import { socketService } from "../utils/socket";
import { saveTransaction } from "./transactionService";
import { burnToken, mintToken, sendNativeToken } from "./transferService";

export const processWebhook = async (
    data: any,
    authorization: string | undefined
) => {
    const {
        type,
        nativeTransfers,
        feePayer,
        description,
        tokenTransfers,
        signature,
    } = data[0];

    const io = socketService.getInstance();
    const conn = new Connection(RPC_URL);

    console.log({
        authorization,
        type,
        nativeTransfers,
        feePayer,
        description,
        tokenTransfers,
        signature,
    });

    const mintATAAddress = await getAssociatedTokenAddress(
        new PublicKey(MINT_TOKEN_ADDRESS),
        new PublicKey(stakingPoolWallet)
    );
    console.log({ mintATAAddress });

    if (type === "TRANSFER" && AUTH_WEBHOOK_HEADERS === authorization) {
        const findSignature = await DBTransaction.findOne({
            txnHash: signature,
        });
        if (findSignature) {
            console.log("Already processed");
            return { message: "Already processed" };
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
                return { message: "Processing..." };
            }

            const { amount, fromUserAccount } = nativeTransfers?.[0];
            io.emit("mintingStart", { message: "Minting in Progress..." });

            await mintToken(fromUserAccount, amount, conn);
            await saveTransaction(signature, "MINT");
            io.emit("mintingComplete", {
                message:
                    "Minting completed successfully. Your assets are now secure.",
            });
            return;
        }

        if (Array.isArray(tokenTransfers) && tokenTransfers.length > 0) {
            console.log("tokenTransfers nSol", tokenTransfers[0]);

            const incomingStakeTxns = tokenTransfers.find(
                (item) => item.toTokenAccount === mintATAAddress.toBase58()
            );

            if (!incomingStakeTxns) {
                return { message: "Processing..." };
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
        return {
            message: "Error: This is not burning or minting operation",
        };
    }
};
