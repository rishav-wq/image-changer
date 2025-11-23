# Deployment Guide

## Quick Deploy Steps

### 1. Deploy Backend (Render/Railway)

#### Using Render:
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     HUGGINGFACE_API_KEY=your_huggingface_api_key_here
     PORT=5000
     ```
5. Deploy!

#### Using Railway:
1. Go to [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub"
3. Select your repo
4. Add environment variables (same as above)
5. Deploy!

### 2. Deploy Frontend (Vercel/Netlify)

#### Using Vercel:
```bash
cd client
npm install -g vercel
vercel
```

Configure:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variable**: 
  - `VITE_API_URL` = Your backend URL (e.g., `https://your-app.onrender.com/api`)

#### Using Netlify:
```bash
cd client
npm install -g netlify-cli
netlify deploy --prod
```

Configure same as Vercel.

### 3. Update Client .env

After deploying backend, update `client/.env`:
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

Rebuild and redeploy frontend.

## Alternative: Deploy Both on Render

Create two separate services:
1. **Backend Service** (as described above)
2. **Frontend Service**:
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm install -g serve && serve -s dist -p $PORT`

## Local Testing

```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend
cd client
npm install
npm run dev
```

Visit: `http://localhost:3000`
