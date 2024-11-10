import { PROTOCOL_MESSAGES, } from "@/constants"
import { WALLET_LABELS } from "@/constants/wallet"
import { BaseWalletMultiButton, WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { motion, } from "framer-motion"
import { Shield } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"


const HomePage = () => {
    const wallet = useWallet();
    const isWalletConnected = wallet.connected;


    const connectedStyle = {
        border: "1px solid #9333ea",
        background: "#9333ea",
        borderRadius: "1rem",
        height: "2.3rem"
    }
    const disconnectedStyle = {
        border: "1px solid #9333ea",
        background: "#9333ea",
        borderRadius: "1rem",
        height: "2.3rem",
        fontSize: "0.9rem",
        fontFamily: "inherit"

    }
    return (
        <div>  <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center "
        >
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-lg text-center max-w-lg border border-white/10">
                <Shield className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-4">{PROTOCOL_MESSAGES.WELCOME_TITLE}</h2>
                <p className="text-gray-400 mb-6">
                    {PROTOCOL_MESSAGES.WELCOME_DESCRIPTION}
                </p>
                <div className="space-y-4">
                    {Object.entries(PROTOCOL_MESSAGES.STEPS).map(([key, step], index) => (
                        <div key={key} className="flex items-center gap-3 text-sm text-gray-400">
                            <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
                                <span className="text-purple-400">{index + 1}</span>
                            </div>
                            {step}
                        </div>
                    ))}
                </div>
                <div className="mt-8">

                    <WalletModalProvider>
                        <BaseWalletMultiButton
                            endIcon={!isWalletConnected ? <Shield className="ml-2 h-4 w-4" /> : undefined}
                            style={
                                isWalletConnected
                                    ? connectedStyle
                                    : disconnectedStyle
                            }
                            labels={WALLET_LABELS}
                        />
                    </WalletModalProvider>

                </div>

                <div className="mt-8 grid grid-cols-3 gap-4">
                    {Object.entries(PROTOCOL_MESSAGES.FEATURES).map(([key, feature]) => (
                        <motion.div
                            key={key}
                            whileHover={{ scale: 1.05 }}
                            className="text-center p-4 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all"
                        >
                            <p className="text-purple-400 text-sm font-medium">{feature}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div></div>
    )
}

export default HomePage
