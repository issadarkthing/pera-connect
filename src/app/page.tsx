"use client";
import { useSearchParams } from "next/navigation";
import WalletConnect from "./WalletConnect";

export default function Home() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                {id ? <WalletConnect id={id} /> : "An error occured"}
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                <p className="font-mono">developed by razimanterra</p>
            </footer>
        </div>
    );
}
