# Application Overview

## What is This App?

This is a **Collaborative Messaging SaaS Platform** - a unique web application that combines real-time chat messaging with an integrated collaborative coding workspace. Think of it as a combination of Slack + VS Code + GitHub, all in one unified interface.

## Core Concept

The app features a **split-screen interface**:
- **Left Side**: Real-time messaging/chat
- **Right Side**: Collaborative code editor with file management

## Key Features Implemented

### 1. Split-Screen Workspace Interface
- **Resizable panels**: Drag the divider to adjust chat/editor proportions
- **Persistent layout**: Your preferred split width is saved in localStorage
- **Location**: `app/(dashboard)/workspace/[id]/page.tsx`

### 2. Real-Time Messaging System
- **Live chat**: Send and receive messages instantly via WebSocket (Socket.io)
- **Typing indicators**: See when others are typing
- **Message history**: View past conversations
- **AI summaries**: Generate summaries of long conversation threads
- **Location**: `components/chat/ChatPanel.tsx`

### 3. Collaborative Code Editor
- **Monaco Editor**: The same editor that powers VS Code
- **Real-time collaboration**: Multiple users can edit simultaneously
- **Yjs CRDT**: Conflict-free merging - no merge conflicts!
- **Syntax highlighting**: Support for multiple programming languages
- **Location**: `components/workspace/EditorPanel.tsx`

### 4. File Management
- **File tree navigator**: Browse and organize files
- **Multi-file editing**: Open and edit multiple files
- **Real-time sync**: File changes sync instantly to all collaborators
- **Location**: `components/workspace/FileTree.tsx`

### 5. Collaboration Features
- **User presence**: See who's online and actively editing
- **Shared cursors**: View other users' cursor positions (awareness API)
- **Color-coded users**: Each collaborator has a unique color
- **Location**: `components/workspace/CollaborationFeatures.tsx`

### 6. Git Integration
- **Automatic version control**: Changes are tracked with Git
- **AI-generated commit messages**: Let AI create meaningful commit messages
- **Branch management**: Create and switch branches
- **Commit history**: View past changes
- **Location**: `lib/git/git-service.ts`

### 7. AI-Powered Features
- **Conversation summaries**: Get AI summaries of long chat threads
- **Commit message generation**: Automatically generate commit messages from code changes
- **Code explanations**: Ask AI to explain code
- **Code suggestions**: Get AI-powered code improvements
- **Task extraction**: Extract TODO items from conversations
- **Location**: `lib/ai/ai-service.ts`

### 8. Authentication System
- **NextAuth.js**: Secure authentication
- **Email/password login**: Traditional authentication
- **Session management**: Persistent user sessions
- **Workspace membership**: Users belong to multiple workspaces
- **Location**: `lib/auth.ts`, `app/api/auth/[...nextauth]/route.ts`

### 9. Library Documentation
- **In-app docs**: Learn about all the libraries used
- **Interactive component**: Expandable cards with detailed explanations
- **Covers**: Yjs, Monaco, Socket.io, isomorphic-git, Prisma, NextAuth, OpenAI
- **Location**: `components/docs/LibraryExplainer.tsx`

### 10. Onboarding Tour
- **First-time user experience**: Interactive tour of features
- **Step-by-step guide**: Learn the app's capabilities
- **Skip option**: Can be skipped or re-accessed
- **Location**: `components/onboarding/OnboardingTour.tsx`

## What You'll See on the Website

### Main Routes

1. **Home Page** (`/`)
   - Currently shows the default Next.js welcome page
   - **TODO**: Should redirect to login or show app landing page

2. **Workspace Page** (`/workspace/[id]`)
   - **This is where your app lives!**
   - Split-screen interface with:
     - Chat panel on the left
     - Code editor on the right
   - Accessible once you have a workspace ID

3. **Authentication Routes** (via NextAuth)
   - `/api/auth/signin` - Sign in page
   - `/api/auth/callback` - OAuth callback
   - Protected by NextAuth middleware

### API Routes

- `/api/auth/[...nextauth]` - Authentication endpoints
- `/api/socket` - WebSocket server for real-time messaging
- `/api/workspaces/[id]/messages` - Get workspace messages
- `/api/workspaces/[id]/git/commit` - Git commit operations
- `/api/ai/summarize` - AI conversation summaries
- `/api/ai/commit-message` - AI commit message generation

## Current Application Flow

### When You First Visit

1. **Landing** → Default Next.js page (needs to be updated)
2. **Authentication** → Sign in/sign up (NextAuth)
3. **Workspace Selection** → Choose or create a workspace (needs to be built)
4. **Main App** → Split-screen workspace view

### In the Workspace

**Left Panel (Chat):**
- View messages in real-time
- Type and send messages
- See typing indicators
- Use AI summary button
- See message timestamps and user avatars

**Right Panel (Editor):**
- File tree on the left side of the panel
- Code editor on the right side of the panel
- Collaboration features at the top (user presence)
- Git branch indicator
- Save button (placeholder)

**Interaction:**
- All changes sync in real-time via Yjs
- Messages sent via Socket.io
- Git commits can be created automatically or manually
- AI features accessible via buttons/API calls

## What Makes This App Unique

1. **Unified Interface**: Chat and code editing in one view - no context switching
2. **Zero-Conflict Collaboration**: Yjs CRDTs ensure edits merge perfectly
3. **AI Integration**: Reduces manual work with smart summaries and commit messages
4. **Automatic Git**: Changes are automatically organized with version control
5. **Real-Time Everything**: Messages, code edits, presence - all instant

## Technology Stack Summary

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Real-Time Chat**: Socket.io
- **Real-Time Editing**: Yjs (CRDT) + Monaco Editor
- **Authentication**: NextAuth.js (Auth.js)
- **AI**: OpenAI API
- **Git**: isomorphic-git (pure JavaScript)
- **Server**: Custom Node.js server (server.ts) for Socket.io

## What's Still Needed (Future Work)

1. **Landing/Home Page**: Replace default Next.js page
2. **Workspace Creation UI**: Form to create new workspaces
3. **Workspace List**: Dashboard showing all user workspaces
4. **User Profile Pages**: View and edit user settings
5. **File Upload**: Support for uploading files/images
6. **Threading UI**: Better visual representation of message threads
7. **Git UI**: Visual diff viewer, branch switcher UI
8. **AI Chat Assistant**: Sidebar chat for code help
9. **Settings Page**: Configure workspace, git, AI preferences
10. **Mobile Responsive**: Collapsible panels for mobile devices

## How to Test the App

Once set up:

1. **Create a user account** (sign up)
2. **Create a workspace** (currently need to do this via database or build UI)
3. **Navigate to** `/workspace/[workspace-id]`
4. **Open in multiple browser tabs/windows** to see real-time collaboration
5. **Type in chat** - see messages appear in all tabs
6. **Edit code** - see changes sync in real-time
7. **Check collaboration features** - see user presence indicators

The app is functional but needs the workspace management UI to be fully user-friendly!

