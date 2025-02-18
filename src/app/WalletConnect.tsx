import { useEffect, useState } from "react";
import { updateWallet } from "./actions/updateWallet";
import { PeraWalletConnect } from "@perawallet/connect";
import { disconnectWallet } from "./actions/disconnectWallet";
import Spinner from "./Spinner";

const peraWallet = new PeraWalletConnect({
    chainId: 416001,
    singleAccount: true,
});

export default function WalletConnect({ id }: { id: string }) {
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const disconnect = async () => {
        try {
            await peraWallet.disconnect();
            setIsConnected(false);
            await disconnectWallet(id);
            setMessage("Disconnected!");
        } catch (err) {
            setMessage("An error occured");
            console.log(err);
        }
    };

    const connect = async (address: string) => {
        try {
            setLoading(true);
            setIsConnected(true);
            setMessage("Signing data...");

            const encoder = new TextEncoder();
            const data = encoder.encode(JSON.stringify({ id, address }));
            const signedBytes = await peraWallet.signData(
                [{ data, message: "authentication" }],
                address
            );
            setMessage("Verifying signature...");
            const signature = uint8ArrayToBase64(signedBytes[0]);
            await updateWallet(id, address, signature);

            setMessage("Connected!");
        } catch (err) {
            console.log(err);
            await disconnect();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        peraWallet.reconnectSession().then(async (accounts) => {
            peraWallet.connector?.on("disconnect", disconnect);

            if (accounts.length > 0) {
                setAccountAddress(accounts[0]);
                setIsConnected(true);
                setMessage("Connected!");
            } else {
                setAccountAddress("");
                setIsConnected(false);
                setMessage("");
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
            setMessage("Connecting...");
            await connect(accounts[0]);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col items-center gap-2">
                {loading && <Spinner />}
                {message && <p>{message}</p>}
            </div>
            <button
                hidden={false}
                className="border px-2 py-1 rounded"
                onClick={onClick}
            >
                {isConnected ? "Disconnect" : "Connect Pera Wallet"}
            </button>
        </div>
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
