"use server";

export async function updateWallet(
    id: string,
    address: string,
    signature: string
) {
    const result = await fetch(`${process.env.BOT_SERVER}/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, address, signature }),
    });

    const data = await result.text();
    console.log(data);
}
