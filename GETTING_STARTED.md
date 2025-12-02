# 🚀 Getting Started

Welcome! Your Reddit Clone is ready to run. Follow these steps to get started.

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database

**Option A: Use a Free Cloud Database (Easiest)**

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string

**Option B: Use Local PostgreSQL**

```bash
# If you have PostgreSQL installed
createdb reddit_clone
```

### 3. Create Environment File

Create a file named `.env` in the root folder:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/reddit_clone?schema=public"
SESSION_SECRET="change-this-to-a-random-string"
```

Replace the `DATABASE_URL` with your actual database connection string.

### 4. Initialize Database

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Start the App

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## What You Can Do

### ✅ User Authentication
- Sign up with email and password
- Log in and log out
- Secure session management

### ✅ Create Posts
- Write posts with titles and content
- **Upload images** (PNG, JPG, GIF, WebP up to 5MB)
- View all your posts

### ✅ Main Feed with Pagination
- Browse all posts sorted by newest
- Navigate through pages
- See post previews with images

### ✅ Comments System
- Add comments to posts
- Reply to comments (nested/threaded)
- View comment threads

### ✅ Vote on Comments
- Upvote comments (👍)
- Downvote comments (👎)
- See vote scores
- Toggle votes on/off

## Project Structure

```
your-project/
├── app/                    # Pages and API routes
│   ├── api/               # Backend API
│   │   ├── auth/         # Login, signup, logout
│   │   ├── posts/        # Post CRUD + image upload
│   │   └── comments/     # Comments + voting
│   ├── auth/             # Auth pages
│   ├── posts/            # Post pages
│   └── page.tsx          # Home feed
├── components/           # Reusable UI components
├── lib/                  # Utilities (auth, db, upload)
├── prisma/              # Database schema
└── public/uploads/      # Uploaded images (auto-created)
```

## Key Features Implementation

### 🖼️ Image Uploads
- Handled in `lib/upload.ts`
- Stored in `public/uploads/`
- 5MB size limit
- Automatic file validation

### 📄 Pagination
- Implemented in home page (`app/page.tsx`)
- 10 posts per page by default
- Page navigation component

### 💬 Threaded Comments
- Unlimited nesting depth (UI limits to 6 levels)
- Real-time vote updates
- Reply functionality

### 🔐 Authentication
- Secure password hashing with bcrypt
- Session-based auth with HTTP-only cookies
- 30-day session duration

## Common Tasks

### View Database
```bash
npx prisma studio
```
Opens a GUI to view/edit your database at [http://localhost:5555](http://localhost:5555)

### Reset Database
```bash
npx prisma migrate reset
```
⚠️ Warning: This deletes all data!

### Add Test Data

You can use Prisma Studio or create a seed file:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  // Create test user
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      passwordHash: await hashPassword('password123'),
    },
  })

  // Create test post
  await prisma.post.create({
    data: {
      title: 'Welcome to Reddit Clone!',
      content: 'This is a test post. Feel free to comment!',
      authorId: user.id,
    },
  })
}

main()
  .then(() => console.log('Seeded!'))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())
```

Run with:
```bash
npx tsx prisma/seed.ts
```

## Testing the App

### Test Workflow

1. **Sign Up**
   - Go to http://localhost:3000
   - Click "Sign Up"
   - Create an account

2. **Create a Post**
   - Click "Create Post"
   - Add title and content
   - Upload an image (optional)
   - Submit

3. **Add Comments**
   - Click on your post
   - Add a comment
   - Reply to your comment

4. **Test Voting**
   - Upvote your comment
   - Downvote it
   - Click again to remove vote

5. **Test Pagination**
   - Create 10+ posts
   - Go to home page
   - Navigate between pages

## Customization

### Change Colors

Edit `app/globals.css`:
```css
/* Change primary color from orange to blue */
.btn-primary {
  @apply btn bg-blue-500 text-white hover:bg-blue-600;
}
```

### Change Pagination Size

Edit `app/page.tsx`:
```typescript
const limit = 20  // Change from 10 to 20 posts per page
```

### Modify Session Duration

Edit `lib/auth.ts`:
```typescript
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000  // Change to 7 days
```

## Troubleshooting

### "Can't reach database server"
- ✅ Check if PostgreSQL is running
- ✅ Verify `DATABASE_URL` in `.env`
- ✅ Run `npx prisma generate`

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Prisma Client not generated"
```bash
npx prisma generate
```

### Port 3000 already in use
```bash
# Use a different port
PORT=3001 npm run dev
```

## Next Steps

- 📖 Read the full [README.md](README.md)
- 🚀 Check [DEPLOYMENT.md](DEPLOYMENT.md) for deploying to production
- 🔧 See [SETUP.md](SETUP.md) for detailed setup options
- 💡 Explore the code and add features!

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Auth**: Custom session-based

## Need Help?

- Check the documentation files
- Review code comments
- Open an issue on GitHub
- Read Next.js and Prisma docs

## What's Included vs Design Doc

### ✅ Included (from design doc)
- User authentication (email + password)
- Create, view, and list posts
- Comments with threaded replies
- Comment voting (like/dislike)
- Session management
- Pagination on main feed

### ✨ Bonus Features (you requested)
- **Image uploads** for posts
- **Pagination** on the main page
- Modern UI with Tailwind CSS
- Image preview during upload
- Responsive design
- 404 page

### 🎯 Not Included (as per design doc)
- Subreddits/communities
- Post voting
- Search functionality
- Password reset
- Social login

These can be added later!

---

**Ready to start?** Run `npm run dev` and visit http://localhost:3000

Happy coding! 🎉

