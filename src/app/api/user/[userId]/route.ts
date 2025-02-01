import { wallets } from "@/app/utils";

type Params = {
    params: Promise<{ userId: string }>;
};

export async function GET(request: Request, params: Params) {
    const { userId } = await params.params;
    const wallet = wallets.get(userId);

    if (!wallet) {
        return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ userId });
}
