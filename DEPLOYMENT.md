# 🚀 KalaShetra Deployment Guide

## Quick Deploy (5 Minutes to Live Prototype!)

### Step 1: Deploy Backend to Railway

1. **Sign up at [Railway.app](https://railway.app)** with your GitHub account
2. **Click "New Project" → "Deploy from GitHub repo"**
3. **Select your KalaShetra repository**
4. **Railway will auto-detect Node.js and deploy the server folder**
5. **Add Environment Variables in Railway dashboard:**
   ```
   GEMINI_API_KEY=AIzaSyDTkPkFGA6eu37ug54RIKCrtN8oXqvmOiQ
   PORT=5001
   NODE_ENV=production
   ```
6. **Copy your Railway backend URL** (looks like: `https://kalashetra-backend-production.up.railway.app`)

### Step 2: Deploy Frontend to Vercel

1. **Update your backend URL:**
   - Create `.env.production` file in root directory
   - Add: `VITE_API_URL=https://your-railway-url.railway.app/api`

2. **Build for production:**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign up with GitHub
   - Click "New Project" → Import your KalaShetra repo
   - Vercel will auto-detect it's a Vite project
   - Add environment variable: `VITE_API_URL=https://your-railway-url.railway.app/api`
   - Deploy!

### Step 3: Test Your Live Prototype

Your KalaShetra prototype will be live at:
- **Frontend:** `https://your-project-name.vercel.app`
- **Backend:** `https://your-project-name.railway.app`

## Alternative: Deploy to Netlify + Render

### Backend on Render:
1. Go to [render.com](https://render.com)
2. Connect GitHub and select your repo
3. Choose "Web Service" and set:
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Environment Variables:** Add your Gemini API key

### Frontend on Netlify:
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your `dist` folder after running `npm run build`
3. Or connect GitHub for auto-deploys

## 🎯 What You'll Get

After deployment, your prototype will have:
- ✅ **Live AI-powered product descriptions**
- ✅ **Cultural storytelling in multiple languages**
- ✅ **Voice narration for products**
- ✅ **Complete artisan dashboard**
- ✅ **Customer marketplace**
- ✅ **All AI features working with Gemini API**

## 🔧 Troubleshooting

**Backend not working?**
- Check Railway logs for errors
- Ensure Gemini API key is correctly set
- Verify all environment variables are added

**Frontend can't connect to backend?**
- Check that VITE_API_URL points to your deployed backend
- Ensure backend URL ends with `/api`
- Check browser console for CORS errors

**AI features not working?**
- Verify Gemini API key is valid and has quota
- Check backend logs for API errors
- Test backend endpoints directly

## 📱 Share Your Prototype

Once deployed, you can share your live prototype link with:
- Potential users and artisans
- Investors or stakeholders  
- The developer community
- Anyone interested in AI + cultural preservation!

Your prototype will be fully functional with real AI features powered by Google Gemini! 🎨✨
