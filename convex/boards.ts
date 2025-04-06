import { v } from "convex/values";
// import { getAllOrThrow } from "convex-helpers/server/relationships";

import { query } from "./_generated/server";

export const get = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized.");

    const boards = await ctx.db
    .query("boards")
    .withIndex("by_org", (q) =>
      q.eq("orgId", args.orgId)
    )
    .collect();

    return boards

  },
});
