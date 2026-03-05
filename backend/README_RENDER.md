# Render Deployment Guide

## Prerequisites
- MongoDB Atlas account and database URI
- Render.com account

## Deployment Steps

### 1. Set Up MongoDB
- Create a MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas
- Get your connection string (MONGO_URI)
- Make sure your IP is whitelisted or use 0.0.0.0/0 for Render

### 2. Deploy to Render
1. Push your code to GitHub
2. Go to https://dashboard.render.com
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Use these settings:
   - **Name**: library-management-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid based on needs)

### 3. Set Environment Variables
In Render dashboard, add these environment variables:
- `MONGO_URI`: Your MongoDB connection string from Atlas
- `NODE_ENV`: production

### 4. Deploy
- Click "Create Web Service"
- Render will automatically build and deploy
- Get your live API URL from the Render dashboard

## Testing
Once deployed, test your API at:
```
https://your-service-name.onrender.com/
```

You should see: `{ message: "Library Management System API is running" }`

## Important Notes
- **Free tier limitations**: Services spin down after 15 minutes of inactivity
- **Paid tier**: No inactivity restrictions
- **Uptime**: For production, consider upgrading to a paid plan
- **Database**: Use MongoDB Atlas free tier or paid tier

## Troubleshooting
- Check build logs in Render dashboard
- Verify MONGO_URI is correct and IP is whitelisted
- Ensure all required npm packages are installed
