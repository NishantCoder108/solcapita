
import HomePage from "./HomePage"
import Navbar from "./Navbar"
import StakeHistoryComponent from "./StakeHistoryComponent"
import AssestManagement from "./AssestManagement"
import ProtocolOverview from "./ProtocolOverview"
import { useWallet } from "@solana/wallet-adapter-react"

const SolstakeProtocol = () => {
    const { connected } = useWallet()
    // const [amount, setAmount] = useState<string>("")
    // const [estimatedRewards, setEstimatedRewards] = useState("0")
    // const [isHoveringDeposit, setIsHoveringDeposit] = useState(false)
    // const [showSuccessConfetti, setShowSuccessConfetti] = useState(false)


    // useEffect(() => {
    //     if (amount && parseFloat(amount) > 0) {
    //         const rewards = calculateRewards(amount, PROTOCOL_CONFIG.DEFAULT_APR)
    //         setEstimatedRewards(rewards)
    //     } else {
    //         setEstimatedRewards("0")
    //     }
    // }, [amount])

    // const handleConnect = async () => {
    //     try {
    //         await connect()
    //         toast.success("Wallet connected successfully")
    //     } catch (error) {
    //         toast.error("Failed to connect wallet")
    //     }
    // }

    // const handleDisconnect = () => {
    //     disconnect()
    //     toast.success("Wallet disconnected")
    // }

    // const handleDeposit = async () => {
    //     const error = validateStakeAmount(amount, "2")
    //     if (error) {
    //         toast.error(error)
    //         return
    //     }

    //     const success = await stake(amount)
    //     if (success) {
    //         setAmount("")
    //         setShowSuccessConfetti(true)
    //         setTimeout(() => setShowSuccessConfetti(false), 3000)
    //     }
    // }

    // const handleWithdraw = async () => {
    //     const error = validateStakeAmount(amount, "3")
    //     if (error) {
    //         toast.error(error)
    //         return
    //     }

    //     const success = await unstake(amount)
    //     if (success) {
    //         setAmount("")
    //     }
    // }


    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-gray-900 to-black flex flex-col items-center justify-center p-4">
            <div className="max-w-[85rem] w-full mx-auto">
                <Navbar />
                {!connected ? (
                    <HomePage />
                ) : (
                    <div className="grid lg:grid-cols-2 gap-6">
                        <ProtocolOverview />
                        <AssestManagement />

                        <StakeHistoryComponent stakeHistory={[]} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default SolstakeProtocol 