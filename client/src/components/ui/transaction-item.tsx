import { motion } from "framer-motion"
import { StakeHistory } from "@/types"
import { formatAmount } from "@/utils"

interface TransactionItemProps {
    transaction: StakeHistory;
    nativeToken: string;
    tokenSymbol: string;
}

export const TransactionItem = ({ transaction, nativeToken, tokenSymbol }: TransactionItemProps) => (
    <motion.div
        whileHover={{ scale: 1.01 }}
        className="flex justify-between items-center text-sm bg-white/10 p-4 rounded-lg border border-white/5 hover:border-purple-500/30 transition-all"
    >
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'stake' ? 'bg-green-500/10' : 'bg-red-500/10'
                }`}>
                <span className={`text-lg ${transaction.type === 'stake' ? 'text-green-400' : 'text-red-400'
                    }`}>
                    {transaction.type === 'stake' ? '↓' : '↑'}
                </span>
            </div>
            <div>
                <p className={`font-medium ${transaction.type === 'stake' ? 'text-green-400' : 'text-red-400'
                    }`}>
                    {transaction.type === 'stake' ? 'Deposit' : 'Withdrawal'}
                </p>
                <p className="text-white">
                    {formatAmount(transaction.amount)} {transaction.type === 'stake' ? nativeToken : tokenSymbol}
                </p>
            </div>
        </div>
        <div className="text-right">
            <p className="text-gray-400">{transaction.timestamp.toLocaleDateString()}</p>
            <p className="text-xs text-gray-500">{transaction.timestamp.toLocaleTimeString()}</p>
            {transaction.txHash && (
                <a
                    href={`https://solscan.io/tx/${transaction.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-400 hover:text-purple-300"
                >
                    View Transaction ↗
                </a>
            )}
        </div>
    </motion.div>
) 