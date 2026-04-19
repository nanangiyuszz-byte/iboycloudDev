import { createServerFn } from "@tanstack/react-start";
import Ably from "ably";

export const getAblyTokenRequest = createServerFn({ method: "GET" })
  .inputValidator((data: { name: string }) => ({
    name: (data?.name ?? "guest").toString().trim().slice(0, 40),
  }))
  .handler(async ({ data }) => {
    const apiKey = process.env.ABLY_API_KEY;
    if (!apiKey) {
      throw new Error("ABLY_API_KEY is not configured");
    }

    const safeName =
      data.name.replace(/[^a-zA-Z0-9 _-]/g, "").slice(0, 40) || "guest";

    const client = new Ably.Rest(apiKey);
    const tokenRequest = await client.auth.createTokenRequest({
      clientId: safeName,
      capability: {
        "iboycloud-public-chat": ["subscribe", "publish", "presence", "history"],
      },
      ttl: 60 * 60 * 1000,
    });

    return tokenRequest;
  });
