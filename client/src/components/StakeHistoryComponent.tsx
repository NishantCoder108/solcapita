import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'
import { History } from 'lucide-react'
import { UI_ELEMENTS } from '@/constants'
import { PROTOCOL_CONFIG } from '@/constants'
// import { formatAmount } from '@/utils/formatAmount'

const StakeHistoryComponent = ({ stakeHistory }: { stakeHistory: any[] }) => {
    return (
        <>{stakeHistory.length > 0 && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-2"
            >
                <Card className="border-0 shadow-xl bg-white/5 backdrop-blur-sm lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                            <History className="h-5 w-5" />
                            {UI_ELEMENTS.CARDS.HISTORY.TITLE}
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            {UI_ELEMENTS.CARDS.HISTORY.SUBTITLE}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stakeHistory.map((history, index) => (
                                <div
                                    key={history.id}
                                    className="flex justify-between items-center text-sm bg-white/10 p-3 rounded-lg hover:bg-white/15 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${history.type === 'stake' ? 'bg-green-400' : 'bg-red-400'}`} />
                                        <div className="flex flex-col">
                                            <span className={history.type === 'stake' ? 'text-green-400' : 'text-red-400'}>
                                                {history.type === 'stake' ? UI_ELEMENTS.CARDS.HISTORY.DEPOSIT_ACTION : UI_ELEMENTS.CARDS.HISTORY.WITHDRAW_ACTION}
                                            </span>
                                            <span className="text-white">
                                                {/* {formatAmount(history.amount)} */}
                                                22
                                                {history.type === 'stake' ? PROTOCOL_CONFIG.NATIVE_TOKEN : PROTOCOL_CONFIG.TOKEN_SYMBOL}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-gray-400">
                                            {history.timestamp.toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {history.timestamp.toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        )}</>
    )
}

export default StakeHistoryComponent