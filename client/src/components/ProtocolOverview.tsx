import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
    CardHeader,
} from "./ui/card";
import { Progress } from "./ui/progress";
import { PROTOCOL_CONFIG, UI_ELEMENTS } from "@/constants";
import { formatAmount, truncateDecimals } from "@/utils";
import { Shield } from "lucide-react";
import {
    getStakedTokenBalance,
    getTokenSupply,
    getTotalStakedBal,
} from "@/utils/wallet";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const ProtocolOverview = () => {
    const [stakedTokenBalance, setStakedTokenBalance] = useState(0);
    const [totalStakedBal, setTotalStakedBal] = useState(0);
    const [tokenSupply, setTokenSupply] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const wallet = useWallet();

    const userShare =
        tokenSupply > 0 ? (stakedTokenBalance / tokenSupply) * 100 : 0;

    console.log({ userShare });

    const fetchStakedTokenBalance = async () => {
        setIsLoading(true);
        try {
            if (!wallet.publicKey) return;

            if (totalStakedBal === 0) {
                const totalStakedBal = await getTotalStakedBal();

                setTotalStakedBal(totalStakedBal);
            }

            const balanceToken = await getStakedTokenBalance(wallet.publicKey);

            setStakedTokenBalance(Number(balanceToken) / LAMPORTS_PER_SOL);
        } catch (error) {
            console.log({ error });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTokenSupply = async () => {
        const supplyToken = await getTokenSupply();
        setTokenSupply(supplyToken);
    };

    useEffect(() => {
        if (tokenSupply === 0) {
            fetchTokenSupply();
        }

        fetchStakedTokenBalance();
    }, [wallet.publicKey]);

    console.log({ stakedTokenBalance, totalStakedBal });
    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <Card className="border-0 shadow-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <CardHeader>
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            {UI_ELEMENTS.CARDS.ANALYTICS.TITLE}
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            {UI_ELEMENTS.CARDS.ANALYTICS.SUBTITLE}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 p-4 rounded-lg">
                                <p className="text-sm text-gray-400">
                                    {UI_ELEMENTS.CARDS.ANALYTICS.TVL}
                                </p>
                                <p className="text-lg font-bold text-white">
                                    {formatAmount(totalStakedBal)}
                                    {"  "}
                                    {PROTOCOL_CONFIG.TOKEN_SYMBOL}
                                </p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-lg">
                                <p className="text-sm text-gray-400">
                                    {UI_ELEMENTS.CARDS.ANALYTICS.YOUR_POSITION}
                                </p>
                                <p className="text-lg font-bold text-white">
                                    {formatAmount(stakedTokenBalance)}{" "}
                                    {PROTOCOL_CONFIG.TOKEN_SYMBOL}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">
                                    {UI_ELEMENTS.CARDS.ANALYTICS.APY}
                                </span>
                                <span className="text-green-400 font-bold">
                                    {PROTOCOL_CONFIG.DEFAULT_APR}%
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">
                                    {UI_ELEMENTS.CARDS.ANALYTICS.LOCK_PERIOD}
                                </span>
                                <span className="text-white">
                                    {PROTOCOL_CONFIG.DEFAULT_LOCK_PERIOD} days
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">
                                    {UI_ELEMENTS.CARDS.ANALYTICS.SHARE}
                                </span>
                                <span className="text-white">
                                    {truncateDecimals(userShare)}%
                                </span>
                            </div>
                            <Progress
                                value={Number(truncateDecimals(userShare))}
                                className="h-2"
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </>
    );
};

export default ProtocolOverview;
