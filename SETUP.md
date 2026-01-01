# Setup Guide

## Step-by-Step Setup Instructions

### 1. Install Dependencies
If you haven't already, install all npm packages:
```bash
npm install
```

### 2. Set Up PostgreSQL Database

You need a PostgreSQL database running. You can:

**Option A: Install PostgreSQL locally**
- macOS: `brew install postgresql@15` then `brew services start postgresql@15`
- Or download from https://www.postgresql.org/download/

**Option B: Use a cloud database (recommended for quick start)**
- Use services like Supabase (free tier), Neon, or Railway
- They provide connection strings you can use directly

### 3. Configure Environment Variables

Create a `.env` file in the root directory (if it doesn't exist) with:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/saas_messaging?schema=public"

# NextAuth.js
NEXTAUTH_SECRET="your-random-secret-key-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI (optional - for AI features)
OPENAI_API_KEY="sk-your-openai-api-key-here"

# Socket.io
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"
NEXT_PUBLIC_WS_URL="ws://localhost:3000"
```

**To generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Run Database Migrations

Create the database tables:
```bash
npx prisma migrate dev --name init
```

This will:
- Create all database tables (Users, Workspaces, Messages, etc.)
- Generate the Prisma Client
- Set up the database schema

### 5. (Optional) Generate Prisma Client

If the client wasn't generated automatically:
```bash
npx prisma generate
```

### 6. Start the Development Server

Run the app:
```bash
npm run dev
```

The app will be available at **http://localhost:3000**

### 7. (Optional) Open Prisma Studio

To view/edit your database in a GUI:
```bash
npx prisma studio
```

This opens at http://localhost:5555

---

## Troubleshooting

**Database connection errors:**
- Make sure PostgreSQL is running
- Check your DATABASE_URL is correct
- Verify the database name exists: `createdb saas_messaging` (if needed)

**Port already in use:**
- Change the port in `server.ts` or use: `PORT=3001 npm run dev`

**Prisma client errors:**
- Run `npx prisma generate` again
- Make sure you're using Prisma 6 (not 7)

**Module not found errors:**
- Delete `node_modules` and run `npm install` again
- Run `npx prisma generate`

---

## Next Steps After Setup

1. Create a user account (sign up page)
2. Create a workspace
3. Start collaborating!

