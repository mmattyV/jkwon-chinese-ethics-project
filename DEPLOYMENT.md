# Deployment Guide

This guide walks you through deploying your Reddit Clone to production.

## Pre-Deployment Checklist

- [ ] Test all features locally
- [ ] Verify database migrations work
- [ ] Check environment variables are set
- [ ] Test image uploads
- [ ] Review security settings
- [ ] Update SESSION_SECRET to a strong random value

## Deploy to Vercel (Recommended)

### Step 1: Prepare Your Database

Choose a database provider:

- **Neon** (Recommended): Free tier, serverless PostgreSQL
- **Vercel Postgres**: Integrated with Vercel
- **Supabase**: PostgreSQL with extra features
- **Railway**: Simple PostgreSQL hosting

### Step 2: Set Up Vercel Project

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

### Step 3: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```env
DATABASE_URL=postgresql://user:password@host/database
SESSION_SECRET=your-production-secret-key-here
```

**Important**: Use a strong random string for SESSION_SECRET:
```bash
# Generate on your machine:
openssl rand -base64 32
```

### Step 4: Deploy Database Schema

After your Vercel deployment is live:

```bash
# Set your production database URL locally
export DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma migrate deploy

# Or use Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy
```

### Step 5: Deploy

```bash
# Using Vercel CLI
vercel --prod

# Or just push to GitHub (if auto-deploy is enabled)
git push origin main
```

## Deploy to Other Platforms

### Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variables in Netlify Dashboard
4. Use Netlify Functions for API routes (requires adapter)

**Note**: Netlify requires additional configuration for Next.js App Router. Vercel is recommended.

### Railway

1. Create new project on [railway.app](https://railway.app)
2. Add PostgreSQL service
3. Add your GitHub repo
4. Set environment variables
5. Railway auto-deploys on push

### DigitalOcean App Platform

1. Create new app from GitHub
2. Add managed PostgreSQL database
3. Set environment variables
4. Configure build settings
5. Deploy

## Database Setup (Detailed)

### Using Neon

1. **Create Project**
   - Go to [neon.tech](https://neon.tech)
   - Sign up and create new project
   - Select region closest to your users

2. **Get Connection String**
   - Copy the connection string from dashboard
   - It looks like: `postgresql://user:pass@host/db?sslmode=require`

3. **Add to Vercel**
   - Paste in Vercel environment variables as `DATABASE_URL`

4. **Run Migrations**
   ```bash
   DATABASE_URL="your-neon-url" npx prisma migrate deploy
   ```

### Using Vercel Postgres

1. **Add to Project**
   - In Vercel Dashboard → Storage → Create Database
   - Select Postgres

2. **Auto-Configuration**
   - Vercel automatically adds environment variables
   - No manual configuration needed

3. **Run Migrations**
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

### Using Supabase

1. **Create Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project

2. **Get Connection String**
   - Settings → Database → Connection string
   - Use "Transaction" pooling mode for Prisma

3. **Update Format**
   ```
   postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true
   ```

## Post-Deployment Tasks

### 1. Verify Deployment

- [ ] Visit your deployed URL
- [ ] Test signup/login
- [ ] Create a test post
- [ ] Upload an image
- [ ] Add comments and votes
- [ ] Check pagination

### 2. Monitor Performance

- Check Vercel Analytics
- Review error logs
- Monitor database usage

### 3. Set Up Custom Domain (Optional)

In Vercel:
1. Go to Settings → Domains
2. Add your domain
3. Configure DNS settings
4. Wait for SSL certificate

## Security Considerations

### Essential Security Updates

1. **Strong SESSION_SECRET**
   ```bash
   # Generate a secure random string
   openssl rand -base64 32
   ```

2. **Database Security**
   - Use connection pooling for production
   - Enable SSL for database connections
   - Restrict database access by IP if possible

3. **Environment Variables**
   - Never commit `.env` files
   - Use different secrets for dev/prod
   - Rotate secrets periodically

4. **Rate Limiting** (Future Enhancement)
   - Add rate limiting to API routes
   - Protect against brute force attacks

## Performance Optimization

### Image Optimization

Images are automatically optimized by Next.js Image component.

For better performance:
1. Consider using a CDN (Cloudflare, Vercel Edge)
2. Or use cloud storage (AWS S3, Cloudinary)

### Database Optimization

```prisma
// Already added in schema:
@@index([createdAt])  // On Post model
@@index([postId])     // On Comment model
```

### Caching

Consider adding:
- Redis for session storage
- Edge caching for static content
- ISR (Incremental Static Regeneration) for posts

## Monitoring & Maintenance

### Health Checks

Create a health check endpoint:

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: 'healthy' })
  } catch (error) {
    return NextResponse.json({ status: 'unhealthy' }, { status: 503 })
  }
}
```

### Error Tracking

Consider integrating:
- [Sentry](https://sentry.io) - Error tracking
- [LogRocket](https://logrocket.com) - Session replay
- Vercel Analytics - Built-in analytics

### Database Backups

- **Neon**: Automatic backups included
- **Vercel Postgres**: Automatic backups
- **Supabase**: Automatic backups
- Manual: Use `pg_dump` for local backups

## Rollback Procedure

If something goes wrong:

1. **Revert Deployment**
   ```bash
   # Vercel CLI
   vercel rollback
   ```
   Or use Vercel Dashboard → Deployments → Promote to Production

2. **Revert Database Migration**
   ```bash
   # This is why we keep migration files!
   npx prisma migrate resolve --rolled-back [migration_name]
   ```

## Cost Estimates

### Free Tier Usage
- **Vercel**: Free for hobby projects
- **Neon**: 10GB storage, 100 hours compute/month
- **Vercel Postgres**: Free tier available
- **Total**: $0/month for small projects

### Paid Tiers
- **Vercel Pro**: $20/month (better performance)
- **Neon Pro**: $19/month (more resources)
- Estimated total for medium traffic: $40-100/month

## Troubleshooting

### Build Fails

```bash
# Check build logs
vercel logs

# Common fixes:
npm run build  # Test locally first
npx prisma generate  # Ensure Prisma client is generated
```

### Database Connection Issues

- Verify DATABASE_URL format
- Check SSL requirements (`?sslmode=require`)
- Ensure database is accessible from Vercel IPs

### Images Not Loading

- Check `/public/uploads` is in `.gitignore`
- For production, use cloud storage (S3, Cloudinary)
- Or use Vercel Blob storage

## Next Steps

After successful deployment:

1. Set up monitoring and alerts
2. Configure automated backups
3. Add analytics
4. Implement rate limiting
5. Consider adding a CDN
6. Set up CI/CD pipeline
7. Add end-to-end tests

## Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)

---

Good luck with your deployment! 🚀

