import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

interface AmountInputProps {
    value: string;
    onChange: (value: string) => void;
    maxAmount: string;
    symbol: string;
    disabled?: boolean;
    onMaxClick: () => void;
}

export const AmountInput = ({ value, onChange, maxAmount, symbol, disabled, onMaxClick }: AmountInputProps) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center">
            <label className="text-sm text-gray-400">Amount</label>
            <span className="text-xs text-gray-400">
                Balance: {maxAmount} {symbol}
            </span>
        </div>
        <div className="relative">
            <Input
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 pr-24"
                placeholder={`Enter amount`}
                disabled={disabled}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onMaxClick}
                    className="px-2 py-1 text-xs text-purple-400 hover:text-purple-300 bg-purple-500/10 rounded"
                >
                    MAX
                </motion.button>
                <span className="text-gray-400 text-sm">{symbol}</span>
            </div>
        </div>
    </div>
) 