import { useEffect, useState } from "react";
import { updateWallet } from "./actions/updateWallet";
import { PeraWalletConnect } from "@perawallet/connect";
import { disconnectWallet } from "./actions/disconnectWallet";

const peraWallet = new PeraWalletConnect({
    chainId: 416001,
    singleAccount: true,
});

export default function WalletConnect({ id }: { id: string }) {
    const [accountAddress, setAccountAddress] = useState("");
    const [isConnected, setIsConnected] = useState(false);

    const disconnect = async () => {
        try {
            await peraWallet.disconnect();
            setAccountAddress("");
            setIsConnected(false);
            await disconnectWallet(id);
        } catch (err) {
            console.log(err);
        }
    };

    const connect = async (address: string) => {
        try {
            setAccountAddress(address);
            setIsConnected(true);
            const encoder = new TextEncoder();
            const data = encoder.encode(JSON.stringify({ id, address }));
            const signedBytes = await peraWallet.signData(
                [{ data, message: "authentication" }],
                address
            );

            const signature = uint8ArrayToBase64(signedBytes[0]);
            await updateWallet(id, address, signature);
        } catch (err) {
            console.log(err);
        }
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
            console.log(err);
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

function uint8ArrayToBase64(uint8Array: Uint8Array) {
    // Create a binary string from the Uint8Array
    let binary = "";
    for (let i = 0; i < uint8Array.length; i++) {
        binary += String.fromCharCode(uint8Array[i]);
    }
    // Encode the binary string in Base64
    return window.btoa(binary);
}
