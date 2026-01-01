# Quick Reference Guide

## Viewing Your Database

### Option 1: Prisma Studio (Recommended - Visual GUI)
```bash
npx prisma studio
```
- Opens at **http://localhost:5555**
- Visual interface to browse all tables
- View, edit, and delete data
- No SQL knowledge needed!

### Option 2: Command Line (psql)
```bash
# Connect to your database
psql saas_messaging

# Once connected, useful commands:
\l          # List all databases
\dt         # List all tables in current database
\d users    # Describe the 'users' table structure
SELECT * FROM users;  # View all users
\q          # Exit psql
```

### Option 3: Database GUI Tools
- **TablePlus** (macOS): https://tableplus.com/ (Free, beautiful UI)
- **pgAdmin**: https://www.pgadmin.org/ (Official PostgreSQL tool)
- **DBeaver**: https://dbeaver.io/ (Free, cross-platform)

**Connection details for GUI tools:**
- Host: `localhost`
- Port: `5432`
- Database: `saas_messaging`
- Username: Your macOS username (run `whoami` to find it)
- Password: (usually none for local installs)

---

## Exiting Your Program Properly

### Current Method (Ctrl+C)
**Ctrl+C (^C) is actually fine!** It sends a SIGINT signal to gracefully stop the process. However, here are the proper ways:

### Recommended: Ctrl+C
```bash
# In your terminal where npm run dev is running:
^C  (Press Ctrl+C)
```
- This is the standard way to stop Node.js servers
- It allows the server to clean up connections
- Works perfectly for development

### Alternative: Close Terminal Tab
- Simply close the terminal tab/window
- The process will be terminated

### If Process Gets Stuck:
```bash
# Find the process ID
lsof -ti:3000

# Kill it forcefully
kill -9 $(lsof -ti:3000)

# Or use pkill
pkill -f "tsx watch server.ts"
```

### Best Practice:
1. Press **Ctrl+C** once and wait a few seconds
2. If it doesn't stop, press **Ctrl+C** again
3. Only use `kill -9` if absolutely necessary

---

## Common Commands Cheat Sheet

### Development
```bash
# Start development server
npm run dev

# Stop server
^C (Ctrl+C)

# Install dependencies
npm install

# Check for outdated packages
npm outdated
```

### Database
```bash
# View database (GUI)
npx prisma studio

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Reset database (WARNING: deletes all data!)
npx prisma migrate reset

# Connect via command line
psql saas_messaging
```

### PostgreSQL Service
```bash
# Start PostgreSQL
brew services start postgresql@15

# Stop PostgreSQL
brew services stop postgresql@15

# Restart PostgreSQL
brew services restart postgresql@15

# Check if running
brew services list | grep postgresql
```

### Git
```bash
# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Your message"

# Push
git push
```

---

## Troubleshooting Quick Fixes

### Server won't start
```bash
# Check if port 3000 is in use
lsof -ti:3000

# Kill process on port 3000
kill -9 $(lsof -ti:3000)

# Try again
npm run dev
```

### Database connection error
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start PostgreSQL
brew services start postgresql@15

# Verify DATABASE_URL in .env uses port 5432
cat .env | grep DATABASE_URL
```

### Prisma errors
```bash
# Regenerate Prisma client
npx prisma generate

# Reset and re-migrate (WARNING: deletes data)
npx prisma migrate reset
```

### Module not found
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Environment Variables

Your `.env` file should contain:
```env
DATABASE_URL="postgresql://username@localhost:5432/saas_messaging?schema=public"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"
NEXT_PUBLIC_WS_URL="ws://localhost:3000"
OPENAI_API_KEY="your-key-here"  # Optional
```

**Never commit `.env` to git!** It's already in `.gitignore`.

---

## Port Reference

| Service | Port | Purpose |
|---------|------|---------|
| Next.js App | 3000 | Your web application |
| PostgreSQL | 5432 | Database server |
| Prisma Studio | 5555 | Database GUI |

---

## Next Steps After Setup

1. ✅ Database is running
2. ✅ Migrations applied
3. ✅ Server starts successfully
4. ✅ Can sign up/sign in
5. **Create your first workspace**
6. **Invite team members**
7. **Start coding and collaborating!**

See `docs/NEXT_STEPS.md` for detailed next steps.

