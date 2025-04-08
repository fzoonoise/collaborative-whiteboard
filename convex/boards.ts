import { v } from "convex/values";
// import { getAllOrThrow } from "convex-helpers/server/relationships"; // tutorial code
import { getAll } from "convex-helpers/server/relationships";

import { query } from "./_generated/server";

export const get = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites: v.optional(v.string()),
  },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    if (args.favorites) {
      const favoriteBoards = await context.db
        .query("userFavorites")
        .withIndex("by_user_org", (q) =>
          q.eq("userId", identity.subject).eq("orgId", args.orgId)
        )
        .order("desc")
        .collect();

      const ids = favoriteBoards.map((board) => board.boardId);

      // bug: version issue - When selecting favorite boards, an error occurs: "Could not find id".
      // const boards = await getAllOrThrow(context.db, ids); // tutorial code

      // fix issue:
      // getAllOrThrow throws if any board is missing — use getAll and filter nulls
      const boardDocs = await getAll(context.db, ids);
      const boards = boardDocs.filter((board) => board !== null); 

      return boards.map((board) => ({
        ...board,
        isFavorite: true,
      }));
    }

    const searchQueryTitle = args.search as string;

    let boards = [];

    if (searchQueryTitle) {
      boards = await context.db
        .query("boards")
        .withSearchIndex("search_title", (q) =>
          q.search("title", searchQueryTitle).eq("orgId", args.orgId)
        )
        .collect();
    } else {
      boards = await context.db
        .query("boards")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .order("desc")
        .collect();
    }

    const boardsWithFavoriteRelation = boards.map((board) => {
      return context.db
        .query("userFavorites")
        .withIndex("by_user_board", (q) =>
          q.eq("userId", identity.subject).eq("boardId", board._id)
        )
        .unique()
        .then((favorite) => {
          return {
            ...board,
            isFavorite: !!favorite,
          };
        });
    });

    const boardsWithFavoriteBoolean = Promise.all(boardsWithFavoriteRelation);

    return boardsWithFavoriteBoolean;
  },
});
