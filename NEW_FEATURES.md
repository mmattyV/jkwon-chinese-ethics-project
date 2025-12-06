# 🎉 New Features Added!

## Overview

I've added two powerful new features to **PhiloFeed**:

1. **📊 Post Voting System** - Upvote/downvote posts
2. **🎥 Video Upload Support** - Share video content

---

## 1. Post Voting 🔼🔽

### What It Does

Users can now vote on posts, just like they could on comments. This helps surface the best content to the community.

### Features

- **Upvote** (👍): Click the up arrow to like a post
- **Downvote** (👎): Click the down arrow to dislike a post
- **Toggle**: Click the same button again to remove your vote
- **Switch**: Click the opposite button to change your vote
- **Score**: See the vote count displayed between the arrows
- **Login Required**: Non-logged-in users are redirected to login

### Where You'll See It

#### Home Feed
- Vote buttons appear on the **left side** of each post card
- Vertical layout: ⬆️ Score ⬇️
- Upvoted posts show a cerulean (blue) up arrow
- Downvoted posts show a gray down arrow

#### Post Detail Page
- Same vertical voting layout on the left
- Vote while reading the full post
- Instant feedback with color changes

### How to Use

```
1. Browse posts on home feed or visit a post detail page
2. Click ⬆️ to upvote (turns cerulean blue when active)
3. Click ⬇️ to downvote (turns gray when active)
4. Click again to remove your vote
5. See the score update in real-time
```

### Technical Details

- Votes stored in new `PostVote` table
- One vote per user per post (unique constraint)
- Score calculated as: sum of all vote values
- Real-time updates using Next.js router refresh

---

## 2. Video Upload Support 🎥

### What It Does

Users can now upload video content when creating posts, making PhiloFeed a richer multimedia platform.

### Features

- **Multiple Formats**: MP4, WebM, OGG, MOV (QuickTime)
- **Large File Support**: Up to 50MB per video (10x larger than images)
- **Video Preview**: See your video before posting
- **Native Player**: HTML5 video player with full controls
- **Mutual Exclusion**: Upload either image OR video (not both)

### Supported Formats

| Format | Extension | Browser Support | Recommended |
|--------|-----------|----------------|-------------|
| MP4 | `.mp4` | ✅ Excellent | ⭐ Best choice |
| WebM | `.webm` | ✅ Good | 👍 Web-optimized |
| OGG | `.ogg` | ⚠️ Partial | 🔧 Limited |
| MOV | `.mov` | ⚠️ Safari | 🍎 Apple devices |

**Recommendation**: Use MP4 for best compatibility across all browsers.

### How to Upload Videos

#### Step 1: Create Post
1. Log in and click "Create Post"
2. Enter title and content

#### Step 2: Choose Media Type
You'll see two upload options side-by-side:
- **Image** (left box) - for photos
- **Video** (right box) - for videos

#### Step 3: Upload Video
1. Click the "Video" box
2. Select your video file (must be under 50MB)
3. See video preview with playback controls
4. Remove and reselect if needed

#### Step 4: Submit
1. Click "Create Post"
2. Video is uploaded and saved
3. View your post with embedded video player

### Video Player Controls

On post detail pages, videos include:
- ▶️ Play/Pause button
- 🔊 Volume control
- ⏩ Seek bar (scrub through video)
- ⛶ Fullscreen mode
- ⚙️ Browser-native controls

### File Size Limits

| Media Type | Max Size | Why? |
|------------|----------|------|
| Images | 5MB | Quick loading, responsive design |
| Videos | 50MB | Balance quality vs. upload time |

### UI Changes

#### Create Post Form

**Before**: Single image upload box

**After**: Side-by-side media selection:
```
┌─────────────┬─────────────┐
│   📷        │    🎥       │
│  Image      │   Video     │
│  Up to 5MB  │  Up to 50MB │
└─────────────┴─────────────┘
```

- Choose one by clicking
- Preview appears below
- Remove button in top-right corner

#### Post Cards (Home Feed)

- Video posts show a **play icon** (▶️) thumbnail
- Gray background with play button overlay
- Indicates video content at a glance

#### Post Detail Page

- Full-width video player
- Responsive sizing (max-width maintains aspect ratio)
- Native HTML5 controls

---

## 🗄️ Database Changes

### New Table: PostVote

```prisma
model PostVote {
  id        String   @id @default(cuid())
  postId    String
  userId    String
  value     Int      // 1 for upvote, -1 for downvote
  createdAt DateTime @default(now())
  
  @@unique([postId, userId])  // One vote per user per post
  @@index([postId])           // Fast lookups
}
```

### Updated Post Model

```prisma
model Post {
  // ... existing fields
  videoUrl  String?      // NEW: Optional video URL
  votes     PostVote[]   // NEW: Relation to votes
}
```

### Updated User Model

```prisma
model User {
  // ... existing fields
  postVotes  PostVote[]  // NEW: User's post votes
}
```

---

## 🚀 Getting Started

### **IMPORTANT**: Run Database Migration

Before using the new features, you **must** update your database:

```bash
# Generate Prisma Client
npx prisma generate

# Apply migration
npx prisma migrate dev --name add_post_voting_and_video_support

# Verify in Prisma Studio
npx prisma studio
```

**See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for detailed instructions.**

### Test the Features

1. **Start dev server**: `npm run dev`
2. **Test post voting**:
   - Create a post
   - Upvote it (arrow turns blue)
   - Downvote it (arrow turns gray)
   - Remove vote (click again)
3. **Test video upload**:
   - Create a post
   - Click "Video" upload
   - Select an MP4 file
   - See preview
   - Submit and view

---

## 🎨 Design Considerations

### Vote Button Colors

- **Upvote (active)**: Cerulean (#0EA5E9) - matches PhiloFeed's brand
- **Downvote (active)**: Gray (#6B7280) - subtle, less prominent
- **Inactive**: Light gray (#9CA3AF) - neutral
- **Score positive**: Cerulean (encourages engagement)
- **Score negative**: Gray (neutral, not aggressive)

### Video Upload UX

- **Side-by-side choice**: Clear, intentional selection
- **Large preview**: See what you're posting
- **Easy removal**: X button to change mind
- **File size warning**: Shows 50MB limit upfront
- **Loading states**: "Creating..." during upload

---

## 📊 Use Cases

### Post Voting

1. **Content curation**: Community upvotes quality posts
2. **Spam reduction**: Downvote low-quality content
3. **Engagement metric**: See what resonates
4. **User feedback**: Instant reaction to posts

### Video Upload

1. **Lectures & talks**: Share philosophical discussions
2. **Demonstrations**: Show concepts visually
3. **Debates**: Post video responses
4. **Interviews**: Share thought leader content
5. **Personal vlogs**: Express ideas through video

---

## 🔧 API Reference

### New Endpoint: POST /api/posts/[id]/vote

**Request**:
```json
{
  "value": 1  // 1 for upvote, -1 for downvote
}
```

**Response**:
```json
{
  "score": 5,
  "votes": [
    { "id": "...", "userId": "...", "value": 1 },
    // ... more votes
  ]
}
```

**Behavior**:
- Same vote: Removes vote (toggle off)
- Different vote: Updates to new value
- No prior vote: Creates new vote

### Updated: POST /api/posts

Now accepts `video` in FormData:

```javascript
const formData = new FormData()
formData.append('title', 'My Title')
formData.append('content', 'My Content')
formData.append('video', videoFile)  // NEW

// OR
formData.append('image', imageFile)  // Existing

// NOT both! Will return error if both provided
```

---

## ⚠️ Important Notes

### Production Considerations

1. **File Storage**: Videos stored in `/public/uploads/` locally
   - For production, use cloud storage (AWS S3, Cloudinary, Vercel Blob)
   - Local storage is ephemeral on Vercel (files disappear after ~12 hours)

2. **File Size**: 50MB is generous for development
   - Consider smaller limits for production (10-20MB)
   - Implement compression for better UX

3. **Bandwidth**: Videos consume more bandwidth
   - Monitor usage if on free tier
   - Consider CDN for popular videos

### Browser Compatibility

- **MP4**: ✅ All modern browsers
- **WebM**: ✅ Chrome, Firefox, Edge (not Safari)
- **OGG**: ⚠️ Limited support
- **MOV**: ⚠️ Safari only

### Mobile Considerations

- Large videos may be slow on mobile data
- Consider adding mobile-specific size warnings
- Native mobile browsers handle video well

---

## 🐛 Troubleshooting

### Vote Not Working

```bash
# Regenerate Prisma Client
npx prisma generate

# Restart dev server
npm run dev
```

### Video Upload Fails

1. Check file size (must be under 50MB)
2. Check file format (MP4 recommended)
3. Check browser console for errors
4. Try a different video file

### Database Errors

```bash
# Reset and reapply migrations
npx prisma migrate reset
npx prisma migrate dev
```

### Video Not Playing

1. Try MP4 format (best compatibility)
2. Check video codec (H.264 is universal)
3. Open browser console for errors

---

## 🎯 Future Enhancements

Potential additions:

- [ ] Sort by vote score (hot/top posts)
- [ ] Video thumbnail generation
- [ ] Video compression on upload
- [ ] Cloud storage integration
- [ ] Embed YouTube/Vimeo videos
- [ ] Video upload progress bar
- [ ] Vote count on post cards
- [ ] Controversial posts (equal up/down)

---

## 📚 Documentation

- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Database update instructions
- **[README.md](README.md)** - Complete project documentation
- **[SETUP.md](SETUP.md)** - Initial setup guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment

---

## 🎉 Enjoy!

Your PhiloFeed community can now:
- 🔼 Upvote brilliant ideas
- 🔽 Downvote poor content
- 🎥 Share video discussions
- 💬 Engage with rich media

**Happy building! 🌊**


