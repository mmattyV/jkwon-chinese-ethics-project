# PhiloFeed

A thoughtful community platform for sharing ideas and philosophical discussions. Built with Next.js, TypeScript, Prisma, and PostgreSQL. Features include user authentication, post creation with image uploads, threaded comments, and comment voting.

## Features

- 🔐 **Authentication**: Email/password signup and login with secure session management
- 📝 **Posts**: Create, view posts with optional image or video uploads
- 🔼 **Post Voting**: Like/dislike posts with vote score tracking
- 💬 **Comments**: Threaded comment system with nested replies
- 👍 **Comment Voting**: Like/dislike comments with score tracking
- 🎥 **Video Support**: Upload and share video content (MP4, WebM, OGG, MOV)
- 📄 **Pagination**: Efficient pagination on the main feed
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS in cerulean and white

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Authentication**: Custom session-based auth with bcrypt

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or hosted)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd philofeed
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/philofeed?schema=public"
SESSION_SECRET="your-secret-key-change-this-in-production"
```

Replace the `DATABASE_URL` with your PostgreSQL connection string.

4. **Set up the database**

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── posts/           # Post endpoints
│   │   └── comments/        # Comment endpoints
│   ├── auth/                # Auth pages (login, signup)
│   ├── posts/               # Post pages
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page (feed)
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── Header.tsx           # App header
│   ├── PostCard.tsx         # Post preview card
│   ├── PostForm.tsx         # Create post form
│   ├── CommentSection.tsx   # Comment section wrapper
│   ├── CommentThread.tsx    # Comment tree builder
│   ├── CommentItem.tsx      # Individual comment
│   └── ...
├── lib/                     # Utility libraries
│   ├── db.ts               # Prisma client
│   ├── auth.ts             # Auth utilities
│   ├── upload.ts           # File upload handling
│   └── utils.ts            # Helper functions
├── prisma/
│   └── schema.prisma       # Database schema
├── public/
│   └── uploads/            # Uploaded images
└── package.json
```

## Database Schema

### User
- id, email, passwordHash, createdAt
- Relations: posts, comments, commentVotes, postVotes, sessions

### Session
- id, userId, token, expiresAt, createdAt

### Post
- id, title, content, imageUrl (optional), videoUrl (optional), authorId, createdAt
- Relations: author, comments, votes

### Comment
- id, postId, authorId, content, parentCommentId (nullable), createdAt
- Relations: post, author, parentComment, replies, votes

### CommentVote
- id, commentId, userId, value (1 or -1)
- Unique constraint on (commentId, userId)

### PostVote
- id, postId, userId, value (1 or -1)
- Unique constraint on (postId, userId)

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Log in
- `POST /api/auth/logout` - Log out
- `GET /api/auth/me` - Get current user

### Posts

- `GET /api/posts?page=1&limit=10` - Get posts (paginated)
- `POST /api/posts` - Create post (requires auth, supports FormData with image or video)
- `GET /api/posts/[id]` - Get single post
- `GET /api/posts/[id]/comments` - Get post comments
- `POST /api/posts/[id]/vote` - Vote on post (requires auth)

### Comments

- `POST /api/comments` - Create comment (requires auth)
- `POST /api/comments/[id]/vote` - Vote on comment (requires auth)

## Usage Guide

### Creating an Account

1. Click "Sign Up" in the header
2. Enter your email and password (min 6 characters)
3. Click "Sign Up" - you'll be automatically logged in

### Creating a Post

1. Log in and click "Create Post"
2. Enter a title and content
3. Optionally upload media:
   - **Image**: PNG, JPG, GIF, WebP up to 5MB
   - **Video**: MP4, WebM, OGG, MOV up to 50MB
   - (Choose one: either image or video, not both)
4. Click "Create Post"

### Voting on Posts

1. Find a post on the home feed or detail page
2. Click the up arrow to upvote (like)
3. Click the down arrow to downvote (dislike)
4. Click again to remove your vote
5. See the vote score between the arrows

### Commenting

1. Navigate to a post detail page
2. Type your comment in the text box
3. Click "Comment"
4. To reply to a comment, click "Reply" under that comment

### Voting on Comments

1. Click the up arrow to like (upvote) a comment
2. Click the down arrow to dislike (downvote) a comment
3. Click again to remove your vote

## Deployment

### Vercel (Recommended)

1. **Push your code to GitHub**

2. **Import project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository

3. **Set up environment variables in Vercel**
   - `DATABASE_URL`: Your production PostgreSQL URL (use Vercel Postgres or Neon)
   - `SESSION_SECRET`: A secure random string

4. **Set up database**
   ```bash
   # Run migrations on production database
   npx prisma migrate deploy
   ```

5. **Deploy!**

### Database Options

- **Vercel Postgres**: Integrated PostgreSQL from Vercel
- **Neon**: Serverless PostgreSQL
- **Supabase**: PostgreSQL with additional features
- **Railway**: PostgreSQL hosting

## Development

### Running Prisma Studio

View and edit your database:

```bash
npx prisma studio
```

### Creating Database Migrations

After modifying the Prisma schema:

```bash
npx prisma migrate dev --name your_migration_name
```

### Linting

```bash
npm run lint
```

## Features Roadmap

Potential future enhancements:

- [ ] Post voting (upvote/downvote posts)
- [ ] User profiles
- [ ] Subreddits/communities
- [ ] Search functionality
- [ ] Sort options (hot, top, new)
- [ ] Image optimization
- [ ] Email verification
- [ ] Password reset
- [ ] Social login (Google, GitHub)
- [ ] Markdown support for posts/comments
- [ ] Edit/delete posts and comments
- [ ] Report/moderation system

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. Verify your `DATABASE_URL` in `.env` is correct
2. Ensure PostgreSQL is running
3. Try regenerating Prisma Client: `npx prisma generate`
4. Check if migrations are applied: `npx prisma migrate status`

### Image Upload Issues

If images aren't uploading:

1. Check that the `/public/uploads` directory exists
2. Verify file size is under 5MB
3. Ensure file type is supported (JPEG, PNG, GIF, WebP)

### Build Errors

If you encounter build errors:

```bash
# Clean Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma Client
npx prisma generate

# Try building again
npm run build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

See the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please file an issue on GitHub.

---

**PhiloFeed** - Where ideas flourish 🌊

Built with ❤️ using Next.js and Prisma
