# Documentation Index

Welcome to the documentation for the Collaborative Messaging SaaS Platform!

## Getting Started

1. **[Setup Guide](SETUP.md)** - Start here! Step-by-step instructions to get your development environment running.

2. **[Database Setup Guide](DATABASE_SETUP_GUIDE.md)** - Complete guide to setting up PostgreSQL, understanding how databases work locally, and troubleshooting connection issues.

## Daily Reference

3. **[Quick Reference](QUICK_REFERENCE.md)** - Common commands, how to view your database, exit your program properly, and quick troubleshooting tips.

4. **[Next Steps](NEXT_STEPS.md)** - What to do after initial setup. Learn about workspaces, features, and development workflow.

## Planning & Architecture

5. **[Future Steps](FUTURE_STEPS.md)** - Roadmap of planned features, technical debt, and improvement ideas.

6. **[App Overview](APP_OVERVIEW.md)** - Technical architecture, component structure, and how the app works under the hood.

---

## Quick Links

- **Having database issues?** → [Database Setup Guide](DATABASE_SETUP_GUIDE.md)
- **Need a command?** → [Quick Reference](QUICK_REFERENCE.md)
- **What's next?** → [Next Steps](NEXT_STEPS.md)
- **Setting up for first time?** → [Setup Guide](SETUP.md)

---

## About the Database

**Is the database always supposed to run?**

For **development**, you have two options:

1. **Run as a service (recommended)**: PostgreSQL runs in the background automatically
   ```bash
   brew services start postgresql@15
   ```
   - Starts automatically when you boot your computer
   - Runs continuously in the background
   - No need to manually start/stop it

2. **Run manually**: Start it only when needed
   ```bash
   brew services start postgresql@15  # Start
   brew services stop postgresql@15   # Stop
   ```

**For production**, the database should always be running (usually managed by your hosting provider).

**Best practice**: Keep it running as a service during development. It uses minimal resources and makes development smoother.

