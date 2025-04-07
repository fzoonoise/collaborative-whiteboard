import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  // Define table
  boards: defineTable({
    title: v.string(),
    orgId: v.string(),
    authorId: v.string(),
    authorName: v.string(), 
    imageUrl: v.string(),
  })
    // Index for querying all boards by organization
    // Equivalent to SQL: CREATE INDEX by_org ON boards(orgId)
    .index("by_org", ["orgId"])
    // Full-text search index on the board title
    // Enables search("term") with optional filtering by orgId
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["orgId"],
    }),
  // Define table
  userFavorites: defineTable({
    orgId: v.string(),
    userId: v.string(),
    boardId: v.id("boards"),
  })
    // Index to quickly find all favorites for a board
    // Equivalent to SQL: CREATE INDEX by_board ON userFavorites(boardId)
    .index("by_board", ["boardId"])
    // Index to find all favorites for a user within an org
    .index("by_user_org", ["userId", "orgId"])
    // Index for checking if a user has favorited a specific board
    .index("by_user_board", ["userId", "boardId"])
    // Composite index combining user, board, and org
    // Useful for filtered queries that check ownership + context
    .index("by_user_board_org", ["userId", "boardId", "orgId"]),
});
