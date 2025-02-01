"use client";
import { PeraWalletConnect } from "@perawallet/connect";
import { useEffect, useState } from "react";
import { updateWallet } from "./actions/updateWallet";

const peraWallet = new PeraWalletConnect({
    chainId: 416001,
});

export default function Home() {
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
        await updateWallet("123", address);
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
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                {accountAddress}
                <button className="border px-2 py-1 rounded" onClick={onClick}>
                    {isConnected ? "Disconnect" : "Connect Pera Wallet"}
                </button>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                <p className="font-mono">developed by razimanterra</p>
            </footer>
        </div>
    );
}
