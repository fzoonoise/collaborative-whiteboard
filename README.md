# Collaborative Whiteboard

A real-time collaborative whiteboard tool built with modern web technologies

## Demo

- Live on Vercel: https://collaborative-whiteboard-phi.vercel.app
  You can sign in using Email or Google. For quicker access, Google login is recommended


## Tech Stack

- Frontend: Next.js + TypeScript + TailwindCSS  
- UI: shadcn/ui  
- Icons: lucide-react (with some custom icons)  
- State Management: zustand  
- Backend: convex  
- Auth: clerk  
- Real-time Collaboration: liveblocks  

## Features

- Register with Google or Email, create organizations, and invite collaborators  
- Search for boards, favorite them, and manage boards (add, delete, rename)
- Real-time collaborative whiteboard to add text, shapes, notes, and drawings  
- Layer ordering, color adjustment, and undo/redo with hotkeys

## Improvements & Custom Features

- Converted all interfaces to `type` and refactored type structures  
- Improved code style and directory structure  
- Fixed version-related package issues  
- Simplified the invitation steps in the dialog triggered by the invite account button
- Updated layer selection tools menu UI:
  - Replaced icons (from other open-source icon sets)
  - Added layer duplication  
  - Enhanced color palette interaction  
- Added brush size adjustment  
- Synced page title with board name  
- Implemented Delete and Backspace hotkeys (with input protection) 
- Replaced heavy SVG assets with optimized PNGs for performance 
- Self-hosted on Vercel for public preview  
- Fixed issue with favorites/search not working after deployment

## Getting Started

### Requirements

- Node.js **v21.7.1**
- npm

### Development

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file and fill it based on `.env.example`

3. Start Convex backend:

   ```bash
   npx convex dev
   ```

4. Start frontend dev server:

   ```bash
   npm run dev
   ```

   Access the app at `http://localhost:3000`

## .env.example

```env
# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# Clerk configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Liveblocks configuration
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=
LIVEBLOCKS_SECRET_KEY=
```

## Disclaimer

This project is for learning purposes, based on a tutorial by [Code with Antonio](https://www.youtube.com/@codewithantonio). The original source code was not publicly provided in the video; this implementation is independently built by following the tutorial content