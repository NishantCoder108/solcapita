import HomePage from "./HomePage";
import Navbar from "./Navbar";
import StakeHistoryComponent from "./StakeHistoryComponent";
import AssestManagement from "./AssestManagement";
import ProtocolOverview from "./ProtocolOverview";
import { useWallet } from "@solana/wallet-adapter-react";

const SolstakeProtocol = () => {
    const { connected } = useWallet();

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-gray-900 to-black flex flex-col items-center justify-start p-4">
            <div className="max-w-[85rem] w-full mx-auto ">
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
    );
};

export default SolstakeProtocol;
