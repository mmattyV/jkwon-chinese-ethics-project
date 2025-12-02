# Quick Setup Guide

This is a streamlined setup guide to get **PhiloFeed** running quickly.

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Database

### Option A: Local PostgreSQL

If you have PostgreSQL installed locally:

```bash
# Create a new database
createdb philofeed

# Or using psql
psql -U postgres
CREATE DATABASE philofeed;
\q
```

### Option B: Cloud Database (Recommended for beginners)

**Using Neon (Free tier available):**

1. Go to [neon.tech](https://neon.tech)
2. Sign up and create a new project
3. Copy the connection string

**Using Vercel Postgres:**

1. Go to [vercel.com](https://vercel.com)
2. Create a new project or use existing
3. Add Postgres from the Storage tab
4. Copy the connection string

## 3. Configure Environment

Create `.env` file in the root:

```env
# Replace with your actual database URL
DATABASE_URL="postgresql://user:password@localhost:5432/philofeed?schema=public"

# Generate a random secret (use: openssl rand -base64 32)
SESSION_SECRET="your-secret-key-here"
```

## 4. Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init
```

## 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 6. Test the Application

1. **Create an account**: Click "Sign Up" and register
2. **Create a post**: Click "Create Post" and add a post with an optional image
3. **Add comments**: Navigate to a post and add comments
4. **Vote on comments**: Click up/down arrows on comments
5. **Reply to comments**: Click "Reply" to create nested comments

## Common Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# View database with Prisma Studio
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Generate new migration after schema changes
npx prisma migrate dev --name your_migration_name
```

## Troubleshooting

### "Can't reach database server"

- Check if PostgreSQL is running
- Verify DATABASE_URL is correct
- Ensure database exists

### "Environment variable not found"

- Make sure `.env` file exists in root directory
- Restart the dev server after creating/updating `.env`

### "Module not found" errors

```bash
rm -rf node_modules package-lock.json
npm install
npx prisma generate
```

### Images not uploading

- The `/public/uploads` folder will be created automatically
- Make sure you're logged in before uploading
- Check file size is under 5MB

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the code structure
- Customize the styling in `app/globals.css`
- Add new features!

## Need Help?

- Check the [README.md](README.md) for more details
- Review the code comments
- Open an issue on GitHub

---

Happy coding! 🚀

