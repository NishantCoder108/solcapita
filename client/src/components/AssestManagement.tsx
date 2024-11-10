import { PROTOCOL_CONFIG, UI_ELEMENTS } from '@/constants'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from './ui/card'
import { ArrowRightLeft } from 'lucide-react'
import { Tabs, TabsContent, TabsTrigger, TabsList } from './ui/tabs'
import { Input } from './ui/input'
import { CustomTooltip } from './ui/custom-tooltip'
import { Button } from './ui/button'
import { LoadingSpinner } from './ui/loading-spinner'

const AssestManagement = () => {
    const [amount, setAmount] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
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
                            <TabsContent value="deposit" className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm text-gray-400">
                                            Amount ({PROTOCOL_CONFIG.NATIVE_TOKEN})
                                        </label>
                                        <span className="text-xs text-gray-400">
                                            Balance:9

                                            {/* {formatAmount(balance.sol)}  */}


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
                                            max={PROTOCOL_CONFIG.MAX_STAKE}
                                            disabled={isLoading}
                                        />
                                        <button
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-purple-400 hover:text-purple-300"
                                        // onClick={() => setAmount(balance.sol)}
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
                                                <span className="text-green-400">
                                                    {/* {estimatedRewards} */}
                                                    0

                                                    {PROTOCOL_CONFIG.TOKEN_SYMBOL}/day
                                                </span>
                                            </div>
                                        </CustomTooltip>
                                        <CustomTooltip content={UI_ELEMENTS.TOOLTIPS.LOCK_PERIOD}>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-400">
                                                    {UI_ELEMENTS.CARDS.ANALYTICS.LOCK_PERIOD}
                                                </span>
                                                <span className="text-white">
                                                    {PROTOCOL_CONFIG.DEFAULT_LOCK_PERIOD} days
                                                </span>
                                            </div>
                                        </CustomTooltip>
                                    </div>
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        className="w-full bg-purple-600 hover:bg-purple-700 relative overflow-hidden"
                                    // disabled={isLoading || !amount || parseFloat(amount) <= 0}
                                    // onClick={handleDeposit}
                                    >
                                        {isLoading ? (
                                            <LoadingSpinner />
                                        ) : (
                                            UI_ELEMENTS.BUTTONS.DEPOSIT
                                        )}
                                    </Button>
                                </motion.div>
                            </TabsContent>
                            <TabsContent value="withdraw" className="space-y-4">
                                {/* Similar structure for withdraw tab */}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </motion.div>
        </>)
}

export default AssestManagement