# Glucose Tracker - 20 Day Challenge

A simple, full-stack web application for tracking blood glucose readings over a 20-day challenge with randomized finger assignments.

## Tech Stack
- **Frontend**: Next.js 14 + React + TypeScript + Tailwind CSS + Recharts
- **Backend**: Next.js API Routes (Node.js)
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (HTTP-only cookies) + bcryptjs

## Quick Start

1. **Clone & Install**
   ```bash
   git clone <your-repo>
   cd glucose-tracker
   npm install
   ```

2. **Environment Variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/glucose-tracker
   JWT_SECRET=your-super-secret-key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Run**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

## Features
- Secure auth (register/login/logout)
- 20-day challenge with random finger selection
- Daily glucose reading entry
- Streak tracking
- Progress visualization
- Full analysis dashboard (unlocks after day 20)
- Responsive mobile-first design
- Browser reminder notifications
