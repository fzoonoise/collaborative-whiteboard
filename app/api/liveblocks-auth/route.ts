import { ConvexHttpClient } from "convex/browser";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { api } from "@/convex/_generated/api";
// import { devLog } from "@/lib/utils";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// init
const liveblocks = new Liveblocks({
  secret: process.env.NEXT_PUBLIC_LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  const authorization = await auth();
  const user = await currentUser();

//   devLog("AUTH_INFO - 1", { authorization, user });

  if (!authorization || !user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { room } = await request.json();
  const board = await convex.query(api.board.getBoardById, { id: room });

//   devLog("AUTH_INFO - 2", {
//     room,
//     board,
//     boardOrgId: board?.orgId,
//     userOrgId: authorization.orgId,
//   });

  // Allow access if the board?.orgId belongs to the same organization.orgId
  if (board?.orgId !== authorization.orgId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userInfo = {
    name: user.firstName || "Anonymous",
    picture: user.imageUrl!,
  };

//   devLog("AUTH_INFO - 3 userInfo", {
//     userInfo,
//   });

  const session = liveblocks.prepareSession(user.id, {
    userInfo,
  });

  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }

  const { status, body } = await session.authorize();

//   devLog("AUTH_INFO - 4 Allowed", {
//     status,
//     body,
//   });

  return new Response(body, { status });
}
