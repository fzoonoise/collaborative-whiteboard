import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { devLog } from "@/lib/utils";
import { Id } from "./_generated/dataModel";

const images = Array.from(
  { length: 10 },
  (_, index) => `/placeholders/${index + 1}.svg`
);

export const create = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
  },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const randomImage = images[Math.floor(Math.random() * images.length)];

    const board = await context.db.insert("boards", {
      title: args.title,
      orgId: args.orgId,
      authorId: identity.subject,
      authorName: identity.name!,
      imageUrl: randomImage,
    });

    return board;
  },
});

export const remove = mutation({
  args: { id: v.id("boards") },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    // tutorial code:
    // const userId = identity.subject;
    // const existingFavorite = await context.db
    //   .query("userFavorites")
    //   .withIndex(
    //     "by_user_board",
    //     (
    //       q // q === query
    //     ) => q.eq("userId", userId).eq("boardId", args.id) // eq === equals
    //   )
    //   .unique();

    // if (existingFavorite) await context.db.delete(existingFavorite._id);

    // fix issue:
    // Delete all favorite entries that reference this board (avoid dangling references)
    const relatedFavorites = await context.db
      .query("userFavorites")
      .withIndex("by_board", (q) => q.eq("boardId", args.id))
      .collect();

    for (const fav of relatedFavorites) {
      await context.db.delete(fav._id);
    }

    await context.db.delete(args.id);
  },
});

export const update = mutation({
  args: { id: v.id("boards"), title: v.string() },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const title = args.title.trim();

    if (!title) throw new Error("Title is required.");

    if (title.length > 60)
      throw new Error("Title cannot be longer than 60 characters.");

    const board = await context.db.patch(args.id, {
      title: args.title,
    });

    return board;
  },
});

export const favorite = mutation({
  args: { id: v.id("boards"), orgId: v.string() },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const board = await context.db.get(args.id);

    if (!board) throw new Error("Board not found.");

    const userId = identity.subject;

    const existingFavorite = await context.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", board._id)
      )
      .unique(); // single element

    if (existingFavorite) throw new Error("Board already favorited.");

    await context.db.insert("userFavorites", {
      userId,
      boardId: board._id,
      orgId: args.orgId,
    });

    return board;
  },
});

export const unfavorite = mutation({
  args: { id: v.id("boards") },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const board = await context.db.get(args.id);

    if (!board) throw new Error("Board not found.");

    const userId = identity.subject;

    const existingFavorite = await context.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", board._id)
      )
      .unique();

    if (!existingFavorite) throw new Error("Favorite board not found.");

    await context.db.delete(existingFavorite._id);

    return board;
  },
});

export const get = query({
  args: { id: v.id("boards") },
  handler: async (context, args) => {
    const board = context.db.get(args.id);

    if (!board) throw new Error(`Board with id ${args.id} not found`);

    return board;
  },
});


/**
 * One-time cleanup: delete favorites pointing to non-existent boards.
 *
 * In older tutorial versions, the use of `getAllOrThrow` may result in query errors
 * when any board ID referenced in user favorites no longer exists in the database.
 *
 * If you encounter this issue, you can manually remove invalid favorite records
 * using the `cleanOrphanFavorites` mutation provided below.
 *
 * Steps to run the cleanup function from the Convex Cloud Console:
 * 1. Go to the Convex Cloud Console: https://dashboard.convex.dev/
 * 2. Select your project, then click the “Functions” tab on the left sidebar.
 * 3. Find the function named `cleanup:cleanOrphanFavorites`.
 * 4. Click the ▶ Run button to execute the function.
 * 5. The system will show the result, e.g., `{ deletedCount: 3 }`.
 */
export const cleanOrphanFavorites = mutation({
  args: {},
  handler: async (ctx) => {
    const allFavorites = await ctx.db.query("userFavorites").collect();

    let deletedCount = 0;

    for (const fav of allFavorites) {
      const board = await ctx.db.get(fav.boardId as Id<"boards">);

      if (board === null) {
        await ctx.db.delete(fav._id);
        deletedCount++;
      }
    }

    // Return how many orphan favorites were deleted
    return { deletedCount };
  },
});