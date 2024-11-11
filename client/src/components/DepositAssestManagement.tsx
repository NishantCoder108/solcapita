import { PROTOCOL_CONFIG, UI_ELEMENTS } from "@/constants";
import { useState } from "react";
import { Input } from "./ui/input";
import { calculateDailyRewards } from "@/utils/wallet";
import { CustomTooltip } from "./ui/custom-tooltip";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { LoadingSpinner } from "./ui/loading-spinner";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { MINTER_PUBLIC_KEY, TOKEN_MINT_ADDRESS } from "@/constants/wallet";
import { Transaction } from "@solana/web3.js";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { RPC_URL } from "@/constants/wallet";
import { getAssociatedTokenAddress } from "@solana/spl-token";

const DepositAssestManagement = ({
    userBal,
    stakedTokenBalance,
}: {
    userBal: number;
    stakedTokenBalance: number;
}) => {
    const [amount, setAmount] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();

    const handleDeposit = async () => {
        setIsLoading(true);
        // TODO: Implement deposit logic

        try {
            if (!publicKey) throw new Error("Wallet not connected");

            const walletPubkey = new PublicKey(MINTER_PUBLIC_KEY);
            const tokenMintPubkey = new PublicKey(TOKEN_MINT_ADDRESS);

            const associatedTokenAddress = await getAssociatedTokenAddress(
                tokenMintPubkey,
                walletPubkey
            );
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: associatedTokenAddress,
                    lamports: Number(amount) * LAMPORTS_PER_SOL,
                })
            );

            const { blockhash, lastValidBlockHeight } =
                await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = publicKey;

            const signature = await sendTransaction(transaction, connection);

            console.log({ signature });

            const confirmTransaction = await connection.confirmTransaction(
                { signature, blockhash, lastValidBlockHeight },
                "processed"
            );

            console.log({ confirmTransaction });
        } catch (error) {
            console.log({ error });
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-gray-400">
                        Amount ({PROTOCOL_CONFIG.NATIVE_TOKEN})
                    </label>
                    <span className="text-xs text-gray-400">
                        Balance: {userBal}
                        {PROTOCOL_CONFIG.NATIVE_TOKEN}
                    </span>
                </div>
                <div className="relative">
                    <Input
                        type="number"
                        placeholder={`Enter ${PROTOCOL_CONFIG.NATIVE_TOKEN} amount`}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 pr-20"
                        min={PROTOCOL_CONFIG.MIN_STAKE}
                        max={userBal}
                        disabled={isLoading}
                    />
                    <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-purple-400 hover:text-purple-300"
                        onClick={() => setAmount("10")}
                    >
                        MAX
                    </button>
                </div>
                <div className="mt-4 space-y-2">
                    <CustomTooltip content={UI_ELEMENTS.TOOLTIPS.REWARDS}>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">
                                {UI_ELEMENTS.CARDS.MANAGEMENT.REWARDS}
                            </span>
                            <span className="text-green-400 text-sm  font-semibold">
                                <span className="px-1">
                                    {calculateDailyRewards(
                                        stakedTokenBalance,
                                        12
                                    )}
                                </span>
                                {PROTOCOL_CONFIG.TOKEN_SYMBOL}
                                /day
                            </span>
                        </div>
                    </CustomTooltip>
                    <CustomTooltip content={UI_ELEMENTS.TOOLTIPS.LOCK_PERIOD}>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">
                                {UI_ELEMENTS.CARDS.ANALYTICS.LOCK_PERIOD}
                            </span>
                            <span className="text-white pl-3 font-semibold text-sm">
                                {PROTOCOL_CONFIG.DEFAULT_LOCK_PERIOD} days
                            </span>
                        </div>
                    </CustomTooltip>
                </div>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 relative overflow-hidden"
                    disabled={isLoading || !amount || parseFloat(amount) <= 0}
                    onClick={handleDeposit}
                >
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        UI_ELEMENTS.BUTTONS.DEPOSIT
                    )}
                </Button>
            </motion.div>
        </div>
    );
};

export default DepositAssestManagement;