import { useEffect, useState } from "react";
import { updateWallet } from "./actions/updateWallet";
import { PeraWalletConnect } from "@perawallet/connect";

const peraWallet = new PeraWalletConnect({
    chainId: 416001,
});

export default function WalletConnect({ id }: { id: string }) {
    const [accountAddress, setAccountAddress] = useState("");
    const [isConnected, setIsConnected] = useState(false);

    const disconnect = async () => {
        await peraWallet.disconnect();
        setAccountAddress("");
        setIsConnected(false);
    };

    const connect = async (address: string) => {
        setAccountAddress(address);
        setIsConnected(true);
        await updateWallet(id, address);
    };

    useEffect(() => {
        peraWallet.reconnectSession().then(async (accounts) => {
            peraWallet.connector?.on("disconnect", disconnect);

            if (accounts.length > 0) {
                await connect(accounts[0]);
            }
        });
    }, []);

    const onClick = async () => {
        try {
            if (isConnected) {
                await disconnect();
                peraWallet.connector?.on("disconnect", disconnect);
                return;
            }

            const accounts = await peraWallet.connect();
            await connect(accounts[0]);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            {accountAddress}
            <button className="border px-2 py-1 rounded" onClick={onClick}>
                {isConnected ? "Disconnect" : "Connect Pera Wallet"}
            </button>
        </>
    );
}
