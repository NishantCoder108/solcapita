import { DBTransaction } from "../models/transactionModel";

export const saveTransaction = async (txnHash: string, type: string) => {
    const transaction = new DBTransaction({ txnHash, type });

    await transaction.save();

    console.log("Transaction saved to DB");
};
