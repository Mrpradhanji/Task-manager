# Frontend Deployment Guide - Vercel

## Prerequisites
- GitHub account
- Vercel account (free at vercel.com)
- Your backend already deployed on Render

## Steps to Deploy

### 1. Push to GitHub
If you haven't already, push your project to GitHub:
```bash
cd Task-manager
git add .
git commit -m "Update API URLs for deployment"
git push origin main
```

### 2. Deploy to Vercel

1. **Go to Vercel**: Visit [vercel.com](https://vercel.com) and sign in with your GitHub account

2. **Import Project**: Click "New Project" and select your GitHub repository

3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (since your frontend is in a subdirectory)
   - **Build Command**: `npm run build` (should be auto-detected)
   - **Output Directory**: `dist` (should be auto-detected)
   - **Install Command**: `npm install` (should be auto-detected)

4. **Environment Variables** (if needed):
   - You can add any environment variables here if you have any
   - Currently, all API URLs are hardcoded to the deployed backend

5. **Deploy**: Click "Deploy"

### 3. Verify Deployment

After deployment:
1. Your app will be available at a URL like: `https://your-project-name.vercel.app`
2. Test the login/signup functionality
3. Test creating and managing tasks
4. Verify that all API calls work with the deployed backend

### 4. Custom Domain (Optional)

You can add a custom domain in the Vercel dashboard under your project settings.

## Troubleshooting

### Common Issues:

1. **Build Errors**: Check the build logs in Vercel dashboard
2. **API Connection Issues**: Verify your backend is running on Render
3. **CORS Errors**: Your backend CORS is already configured for Vercel domains

### Backend URL
Your backend is deployed at: `https://task-manager-3-37o6.onrender.com`

All frontend API calls are already configured to use this URL.

## Notes
- The frontend will automatically rebuild when you push changes to GitHub
- You can preview deployments before making them live
- Vercel provides analytics and performance monitoring 