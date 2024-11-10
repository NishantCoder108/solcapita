export const RPC_URL = import.meta.env.VITE_RPC_URL || "https://api.devnet.solana.com"

export const WALLET_LABELS = {
    "change-wallet": "Change wallet",
    connecting: "Connecting ...",
    "copy-address": "Copy address",
    copied: "Copied",
    disconnect: "Disconnect",
    "has-wallet": "Connect",
    "no-wallet": "Connect Wallet Securely",
} as const;



export const TOKEN_MINT_ADDRESS = import.meta.env.VITE_TOKEN_MINT_ADDRESS as string;

export const MINTER_PUBLIC_KEY = import.meta.env.VITE_MINTER_PUBLIC_KEY as string;
