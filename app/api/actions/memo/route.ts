import { ACTIONS_CORS_HEADERS, ActionGetResponse, ActionPostRequest, ActionPostResponse, MEMO_PROGRAM_ID, createPostResponse } from "@solana/actions"
import { ComputeBudgetProgram, Connection, PublicKey, Transaction, TransactionInstruction, clusterApiUrl } from "@solana/web3.js";

export const GET = (req: Request) => {
  
    const payload : ActionGetResponse = {
        icon: new URL("/HBD-Chris.jpg", new URL(req.url).origin).toString(),
        label: "Check DM Chris",
        description: "Please don't check dm for today!! (haha, just kidding 😂 )",
        title: "Happy Birthday Chris 🎉",
    };

    return Response.json(payload, {
        headers: ACTIONS_CORS_HEADERS
    });
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
    try {

        const body: ActionPostRequest = await req.json();

        let account: PublicKey;
        try {
            account = new PublicKey(body.account);
        } catch (err) {
            return new Response("Invalid account", { 
                status: 400,
                headers: ACTIONS_CORS_HEADERS,
            });
        }
        const transaction = new Transaction()

        transaction.add(
            ComputeBudgetProgram.setComputeUnitPrice({
                microLamports: 1000,
            }),
            new TransactionInstruction({
                programId: new PublicKey(MEMO_PROGRAM_ID),
                data: Buffer.from("Happy Birthday Chris 🎉", "utf-8"),
                keys: []
            }),
        );

        transaction.feePayer = account;

        const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                transaction,
            },
        })
        return Response.json(payload, {headers: ACTIONS_CORS_HEADERS})
    } catch (err) {
        return Response.json("An unknown error occurred", { status: 400 });
    }
};