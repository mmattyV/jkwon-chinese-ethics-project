# Database Migration Guide

## New Features Added 🎉

I've added two major features to PhiloFeed:

1. **Post Voting** - Like/dislike posts (similar to comment voting)
2. **Video Uploads** - Upload videos in addition to images

## 📋 Required: Update Your Database

Since we've modified the database schema, you **must** run a migration.

### Step 1: Generate and Apply Migration

```bash
# Generate Prisma Client with new schema
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name add_post_voting_and_video_support
```

### Step 2: Verify Migration

```bash
# Open Prisma Studio to see the new tables/fields
npx prisma studio
```

You should see:
- ✅ New `PostVote` table
- ✅ New `videoUrl` field in `Post` table
- ✅ New `postVotes` relation in `User` table

## What Changed in the Database?

### New Table: PostVote

```prisma
model PostVote {
  id        String   @id @default(cuid())
  postId    String
  userId    String
  value     Int      // 1 for like, -1 for dislike
  createdAt DateTime @default(now())
  
  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([postId, userId])
  @@index([postId])
}
```

### Updated Post Model

```prisma
model Post {
  // ... existing fields
  videoUrl  String?  // NEW: Optional video URL
  
  // ... existing relations
  votes    PostVote[]  // NEW: Post votes relation
}
```

### Updated User Model

```prisma
model User {
  // ... existing fields
  postVotes    PostVote[]  // NEW: User's post votes
}
```

## 🎥 Video Upload Limits

- **Max video size**: 50MB
- **Supported formats**: MP4, WebM, OGG, MOV (QuickTime)
- **Note**: You can upload either an image OR a video per post, not both

## 🔼 Post Voting Features

### How it Works

- Users can upvote (like) or downvote (dislike) posts
- Click the same vote button again to remove your vote
- Vote score is displayed between the up/down arrows
- Must be logged in to vote (redirects to login if not)

### Where You'll See It

- **Home feed**: Vote buttons on the left side of each post card
- **Post detail page**: Vote buttons on the left side of the post content
- Vertical layout with up arrow, score, down arrow

## 🎨 UI Updates

### Post Cards (Home Feed)

- Added vertical vote buttons on the left
- Video posts show a play icon thumbnail
- Hover effects remain on clickable areas

### Post Detail Page

- Vote buttons integrated into the layout
- Videos display with native HTML5 video player
- Full controls (play, pause, seek, volume, fullscreen)

### Create Post Form

- New side-by-side media upload options:
  - **Image** (left) - up to 5MB
  - **Video** (right) - up to 50MB
- Preview shows before uploading
- Remove button to change media choice

## 📁 File Storage

Videos are stored the same way as images:
- Location: `/public/uploads/`
- Naming: `timestamp-random.ext`
- **Important**: For production, consider using cloud storage (see DEPLOYMENT.md)

## 🧪 Testing the New Features

### Test Post Voting

1. Start your dev server: `npm run dev`
2. Create a post
3. Try upvoting it (up arrow should turn blue)
4. Try downvoting it (changes to downvote)
5. Click again to remove vote
6. Try without logging in (should redirect to login)

### Test Video Upload

1. Go to "Create Post"
2. Click the "Video" upload area
3. Select a video file (MP4 recommended)
4. See video preview with controls
5. Submit the post
6. View the post detail page
7. Video should play with full controls

## 🔧 API Changes

### New Endpoint

```
POST /api/posts/[id]/vote
Body: { value: 1 | -1 }
Returns: { score: number, votes: PostVote[] }
```

### Updated Endpoints

All post retrieval endpoints now include `votes`:

```typescript
// GET /api/posts
// GET /api/posts/[id]
// Returns:
{
  post: {
    // ... existing fields
    videoUrl: string | null,
    votes: PostVote[]
  }
}
```

## 🚨 Troubleshooting

### "Column does not exist" Error

You forgot to run the migration:
```bash
npx prisma migrate dev --name add_post_voting_and_video_support
```

### "Prisma Client validation failed"

Regenerate the Prisma Client:
```bash
npx prisma generate
npm run dev  # Restart dev server
```

### Videos Not Playing

- Check file format (MP4 is most compatible)
- Check file size (must be under 50MB)
- Check browser console for errors

### Large Video File Upload Fails

Next.js has a default body size limit. If you need larger videos, add to `next.config.js`:

```javascript
const nextConfig = {
  // ... existing config
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
}
```

## 📊 Database Stats

After migration, you can check:

```bash
# Open Prisma Studio
npx prisma studio

# Check PostVote table
# Check Post table for videoUrl column
```

## 🎯 Next Steps

After migrating:

1. ✅ Test post voting
2. ✅ Test video uploads
3. ✅ Update your production database (if deployed)
4. ✅ Consider cloud storage for media files

## 🌐 Production Deployment

If you already have a deployed app:

```bash
# Pull production environment variables
vercel env pull .env.production

# Run migration on production database
export DATABASE_URL="your-production-db-url"
npx prisma migrate deploy

# Redeploy
git add .
git commit -m "Add post voting and video support"
git push
```

## 🎉 You're Done!

Enjoy the new features:
- 🔼 Upvote great posts
- 🔽 Downvote poor content
- 🎥 Share video content
- 💬 Build a more engaging community!

---

Need help? Check the main [README.md](README.md) or [SETUP.md](SETUP.md)


