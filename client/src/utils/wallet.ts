import { MINTER_PUBLIC_KEY, RPC_URL, TOKEN_MINT_ADDRESS } from "@/constants/wallet"
import { Connection, PublicKey } from "@solana/web3.js"
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token"


export const getStakedTokenBalance = async (walletAddress: PublicKey): Promise<number> => {


    try {
        const conn = new Connection(RPC_URL)
        const walletPubkey = walletAddress;
        const tokenMintPubkey = new PublicKey(TOKEN_MINT_ADDRESS)

        const associatedTokenAddress = await getAssociatedTokenAddress(tokenMintPubkey, walletPubkey,);

        const accountInfo = await getAccount(conn, associatedTokenAddress,)

        console.log({ accountInfo })

        return Number(accountInfo.amount)
    } catch (error) {

        console.log({ error })

        return 0
    }
}


export const getTotalStakedBal = async (): Promise<number> => {

    try {
        const conn = new Connection(RPC_URL)
        const walletPubkey = new PublicKey(MINTER_PUBLIC_KEY)

        const tokenMintPubkey = new PublicKey(TOKEN_MINT_ADDRESS)
        const associatedTokenAddress = await getAssociatedTokenAddress(tokenMintPubkey, walletPubkey);

        const accountInfo = await getAccount(conn, associatedTokenAddress)
        console.log({ accountInfo, walletPubkey, tokenMintPubkey, associatedTokenAddress: associatedTokenAddress.toBase58() })
        return Number(accountInfo.amount)
    } catch (error) {
        console.log({ error })
        return 0
    }
}



export const getTokenSupply = async (): Promise<number> => {
    try {
        const conn = new Connection(RPC_URL);

        const mintPubKey = new PublicKey(TOKEN_MINT_ADDRESS);
        const supply = await conn.getTokenSupply(mintPubKey)

        console.log({ supply })

        return Number(supply.value.amount)

    } catch (error) {
        console.log({ error })
        return 0

    }
}