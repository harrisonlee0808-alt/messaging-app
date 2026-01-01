# Collaborative Messaging SaaS Platform

A unique SaaS messaging platform that combines real-time chat with an integrated collaborative workspace, featuring AI-powered assistance and automatic git integration.

## Features

- **Split-Screen Interface**: Messaging on the left, collaborative code editor on the right
- **Real-Time Collaboration**: Multiple users can edit code simultaneously with conflict-free merging
- **AI-Powered Features**: Conversation summaries, smart commit messages, code assistance
- **Git Integration**: Automatic version control with AI-generated commit messages
- **User Presence**: See who's online and collaborating in real-time

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **UI**: Tailwind CSS, shadcn/ui components
- **Real-Time**: Socket.io for messaging, Yjs for collaborative editing
- **Editor**: Monaco Editor (VS Code's editor)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Auth.js)
- **AI**: OpenAI API
- **Git**: isomorphic-git

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OpenAI API key (optional, for AI features)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/saas_messaging"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="your-openai-api-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Documentation

All documentation is in the `/docs` folder:

- **[Setup Guide](docs/SETUP.md)** - Initial setup instructions
- **[Database Setup Guide](docs/DATABASE_SETUP_GUIDE.md)** - Complete database setup and explanation
- **[Quick Reference](docs/QUICK_REFERENCE.md)** - Common commands and quick answers
- **[Next Steps](docs/NEXT_STEPS.md)** - What to do after setup
- **[Future Steps](docs/FUTURE_STEPS.md)** - Roadmap and planned features
- **[App Overview](docs/APP_OVERVIEW.md)** - Architecture and technical details

## Project Structure

```
/app
  /api              # API routes
  /(dashboard)      # Dashboard pages
    /workspace      # Workspace pages
/components
  /chat             # Chat components
  /workspace        # Workspace/editor components
  /docs             # Documentation components
  /onboarding       # Onboarding tour
/lib
  /ai               # AI service
  /git              # Git operations
  /yjs              # Yjs collaboration setup
/prisma
  schema.prisma     # Database schema
```

## Key Components

- **SplitLayout**: Resizable split-screen layout
- **ChatPanel**: Real-time messaging interface
- **EditorPanel**: Collaborative code editor with Monaco
- **FileTree**: File navigation and management
- **CollaborationFeatures**: User presence and shared cursors
- **LibraryExplainer**: In-app documentation
- **OnboardingTour**: First-time user experience

## Development Notes

- Socket.io server runs in `server.ts` (custom Next.js server)
- Yjs documents are synced via WebSocket (y-websocket)
- Git operations use isomorphic-git (pure JavaScript)
- AI features require OpenAI API key
- Database migrations: `npx prisma migrate dev`

## License

MIT
