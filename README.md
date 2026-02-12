# 🎨 Carys Comics

A beautiful comic gallery and upload system for showcasing original artwork.

## Features

- **Public Gallery** - Beautiful grid layout with hover effects and featured comics
- **Password Login** - Simple, kid-friendly authentication
- **Admin Panel** - Upload, edit, and delete comics easily
- **Image Storage** - Uses Vercel Blob for reliable image hosting
- **Mobile Friendly** - Responsive design that works on all devices

## Setup on Vercel

1. **Import the repo** at [vercel.com/new](https://vercel.com/new)

2. **Add a Blob Store**:
   - Go to your project → Storage → Create Database → Blob
   - This auto-configures the `BLOB_READ_WRITE_TOKEN`

3. **Set Environment Variables** (Settings → Environment Variables):
   ```
   NEXTAUTH_SECRET=<run: openssl rand -base64 32>
   NEXTAUTH_URL=https://your-domain.vercel.app
   ADMIN_PASSWORD=<choose a password for Carys>
   ```

4. **Redeploy** after adding env vars

## Usage

- **View Gallery**: Visit the homepage
- **Login**: Click the 🔐 icon (top right) or go to `/login`
- **Admin Panel**: After login, access at `/admin`
- **Upload**: Click "Add New Comic", select image, add title/description

## Local Development

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your values
npm run dev
```

Note: For local image uploads, you'll need a Vercel Blob token. Alternatively, images can be placed directly in `/public/comics/` for development.

## Tech Stack

- Next.js 16
- Tailwind CSS
- NextAuth.js
- Vercel Blob Storage

---

Made with 💜 for Carys
