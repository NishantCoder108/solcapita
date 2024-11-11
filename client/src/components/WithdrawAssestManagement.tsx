import { UI_ELEMENTS } from "@/constants";
import { PROTOCOL_CONFIG } from "@/constants";
import { Input } from "./ui/input";
import React, { useState } from "react";
import { CustomTooltip } from "./ui/custom-tooltip";
import { calculateDailyRewards } from "@/utils/wallet";
import { LoadingSpinner } from "./ui/loading-spinner";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

const WithdrawAssestManagement = ({
    stakedTokenBalance,
}: {
    stakedTokenBalance: number;
}) => {
    const [amount, setAmount] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="space-y-4">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-gray-400">
                        Amount ({PROTOCOL_CONFIG.TOKEN_SYMBOL})
                    </label>
                    <span className="text-xs text-gray-400">
                        {PROTOCOL_CONFIG.TOKEN_SYMBOL}
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
                        max={Number(stakedTokenBalance) / 1e9}
                        disabled={isLoading}
                    />
                    <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-purple-400 hover:text-purple-300"
                        onClick={() => setAmount("100")}
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
                    // onClick={handleDeposit}
                >
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        UI_ELEMENTS.BUTTONS.WITHDRAW
                    )}
                </Button>
            </motion.div>
        </div>
    );
};

export default WithdrawAssestManagement;
