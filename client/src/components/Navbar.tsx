import { PROTOCOL_CONFIG, PROTOCOL_MESSAGES, UI_ELEMENTS } from "@/constants";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ChevronDown, Shield } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { useSocket } from "@/contexts/SocketContext";

const Navbar = () => {
    const { publicKey, connected, disconnect } = useWallet();
    const socket = useSocket();

    const disconnectWallet = () => {
        disconnect();
        toast.success("Wallet disconnected successfully");

        if (socket) {
            socket.disconnect();
        }
    };
    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">
                        {PROTOCOL_CONFIG.NAME}
                    </h1>
                    <p className="text-gray-400">
                        {PROTOCOL_MESSAGES.WELCOME_SUBTITLE}
                    </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    {connected ? (
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        className="flex items-center gap-2"
                                    >
                                        <Shield className="h-4 w-4" />
                                        {publicKey?.toBase58().slice(0, 4) +
                                            "..." +
                                            publicKey?.toBase58().slice(-4)}
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="">
                                    <DropdownMenuItem
                                        onClick={disconnectWallet}
                                        className="cursor-pointer "
                                    >
                                        {UI_ELEMENTS.BUTTONS.DISCONNECT}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;
