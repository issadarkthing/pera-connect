"use server";
import { wallets } from "@/app/utils";

export async function updateWallet(userId: string, walletAddress: string) {
    wallets.set(userId, walletAddress);
}
