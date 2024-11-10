import SolstakeProtocol from "./components/SolstakeProtocol"
import { Toaster } from "sonner"
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { RPC_URL } from "./constants/wallet";
import "@solana/wallet-adapter-react-ui/styles.css";

function App() {

  // if (process.env.NODE_ENV === "production") {
  //   console.log = () => { };
  //   console.warn = () => { };
  //   console.error = () => { };
  // }
  return (
    <ConnectionProvider endpoint={RPC_URL as string}>

      <WalletProvider wallets={[]} autoConnect>
        <SolstakeProtocol />
        <Toaster position="bottom-right" />
      </WalletProvider>

    </ConnectionProvider>
  )
}

export default App
