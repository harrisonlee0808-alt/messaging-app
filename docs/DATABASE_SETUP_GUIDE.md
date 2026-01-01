# Complete Database Setup Guide

## Understanding How Databases Work Locally

### What is PostgreSQL?
PostgreSQL is a **database server** - a program that runs on your computer (or a remote server) and stores data in an organized way. Think of it like a filing cabinet:
- **Database Server** = The filing cabinet itself
- **Database** = A drawer in the cabinet (e.g., `saas_messaging`)
- **Tables** = Folders in the drawer (e.g., `users`, `workspaces`, `messages`)
- **Rows** = Individual files in the folders
- **Columns** = Fields in each file

### How It Works on Your Computer

When you install PostgreSQL locally:
1. **PostgreSQL Server** runs as a background service on your Mac
2. It listens on **port 5432** (the default PostgreSQL port)
3. Your application connects to it using a **connection string** (DATABASE_URL)
4. Prisma (your database toolkit) translates your code into SQL queries
5. PostgreSQL executes those queries and returns results

**Important**: Port 3000 is your **Next.js web server** (the app you're building). Port 5432 is your **PostgreSQL database server**. They are completely different!

---

## Step-by-Step Setup

### Step 1: Install PostgreSQL on macOS

**Option A: Using Homebrew (Recommended)**
```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service (runs in background)
brew services start postgresql@15

# Verify it's running
brew services list | grep postgresql
```

**Option B: Using Postgres.app (Easier GUI)**
1. Download from: https://postgresapp.com/
2. Install and open the app
3. Click "Initialize" to create a new server
4. The app will start PostgreSQL automatically

**Option C: Using Docker**
```bash
docker run --name postgres-saas \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=saas_messaging \
  -p 5432:5432 \
  -d postgres:15
```

### Step 2: Create Your Database

After PostgreSQL is running, create the database:

```bash
# Connect to PostgreSQL (default user is usually your macOS username)
psql postgres

# Or if that doesn't work, try:
psql -U postgres

# Once connected, create the database:
CREATE DATABASE saas_messaging;

# Verify it was created:
\l

# Exit psql:
\q
```

**Alternative: Create database from command line**
```bash
createdb saas_messaging
```

### Step 3: Configure Your Connection String

Create a `.env` file in your project root (if it doesn't exist):

```bash
touch .env
```

Add this to your `.env` file:

```env
# Database Connection String
# Format: postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public
# IMPORTANT: Port is 5432, NOT 3000!

# For default macOS PostgreSQL installation:
DATABASE_URL="postgresql://YOUR_MAC_USERNAME@localhost:5432/saas_messaging?schema=public"

# If you set a password:
DATABASE_URL="postgresql://YOUR_MAC_USERNAME:YOUR_PASSWORD@localhost:5432/saas_messaging?schema=public"

# For Postgres.app (default user is usually your macOS username):
DATABASE_URL="postgresql://localhost:5432/saas_messaging?schema=public"

# For Docker:
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/saas_messaging?schema=public"
```

**To find your macOS username:**
```bash
whoami
```

**Common Issues:**
- ❌ **Wrong**: `postgresql://...@localhost:3000/...` (port 3000 is your web server!)
- ✅ **Correct**: `postgresql://...@localhost:5432/...` (port 5432 is PostgreSQL)

### Step 4: Test Your Connection

```bash
# Test if PostgreSQL is running
psql -l

# Or test connection to your specific database
psql saas_messaging
```

If you get an error, PostgreSQL might not be running. Start it:
```bash
brew services start postgresql@15
# or
brew services restart postgresql@15
```

### Step 5: Run Prisma Migrations

Now that your database exists and is configured:

```bash
# This creates all the tables in your database
npx prisma migrate dev --name init

# This generates the Prisma Client (code to interact with database)
npx prisma generate
```

**What this does:**
- Reads your `prisma/schema.prisma` file
- Creates SQL tables (users, workspaces, messages, etc.)
- Generates TypeScript code to interact with the database

### Step 6: Verify Everything Works

```bash
# Open Prisma Studio (visual database browser)
npx prisma studio
```

This opens at http://localhost:5555 - you can see all your tables and data!

---

## Troubleshooting Common Errors

### Error: "Can't reach database server at `localhost:3000`"

**Problem**: Your DATABASE_URL is pointing to port 3000 (your web server) instead of 5432 (PostgreSQL).

**Solution**: 
1. Check your `.env` file
2. Make sure DATABASE_URL uses port **5432**, not 3000
3. Format: `postgresql://username@localhost:5432/saas_messaging?schema=public`

### Error: "database does not exist"

**Problem**: The database `saas_messaging` hasn't been created yet.

**Solution**:
```bash
createdb saas_messaging
# or
psql postgres -c "CREATE DATABASE saas_messaging;"
```

### Error: "connection refused" or "server is not running"

**Problem**: PostgreSQL service is not running.

**Solution**:
```bash
# Check if it's running
brew services list

# Start it
brew services start postgresql@15

# Or restart it
brew services restart postgresql@15
```

### Error: "password authentication failed"

**Problem**: Wrong username or password in DATABASE_URL.

**Solution**:
1. Try without password first: `postgresql://YOUR_USERNAME@localhost:5432/saas_messaging`
2. Or reset PostgreSQL password (advanced - see PostgreSQL docs)

### Error: "role does not exist"

**Problem**: The username in DATABASE_URL doesn't exist in PostgreSQL.

**Solution**:
```bash
# Connect as superuser
psql postgres

# Create the role (replace YOUR_USERNAME with your macOS username)
CREATE ROLE YOUR_USERNAME WITH LOGIN;

# Give it permissions
ALTER ROLE YOUR_USERNAME CREATEDB;

# Exit
\q
```

---

## Understanding the Connection String

The DATABASE_URL format:
```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public
```

**Example breakdown:**
```
postgresql://harrison@localhost:5432/saas_messaging?schema=public
│          │         │          │    │              │
│          │         │          │    │              └─ Schema name (usually "public")
│          │         │          │    └─ Database name
│          │         │          └─ Port (5432 for PostgreSQL)
│          │         └─ Host (localhost = your computer)
│          └─ Username (your macOS username)
└─ Protocol (postgresql)
```

---

## Quick Reference Commands

```bash
# Start PostgreSQL
brew services start postgresql@15

# Stop PostgreSQL
brew services stop postgresql@15

# Check if running
brew services list | grep postgresql

# Connect to database
psql saas_messaging

# List all databases
psql -l

# Create database
createdb saas_messaging

# Delete database (careful!)
dropdb saas_messaging

# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Open database GUI
npx prisma studio
```

---

## Visual Database Structure

After running migrations, your database will have these tables:

```
saas_messaging (database)
├── users (table)
│   ├── id, email, name, password, ...
│   └── (rows: individual user accounts)
├── workspaces (table)
│   ├── id, name, slug, description, ...
│   └── (rows: individual workspaces)
├── workspace_members (table)
│   ├── id, workspaceId, userId, role, ...
│   └── (rows: which users belong to which workspaces)
├── messages (table)
│   ├── id, workspaceId, userId, content, ...
│   └── (rows: individual chat messages)
├── project_files (table)
│   └── (rows: code files in workspaces)
├── git_commits (table)
│   └── (rows: version control commits)
└── ai_summaries (table)
    └── (rows: AI-generated summaries)
```

---

## Next Steps

Once your database is set up:
1. ✅ Database is running on port 5432
2. ✅ Database `saas_messaging` exists
3. ✅ `.env` file has correct DATABASE_URL (port 5432!)
4. ✅ Migrations have been run
5. ✅ Prisma client is generated

You can now:
- Start your dev server: `npm run dev`
- Sign up for an account
- Create workspaces
- Start using the app!

---

## Need Help?

If you're still stuck:
1. Check that PostgreSQL is running: `brew services list`
2. Verify your DATABASE_URL in `.env` uses port 5432
3. Test connection: `psql saas_messaging`
4. Check Prisma logs: `npx prisma migrate dev --verbose`

