"use server";

export async function disconnectWallet(id: string) {
    const result = await fetch(`${process.env.BOT_SERVER}/user/${id}`, {
        method: "DELETE",
    });

    const data = await result.text();
    console.log(data);
}
