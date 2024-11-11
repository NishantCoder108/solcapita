import { UI_ELEMENTS } from "@/constants";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
    CardHeader,
} from "./ui/card";
import { ArrowRightLeft } from "lucide-react";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "./ui/tabs";
import { getStakedTokenBalance, getUserBalance } from "@/utils/wallet";
import { useWallet } from "@solana/wallet-adapter-react";
import DepositAssestManagement from "./DepositAssestManagement";
import WithdrawAssestManagement from "./WithdrawAssestManagement";

const AssestManagement = () => {
    const { publicKey } = useWallet();
    const [stakedTokenBalance, setStakedTokenBalance] = useState<number>(0);

    const [userBal, setUserBal] = useState<number>(0);

    const fetchBal = async () => {
        if (!publicKey) return;
        const balance = await getUserBalance(publicKey);
        console.log({ balance });

        setUserBal(balance);
    };

    const fetchStakedTokenBalance = async () => {
        try {
            if (!publicKey) return;

            const balanceToken = await getStakedTokenBalance(publicKey);

            setStakedTokenBalance(balanceToken);
        } catch (error) {
            console.log({ error });

            setStakedTokenBalance(0);
        }
    };

    useEffect(() => {
        fetchBal();
        fetchStakedTokenBalance();
    }, [publicKey]);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <Card className="border-0 shadow-xl bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                            <ArrowRightLeft className="h-5 w-5" />
                            {UI_ELEMENTS.CARDS.MANAGEMENT.TITLE}
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            {UI_ELEMENTS.CARDS.MANAGEMENT.SUBTITLE}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="deposit" className="space-y-4">
                            <TabsList className="w-full grid grid-cols-2">
                                <TabsTrigger value="deposit">
                                    {UI_ELEMENTS.CARDS.MANAGEMENT.DEPOSIT}
                                </TabsTrigger>
                                <TabsTrigger value="withdraw">
                                    {UI_ELEMENTS.CARDS.MANAGEMENT.WITHDRAW}
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="deposit">
                                <DepositAssestManagement
                                    userBal={userBal}
                                    stakedTokenBalance={stakedTokenBalance}
                                />
                            </TabsContent>
                            <TabsContent value="withdraw" className="space-y-4">
                                <WithdrawAssestManagement
                                    stakedTokenBalance={stakedTokenBalance}
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </motion.div>
        </>
    );
};

export default AssestManagement;
