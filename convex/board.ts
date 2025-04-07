import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { devLog } from "@/lib/utils";

const images = Array.from(
  { length: 10 },
  (_, index) => `/placeholders/${index}.svg`
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

    devLog("board",board)

    return board;
  },
});

export const remove = mutation({
  args: { id: v.id("boards") },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const userId = identity.subject;

    const existingFavorite = await context.db
      .query("userFavorites")
      .withIndex(
        "by_user_board",
        (
          q // q === query
        ) => q.eq("userId", userId).eq("boardId", args.id) // eq === equals
      )
      .unique();

    if (existingFavorite) await context.db.delete(existingFavorite._id);

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