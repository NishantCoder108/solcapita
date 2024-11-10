import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Wallet2, AlertCircle, ArrowRightLeft, Coins, Clock, History, ChevronDown } from "lucide-react"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

interface StakeHistory {
    type: 'stake' | 'unstake';
    amount: string;
    timestamp: Date;
    status: 'completed' | 'pending' | 'failed';
}

interface StakePosition {
    amount: string;
    stakedAt: Date;
    unlockDate: Date;
}

const StakingDashboard = () => {
    const [amount, setAmount] = useState<string>("")
    const [isConnected, setIsConnected] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showStakeHistory, setShowStakeHistory] = useState(false)

    // Simulated balances and data
    const [solBalance, setSolBalance] = useState("10.5")
    const [stakeTokenBalance, setStakeTokenBalance] = useState("100")
    const [totalStaked, setTotalStaked] = useState("50000")
    const [userStaked, setUserStaked] = useState("1000")
    const [apr] = useState(12)
    const [lockPeriod] = useState(7) // 7 days lock period
    const [estimatedRewards, setEstimatedRewards] = useState("0")
    const [stakeHistory, setStakeHistory] = useState<StakeHistory[]>([
        { type: 'stake', amount: '5', timestamp: new Date(Date.now() - 86400000), status: 'completed' },
        { type: 'unstake', amount: '2', timestamp: new Date(Date.now() - 172800000), status: 'completed' },
    ])

    // Add new state for tracking stake positions
    const [stakePositions, setStakePositions] = useState<StakePosition[]>([])

    // Calculate total locked amount
    const getTotalLockedAmount = () => {
        const now = new Date()
        return stakePositions
            .filter(position => position.unlockDate > now)
            .reduce((total, position) => total + parseFloat(position.amount), 0)
            .toString()
    }

    // Calculate total unlocked amount
    const getUnlockedAmount = () => {
        const now = new Date()
        return stakePositions
            .filter(position => position.unlockDate <= now)
            .reduce((total, position) => total + parseFloat(position.amount), 0)
            .toString()
    }

    useEffect(() => {
        if (amount && parseFloat(amount) > 0) {
            // Calculate estimated rewards based on APR
            const yearly = (parseFloat(amount) * apr) / 100
            const daily = yearly / 365
            setEstimatedRewards(daily.toFixed(4))
        } else {
            setEstimatedRewards("0")
        }
    }, [amount, apr])

    const handleConnect = () => {
        setIsConnected(!isConnected)
        if (!isConnected) {
            toast.success("Wallet connected successfully!")
        }
    }

    const handleStake = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Please enter a valid amount")
            return
        }

        if (parseFloat(amount) > parseFloat(solBalance)) {
            toast.error("Insufficient SOL balance")
            return
        }

        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Calculate unlock date
            const unlockDate = new Date()
            unlockDate.setDate(unlockDate.getDate() + lockPeriod)

            // Add new stake position
            setStakePositions(prev => [...prev, {
                amount: (parseFloat(amount) * 10).toString(), // Convert SOL to Stake Tokens
                stakedAt: new Date(),
                unlockDate: unlockDate
            }])

            setSolBalance(prev => (parseFloat(prev) - parseFloat(amount)).toString())
            setStakeTokenBalance(prev => (parseFloat(prev) + parseFloat(amount) * 10).toString())
            setUserStaked(prev => (parseFloat(prev) + parseFloat(amount) * 10).toString())
            setTotalStaked(prev => (parseFloat(prev) + parseFloat(amount) * 10).toString())

            setStakeHistory(prev => [{
                type: 'stake',
                amount: amount,
                timestamp: new Date(),
                status: 'completed'
            }, ...prev])

            toast.success(`Successfully staked ${amount} SOL for ${parseFloat(amount) * 10} Stake Tokens`)
            setAmount("")
        } catch (error) {
            toast.error("Failed to stake tokens")
        } finally {
            setIsLoading(false)
        }
    }

    const handleUnstake = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Please enter a valid amount")
            return
        }

        const unlockedAmount = parseFloat(getUnlockedAmount())
        if (parseFloat(amount) > unlockedAmount) {
            toast.error(`Only ${unlockedAmount} tokens are available for unstaking`)
            return
        }

        if (parseFloat(amount) > parseFloat(stakeTokenBalance)) {
            toast.error("Insufficient Stake Token balance")
            return
        }

        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Remove unstaked amount from positions, starting with the oldest unlocked positions
            let remainingToUnstake = parseFloat(amount)
            setStakePositions(prev => {
                const now = new Date()
                const updatedPositions = [...prev]
                const unlockedPositions = updatedPositions
                    .filter(pos => pos.unlockDate <= now)
                    .sort((a, b) => a.stakedAt.getTime() - b.stakedAt.getTime())

                for (const position of unlockedPositions) {
                    if (remainingToUnstake <= 0) break

                    const positionAmount = parseFloat(position.amount)
                    if (positionAmount <= remainingToUnstake) {
                        // Remove entire position
                        const index = updatedPositions.indexOf(position)
                        updatedPositions.splice(index, 1)
                        remainingToUnstake -= positionAmount
                    } else {
                        // Partially reduce position
                        position.amount = (positionAmount - remainingToUnstake).toString()
                        remainingToUnstake = 0
                    }
                }

                return updatedPositions
            })

            setStakeTokenBalance(prev => (parseFloat(prev) - parseFloat(amount)).toString())
            setSolBalance(prev => (parseFloat(prev) + parseFloat(amount) / 10).toString())
            setUserStaked(prev => (parseFloat(prev) - parseFloat(amount)).toString())
            setTotalStaked(prev => (parseFloat(prev) - parseFloat(amount)).toString())

            setStakeHistory(prev => [{
                type: 'unstake',
                amount: amount,
                timestamp: new Date(),
                status: 'completed'
            }, ...prev])

            toast.success(`Successfully unstaked ${amount} Stake Tokens for ${parseFloat(amount) / 10} SOL`)
            setAmount("")
        } catch (error) {
            toast.error("Failed to unstake tokens")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-gray-900 to-black flex flex-col items-center justify-center p-4">
            <div className="max-w-[85rem] w-full mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Antex Protocol</h1>
                        <p className="text-gray-400">Earn ANT tokens by staking your SOL</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        {isConnected ? (
                            <>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="secondary" className="flex items-center gap-2">
                                            <Wallet2 className="h-4 w-4" />
                                            0x1234...5678
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuItem onClick={() => setIsConnected(false)}>
                                            Disconnect
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <div className="flex gap-4 text-sm">
                                    <HoverCard>
                                        <HoverCardTrigger className="cursor-help">
                                            <span className="text-gray-400">SOL: <span className="text-white">{solBalance}</span></span>
                                        </HoverCardTrigger>
                                        <HoverCardContent>
                                            Current market value: ${(parseFloat(solBalance) * 100).toFixed(2)} USD
                                        </HoverCardContent>
                                    </HoverCard>
                                    <span className="text-gray-400">Stake Tokens: <span className="text-white">{stakeTokenBalance}</span></span>
                                </div>
                            </>
                        ) : (
                            <Button
                                variant="default"
                                className="flex items-center gap-2"
                                onClick={handleConnect}
                            >
                                <Wallet2 className="h-4 w-4" />
                                Connect Wallet
                            </Button>
                        )}
                    </div>
                </div>

                {!isConnected ? (
                    // Welcome/Connect View
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-lg text-center max-w-lg">
                            <Coins className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-white mb-4">Welcome to Antex Protocol</h2>
                            <p className="text-gray-400 mb-6">
                                Stake SOL to earn ANT tokens and participate in the Antex ecosystem.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
                                        <span className="text-purple-400">1</span>
                                    </div>
                                    Connect your wallet
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
                                        <span className="text-purple-400">2</span>
                                    </div>
                                    Stake SOL to mint ANT
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
                                        <span className="text-purple-400">3</span>
                                    </div>
                                    Earn protocol rewards
                                </div>
                            </div>
                            <div className="mt-8">
                                <Button
                                    className="bg-purple-600 hover:bg-purple-700"
                                    onClick={handleConnect}
                                >
                                    <Wallet2 className="mr-2 h-4 w-4" />
                                    Connect Wallet
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Main Staking Interface
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Statistics Card */}
                        <Card className="border-0 shadow-xl bg-white/5 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl text-white flex items-center gap-2">
                                    <Coins className="h-5 w-5" />
                                    Protocol Analytics
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Real-time protocol metrics and rewards
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/10 p-4 rounded-lg">
                                        <p className="text-sm text-gray-400">Total Value Locked</p>
                                        <p className="text-2xl font-bold text-white">{Number(totalStaked).toLocaleString()} ANT</p>
                                    </div>
                                    <div className="bg-white/10 p-4 rounded-lg">
                                        <p className="text-sm text-gray-400">Your Position</p>
                                        <p className="text-2xl font-bold text-white">{Number(userStaked).toLocaleString()} ANT</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">APR</span>
                                        <span className="text-green-400 font-bold">{apr}%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Lock Period</span>
                                        <span className="text-white">{lockPeriod} days</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Your Share</span>
                                        <span className="text-white">{((parseFloat(userStaked) / parseFloat(totalStaked)) * 100).toFixed(2)}%</span>
                                    </div>
                                    <Progress value={(parseFloat(userStaked) / parseFloat(totalStaked)) * 100} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Staking Card */}
                        <Card className="border-0 shadow-xl bg-white/5 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl text-white flex items-center gap-2">
                                    <ArrowRightLeft className="h-5 w-5" />
                                    Liquidity Management
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Manage your protocol position
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="stake" className="space-y-4">
                                    <TabsList className="w-full grid grid-cols-2">
                                        <TabsTrigger value="stake">Deposit SOL</TabsTrigger>
                                        <TabsTrigger value="unstake">Withdraw</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="stake" className="space-y-4">
                                        <div>
                                            <label className="text-sm text-gray-400 mb-2 block">
                                                Amount (SOL)
                                            </label>
                                            <Input
                                                type="number"
                                                placeholder="Enter SOL amount"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                                                min="0"
                                                disabled={!isConnected || isLoading}
                                            />
                                            <div className="mt-2 space-y-1">
                                                <p className="text-sm text-gray-400">
                                                    You will receive: <span className="text-white">{amount ? parseFloat(amount) * 10 : 0} Stake Tokens</span>
                                                </p>
                                                <p className="text-sm text-gray-400">
                                                    Estimated daily rewards: <span className="text-green-400">{estimatedRewards} ST</span>
                                                </p>
                                                <p className="text-sm text-gray-400 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    Lock period: <span className="text-white">{lockPeriod} days</span>
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            className="w-full bg-purple-600 hover:bg-purple-700"
                                            disabled={!isConnected || isLoading || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(solBalance)}
                                            onClick={handleStake}
                                        >
                                            {isLoading ? "Processing..." : "Stake SOL"}
                                        </Button>
                                    </TabsContent>
                                    <TabsContent value="unstake" className="space-y-4">
                                        <div>
                                            <label className="text-sm text-gray-400 mb-2 block">
                                                Amount (Stake Tokens)
                                            </label>
                                            <Input
                                                type="number"
                                                placeholder="Enter Stake Token amount"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                                                min="0"
                                                disabled={!isConnected || isLoading}
                                            />
                                            <div className="mt-2 space-y-1">
                                                <p className="text-sm text-gray-400">
                                                    You will receive: <span className="text-white">{amount ? parseFloat(amount) / 10 : 0} SOL</span>
                                                </p>
                                                <p className="text-sm text-gray-400">
                                                    Available to unstake: <span className="text-white">{getUnlockedAmount()} ST</span>
                                                </p>
                                                <p className="text-sm text-gray-400">
                                                    Locked: <span className="text-white">{getTotalLockedAmount()} ST</span>
                                                </p>
                                                {stakePositions.length > 0 && (
                                                    <div className="mt-4">
                                                        <p className="text-sm text-gray-400 mb-2">Lock Period Details:</p>
                                                        {stakePositions.map((position, index) => (
                                                            <div key={index} className="text-xs text-gray-400">
                                                                {position.amount} ST unlocks on {position.unlockDate.toLocaleDateString()}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            className="w-full"
                                            disabled={
                                                !isConnected ||
                                                isLoading ||
                                                !amount ||
                                                parseFloat(amount) <= 0 ||
                                                parseFloat(amount) > parseFloat(getUnlockedAmount())
                                            }
                                            onClick={handleUnstake}
                                        >
                                            {isLoading ? "Processing..." : "Unstake Tokens"}
                                        </Button>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>

                        {/* Transaction History Card */}
                        {stakeHistory.length > 0 && (
                            <Card className="border-0 shadow-xl bg-white/5 backdrop-blur-sm lg:col-span-2">
                                <CardHeader>
                                    <CardTitle className="text-xl text-white flex items-center gap-2">
                                        <History className="h-5 w-5" />
                                        Transaction History
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {stakeHistory.map((history, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between items-center text-sm bg-white/10 p-3 rounded-lg hover:bg-white/15 transition-colors"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${history.type === 'stake' ? 'bg-green-400' : 'bg-red-400'}`} />
                                                    <div className="flex flex-col">
                                                        <span className={history.type === 'stake' ? 'text-green-400' : 'text-red-400'}>
                                                            {history.type === 'stake' ? '+ Staked' : '- Unstaked'}
                                                        </span>
                                                        <span className="text-white">
                                                            {history.amount} {history.type === 'stake' ? 'SOL' : 'ST'}
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
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default StakingDashboard