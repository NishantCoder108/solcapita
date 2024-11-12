import { PROTOCOL_CONFIG, UI_ELEMENTS } from "@/constants";
import { useEffect, useState } from "react";
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
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { toast } from "sonner";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useSocket } from "@/contexts/SocketContext";

export default function DepositAssestManagement({
    userBal,
    stakedTokenBalance,
}: {
    userBal: number;
    stakedTokenBalance: number;
}) {
    const [amount, setAmount] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [btnText, setBtnText] = useState<string>(UI_ELEMENTS.BUTTONS.DEPOSIT);
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const [isMinting, setMinting] = useState(false);

    const socket = useSocket();
    console.log({ socket });
    const handleDeposit = async () => {
        setIsLoading(true);

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
            setMinting(true);
            setIsLoading(false);
        } catch (error) {
            console.log({ error });
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!socket) return;

        const handleConnect = () => {
            console.log("Deposit Management Socket is connected");
        };

        const handleMintingStart = (data: { message: string }) => {
            setMinting((prev) => (!prev ? true : prev));
            setBtnText(data.message);
        };

        const handleMintingComplete = (data: { message: string }) => {
            setBtnText(UI_ELEMENTS.BUTTONS.DEPOSIT);
            setMinting(false);
            showMintingSuccessToast(data.message);
        };

        const handleAssetManagementError = (data: { message: string }) => {
            setBtnText(UI_ELEMENTS.BUTTONS.DEPOSIT);
            setMinting(false);
            toast.error(data.message || "An unexpected issue has occurred");
        };

        const handleDisconnect = () => {
            setBtnText(UI_ELEMENTS.BUTTONS.DEPOSIT);
            setMinting(false);
            toast.error(
                "Connection lost. Please check your network and try again.",
                {
                    className:
                        "bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md",
                    icon: <AlertCircle className="w-6 h-6 text-red-500 mr-2" />,
                    duration: 2000,
                }
            );
        };

        socket.on("connect", handleConnect);
        socket.on("mintingStart", handleMintingStart);
        socket.on("mintingComplete", handleMintingComplete);
        socket.on("assetManagementError", handleAssetManagementError);
        socket.on("disconnect", handleDisconnect);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("mintingStart", handleMintingStart);
            socket.off("mintingComplete", handleMintingComplete);
            socket.off("assetManagementError", handleAssetManagementError);
            socket.off("disconnect", handleDisconnect);
        };
    }, [socket]);

    const showMintingSuccessToast = (message: string) => {
        toast(message, {
            className:
                "flex items-center bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md",
            duration: 5000,
            icon: <CheckCircle className="w-6 h-6 text-green-500 mr-2" />,
        });
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
                    disabled={
                        isLoading ||
                        isMinting ||
                        !amount ||
                        parseFloat(amount) <= 0
                    }
                    onClick={handleDeposit}
                >
                    {isLoading ? <LoadingSpinner /> : btnText}
                </Button>
            </motion.div>
        </div>
    );
}
