import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    txnHash: String,
    type: String,
    createdAt: { type: Date, default: Date.now },
});

export const DBTransaction = mongoose.model("DBTransaction", transactionSchema);
