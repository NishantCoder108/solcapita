import { motion } from "framer-motion"

interface StatCardProps {
    label: string;
    value: string;
    subValue?: string;
    icon?: React.ReactNode;
    trend?: 'up' | 'down';
    trendValue?: string;
}

export const StatCard = ({ label, value, subValue, icon, trend, trendValue }: StatCardProps) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white/10 p-4 rounded-lg border border-white/5 hover:border-purple-500/30 transition-all"
    >
        <div className="flex items-start justify-between">
            <p className="text-sm text-gray-400">{label}</p>
            {icon && <span className="text-purple-400">{icon}</span>}
        </div>
        <p className="text-2xl font-bold text-white mt-2">{value}</p>
        {subValue && <p className="text-sm text-gray-400 mt-1">{subValue}</p>}
        {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}
            </div>
        )}
    </motion.div>
) 